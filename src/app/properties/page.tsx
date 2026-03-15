'use client';

import { useState, useMemo, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import PropertyCard from '@/components/properties/PropertyCard';
import { mockProperties } from '@/data/mockProperties';
import { createClient } from '@/lib/supabase/client';
import { CITIES, PROPERTY_TYPES, LISTING_TYPES, BEDROOM_OPTIONS } from '@/lib/constants';
import { Property } from '@/types';
import { formatPrice, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils';

const PropertyMap = dynamic(() => import('@/components/properties/PropertyMap'), { ssr: false });

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>(mockProperties);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('properties')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const supabaseIds = new Set(data.map((p: Property) => p.id));
          const uniqueMock = mockProperties.filter(p => !supabaseIds.has(p.id));
          setAllProperties([...data as Property[], ...uniqueMock]);
        }
      });
  }, []);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Bottom sheet states: 'half' (default, ~55%), 'full' (expanded, ~95%), 'collapsed' (map focus, ~15%)
  const [sheetState, setSheetState] = useState<'collapsed' | 'half' | 'full'>('half');
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const isDragging = useRef(false);

  // Filter states
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [listingType, setListingType] = useState(searchParams.get('listing_type') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProperties = useMemo(() => {
    return allProperties.filter((p: Property) => {
      if (city && p.city !== city) return false;
      if (listingType && p.listing_type !== listingType) return false;
      if (propertyType && p.property_type !== propertyType) return false;
      if (bedrooms && p.bedrooms !== parseInt(bedrooms)) return false;
      if (minPrice && p.price < parseInt(minPrice)) return false;
      if (maxPrice && p.price > parseInt(maxPrice)) return false;
      return true;
    });
  }, [allProperties, city, listingType, propertyType, bedrooms, minPrice, maxPrice]);

  const clearFilters = () => {
    setCity(''); setListingType(''); setPropertyType('');
    setBedrooms(''); setMinPrice(''); setMaxPrice('');
  };

  const hasFilters = city || listingType || propertyType || bedrooms || minPrice || maxPrice;

  // Sheet height percentages
  const sheetHeight = sheetState === 'full' ? '92vh' : sheetState === 'half' ? '55vh' : '18vh';

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Touch handlers for drag — works on handle AND sheet when scrolled to top
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragCurrentY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    dragCurrentY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragStartY.current - dragCurrentY.current;

    // Swipe up (positive diff)
    if (diff > 50) {
      if (sheetState === 'collapsed') setSheetState('half');
      else if (sheetState === 'half') setSheetState('full');
    }
    // Swipe down (negative diff)
    else if (diff < -50) {
      if (sheetState === 'full') setSheetState('half');
      else if (sheetState === 'half') setSheetState('collapsed');
    }
  }, [sheetState]);

  // Sheet body touch: expand sheet on scroll up from top, collapse on scroll down from top
  const handleSheetTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollEl = scrollContainerRef.current;
    if (scrollEl && scrollEl.scrollTop <= 5) {
      dragStartY.current = e.touches[0].clientY;
      dragCurrentY.current = e.touches[0].clientY;
      isDragging.current = true;
    } else {
      isDragging.current = false;
    }
  }, []);

  const handleSheetTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    dragCurrentY.current = e.touches[0].clientY;
    const diff = dragStartY.current - dragCurrentY.current;
    // If at top of scroll and swiping up → expand sheet (prevent card scroll)
    if (diff > 10 && sheetState !== 'full') {
      e.preventDefault();
    }
    // If at top of scroll and swiping down → collapse sheet
    if (diff < -10) {
      e.preventDefault();
    }
  }, [sheetState]);

  // Desktop marker click
  const handleMarkerClickDesktop = useCallback((id: string) => {
    setActiveId(id);
    const el = document.getElementById(`property-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // Mobile marker click — collapse sheet + show popup
  const handleMarkerClickMobile = useCallback((id: string) => {
    setActiveId(id);
    const property = filteredProperties.find(p => p.id === id);
    if (property) {
      setSelectedProperty(property);
      setSheetState('collapsed'); // Collapse sheet to show map + popup
    }
  }, [filteredProperties]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Filter Bar */}
      <div className="bg-white border-b border-black/10 sticky top-[73px] z-40">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <div className="flex gap-0 border-2 border-black/10 flex-shrink-0">
              {LISTING_TYPES.map((lt) => (
                <button key={lt.value}
                  onClick={() => setListingType(listingType === lt.value ? '' : lt.value)}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-r border-black/10 last:border-r-0 ${
                    listingType === lt.value ? 'bg-black text-white' : 'text-black/40 hover:text-black'
                  }`}>{lt.label}</button>
              ))}
            </div>
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="px-3 py-2 bg-white border-2 border-black/10 text-xs font-bold uppercase tracking-wider focus:border-black outline-none flex-shrink-0">
              <option value="">All Cities</option>
              {CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
              className="px-3 py-2 bg-white border-2 border-black/10 text-xs font-bold uppercase tracking-wider focus:border-black outline-none flex-shrink-0">
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((pt) => (<option key={pt.value} value={pt.value}>{pt.label}</option>))}
            </select>
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
              className="px-3 py-2 bg-white border-2 border-black/10 text-xs font-bold uppercase tracking-wider focus:border-black outline-none flex-shrink-0">
              <option value="">Bedrooms</option>
              {BEDROOM_OPTIONS.map((b) => (<option key={b.value} value={b.value}>{b.label}</option>))}
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 border-2 border-black/10 text-xs font-black uppercase tracking-wider hover:border-black flex-shrink-0 transition-all">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Price
            </button>
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-black uppercase tracking-wider text-black/50 hover:text-black flex-shrink-0">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          {showFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40 flex-shrink-0">Price:</span>
              <input type="number" placeholder="Min ₹" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)} className="px-3 py-2 bg-white border-2 border-black/10 focus:border-black text-xs outline-none w-28" />
              <span className="text-black/30">—</span>
              <input type="number" placeholder="Max ₹" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)} className="px-3 py-2 bg-white border-2 border-black/10 focus:border-black text-xs outline-none w-28" />
            </div>
          )}
        </div>
      </div>

      {/* === DESKTOP: Split View (lg+) === */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="w-1/2 xl:w-[45%] overflow-y-auto h-[calc(100vh-180px)] px-4 pb-4">
          <div className="py-2 text-xs font-black uppercase tracking-widest text-black/40">
            <span className="text-black">{filteredProperties.length}</span> properties found
          </div>
          {filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-black/30">
              <span className="text-5xl mb-4">🏠</span>
              <p className="text-lg font-black uppercase tracking-tighter">No properties found</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
              {filteredProperties.map((property) => (
                <div key={property.id} id={`property-${property.id}`}>
                  <PropertyCard property={property} isActive={activeId === property.id} onHover={setActiveId} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-1/2 xl:w-[55%] h-[calc(100vh-180px)] sticky top-[180px] p-2">
          <PropertyMap properties={filteredProperties} activeId={activeId} onMarkerClick={handleMarkerClickDesktop} />
        </div>
      </div>

      {/* === MOBILE: Map + Draggable Bottom Sheet (<lg) === */}
      <div className="lg:hidden relative flex-1" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Full-screen Map Background */}
        <div className="absolute inset-0">
          <PropertyMap
            properties={filteredProperties}
            activeId={activeId}
            onMarkerClick={handleMarkerClickMobile}
            visible={true}
          />
        </div>

        {/* Popup card when marker clicked */}
        {selectedProperty && sheetState === 'collapsed' && (
          <div className="absolute top-auto bottom-[20vh] left-3 right-3 z-[50]">
            <div className="bg-white shadow-xl overflow-hidden relative border border-black/10">
              <Link href={`/properties/${selectedProperty.id}`} className="flex">
                <div className="relative w-[120px] h-[120px] flex-shrink-0">
                  <Image src={selectedProperty.images[0]} alt={selectedProperty.title}
                    fill className="object-cover" sizes="120px" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-black text-white text-[8px] font-black uppercase px-2 py-0.5 tracking-widest">
                      {getListingTypeLabel(selectedProperty.listing_type)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="font-black text-lg">
                      {formatPrice(selectedProperty.price, selectedProperty.listing_type)}
                    </p>
                    <p className="text-xs font-black uppercase tracking-tight line-clamp-1 mt-0.5">{selectedProperty.title}</p>
                    <p className="text-[10px] text-black/40 uppercase tracking-widest mt-1 line-clamp-1">
                      📍 {selectedProperty.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-black/50 mt-1">
                    {selectedProperty.bedrooms > 0 && <span>🛏 {selectedProperty.bedrooms}</span>}
                    {selectedProperty.bathrooms > 0 && <span>🚿 {selectedProperty.bathrooms}</span>}
                    <span>📐 {selectedProperty.area_sqft.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Link>
              <button onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 w-6 h-6 bg-white border border-black/10 flex items-center justify-center">
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* Draggable Bottom Sheet */}
        <div
          ref={sheetRef}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-[40] flex flex-col transition-[height] duration-300 ease-out"
          style={{ height: sheetHeight }}
        >
          {/* Drag Handle — swipe area */}
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              // Click to toggle between half and full
              if (sheetState === 'collapsed') setSheetState('half');
              else if (sheetState === 'half') setSheetState('full');
              else setSheetState('half');
            }}
          >
            <div className="w-10 h-1 bg-black/20 rounded-full" />
          </div>

          {/* Count */}
          <div className="px-4 pb-2 text-center flex-shrink-0">
            <p className="text-xs font-black uppercase tracking-widest text-black/40">
              <span className="text-black">{filteredProperties.length}</span> properties
            </p>
          </div>

          {/* Scrollable Cards — swipe down collapses sheet when at top */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 pb-8"
            onTouchStart={handleSheetTouchStart}
            onTouchMove={handleSheetTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="block bg-white border border-black/5 hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="relative aspect-[16/10] bg-zinc-200 overflow-hidden">
                    <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full"
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      {property.images.map((img, i) => (
                        <div key={i} className="relative flex-shrink-0 w-full h-full snap-start">
                          <Image src={img} alt={`${property.title} ${i + 1}`}
                            fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                        </div>
                      ))}
                    </div>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                      <span className="text-sm text-black/40">♡</span>
                    </button>
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest">
                        {getListingTypeLabel(property.listing_type)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-black text-sm uppercase tracking-tight line-clamp-1">{property.title}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/40 border border-black/10 px-2 py-0.5 flex-shrink-0 ml-2">
                        {getPropertyTypeLabel(property.property_type)}
                      </span>
                    </div>
                    <p className="text-[10px] text-black/40 uppercase tracking-widest mb-2">
                      📍 {property.address}, {property.city}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-black/50 mb-2">
                      {property.bedrooms > 0 && <span className="flex items-center gap-1"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>{property.bedrooms} Bed</span>}
                      {property.bathrooms > 0 && <span className="flex items-center gap-1"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2.25"/></svg>{property.bathrooms} Bath</span>}
                      <span className="flex items-center gap-1"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>{property.area_sqft.toLocaleString('en-IN')} sqft</span>
                    </div>
                    <p className="font-black text-lg">
                      {formatPrice(property.price, property.listing_type)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
