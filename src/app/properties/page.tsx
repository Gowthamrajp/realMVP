'use client';

import { useState, useMemo, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Map, SlidersHorizontal, X, MapPin, BedDouble, Bath, Maximize, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import PropertyCard from '@/components/properties/PropertyCard';
import { mockProperties } from '@/data/mockProperties';
import { CITIES, PROPERTY_TYPES, LISTING_TYPES, BEDROOM_OPTIONS } from '@/lib/constants';
import { Property } from '@/types';
import { formatPrice, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils';

const PropertyMap = dynamic(() => import('@/components/properties/PropertyMap'), { ssr: false });

function PropertiesContent() {
  const searchParams = useSearchParams();

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
    return mockProperties.filter((p: Property) => {
      if (city && p.city !== city) return false;
      if (listingType && p.listing_type !== listingType) return false;
      if (propertyType && p.property_type !== propertyType) return false;
      if (bedrooms && p.bedrooms !== parseInt(bedrooms)) return false;
      if (minPrice && p.price < parseInt(minPrice)) return false;
      if (maxPrice && p.price > parseInt(maxPrice)) return false;
      return true;
    });
  }, [city, listingType, propertyType, bedrooms, minPrice, maxPrice]);

  const clearFilters = () => {
    setCity(''); setListingType(''); setPropertyType('');
    setBedrooms(''); setMinPrice(''); setMaxPrice('');
  };

  const hasFilters = city || listingType || propertyType || bedrooms || minPrice || maxPrice;

  // Sheet height percentages
  const sheetHeight = sheetState === 'full' ? '92vh' : sheetState === 'half' ? '55vh' : '18vh';

  // Touch handlers for drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
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
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 flex-shrink-0">
              {LISTING_TYPES.map((lt) => (
                <button key={lt.value}
                  onClick={() => setListingType(listingType === lt.value ? '' : lt.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    listingType === lt.value ? 'bg-white text-primary-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}>{lt.label}</button>
              ))}
            </div>
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="input-field py-1.5 text-sm w-auto min-w-[120px] flex-shrink-0">
              <option value="">All Cities</option>
              {CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
              className="input-field py-1.5 text-sm w-auto min-w-[130px] flex-shrink-0">
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((pt) => (<option key={pt.value} value={pt.value}>{pt.label}</option>))}
            </select>
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
              className="input-field py-1.5 text-sm w-auto min-w-[110px] flex-shrink-0">
              <option value="">Bedrooms</option>
              {BEDROOM_OPTIONS.map((b) => (<option key={b.value} value={b.value}>{b.label}</option>))}
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 flex-shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Price
            </button>
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-accent-500 flex-shrink-0">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          {showFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="text-sm text-slate-500 flex-shrink-0">Price:</span>
              <input type="number" placeholder="Min ₹" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)} className="input-field py-1.5 text-sm w-28" />
              <span className="text-slate-400">—</span>
              <input type="number" placeholder="Max ₹" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)} className="input-field py-1.5 text-sm w-28" />
            </div>
          )}
        </div>
      </div>

      {/* === DESKTOP: Split View (lg+) === */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="w-1/2 xl:w-[45%] overflow-y-auto h-[calc(100vh-180px)] px-4 pb-4">
          <div className="py-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{filteredProperties.length}</span> properties found
          </div>
          {filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Map className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No properties found</p>
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
              <Link href={`/properties/${selectedProperty.id}`} className="flex">
                <div className="relative w-[120px] h-[120px] flex-shrink-0">
                  <Image src={selectedProperty.images[0]} alt={selectedProperty.title}
                    fill className="object-cover" sizes="120px" />
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full text-white ${
                      selectedProperty.listing_type === 'sale' ? 'bg-emerald-500' :
                      selectedProperty.listing_type === 'rent' ? 'bg-blue-500' :
                      selectedProperty.listing_type === 'pg' ? 'bg-purple-500' : 'bg-amber-500'
                    }`}>{getListingTypeLabel(selectedProperty.listing_type)}</span>
                  </div>
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="font-display font-bold text-primary-500">
                      {formatPrice(selectedProperty.price, selectedProperty.listing_type)}
                    </p>
                    <p className="text-sm text-slate-800 font-medium line-clamp-1 mt-0.5">{selectedProperty.title}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{selectedProperty.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    {selectedProperty.bedrooms > 0 && (
                      <span className="flex items-center gap-0.5"><BedDouble className="w-3 h-3" />{selectedProperty.bedrooms}</span>
                    )}
                    {selectedProperty.bathrooms > 0 && (
                      <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{selectedProperty.bathrooms}</span>
                    )}
                    <span className="flex items-center gap-0.5"><Maximize className="w-3 h-3" />{selectedProperty.area_sqft.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Link>
              <button onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md">
                <X className="w-4 h-4 text-slate-500" />
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
            <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
          </div>

          {/* Count */}
          <div className="px-4 pb-2 text-center flex-shrink-0">
            <p className="text-sm font-medium text-slate-700">
              {filteredProperties.length} properties
            </p>
          </div>

          {/* Scrollable Cards */}
          <div className="flex-1 overflow-y-auto px-4 pb-8">
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="block card overflow-hidden"
                >
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <Image src={property.images[0]} alt={property.title}
                      fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm">
                      <Heart className="w-4 h-4 text-slate-600" />
                    </button>
                    <div className="absolute top-3 left-3">
                      <span className={`badge text-white ${
                        property.listing_type === 'sale' ? 'bg-emerald-500' :
                        property.listing_type === 'rent' ? 'bg-blue-500' :
                        property.listing_type === 'pg' ? 'bg-purple-500' : 'bg-amber-500'
                      }`}>{getListingTypeLabel(property.listing_type)}</span>
                    </div>
                    {property.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                        1 / {property.images.length}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-slate-800 line-clamp-1">{property.title}</h3>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{getPropertyTypeLabel(property.property_type)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{property.address}, {property.city}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                      {property.bedrooms > 0 && (<span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{property.bedrooms} Bed</span>)}
                      {property.bathrooms > 0 && (<span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.bathrooms} Bath</span>)}
                      <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{property.area_sqft.toLocaleString('en-IN')} sqft</span>
                    </div>
                    <p className="font-display font-bold text-lg text-primary-500">
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
