'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Map, List, SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import PropertyCard from '@/components/properties/PropertyCard';
import { mockProperties } from '@/data/mockProperties';
import { CITIES, PROPERTY_TYPES, LISTING_TYPES, BEDROOM_OPTIONS } from '@/lib/constants';
import { Property } from '@/types';

const PropertyMap = dynamic(() => import('@/components/properties/PropertyMap'), { ssr: false });

function PropertiesContent() {
  const searchParams = useSearchParams();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states from URL params
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [listingType, setListingType] = useState(searchParams.get('listing_type') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Filter properties
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
    setCity('');
    setListingType('');
    setPropertyType('');
    setBedrooms('');
    setMinPrice('');
    setMaxPrice('');
  };

  const hasFilters = city || listingType || propertyType || bedrooms || minPrice || maxPrice;

  const handleMarkerClick = useCallback((id: string) => {
    setActiveId(id);
    const el = document.getElementById(`property-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {/* Listing type pills */}
            <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 flex-shrink-0">
              {LISTING_TYPES.map((lt) => (
                <button
                  key={lt.value}
                  onClick={() => setListingType(listingType === lt.value ? '' : lt.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    listingType === lt.value
                      ? 'bg-white text-primary-500 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {lt.label}
                </button>
              ))}
            </div>

            {/* City filter */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input-field py-1.5 text-sm w-auto min-w-[120px] flex-shrink-0"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Property type filter */}
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="input-field py-1.5 text-sm w-auto min-w-[130px] flex-shrink-0"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>

            {/* Bedrooms filter */}
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="input-field py-1.5 text-sm w-auto min-w-[110px] flex-shrink-0"
            >
              <option value="">Bedrooms</option>
              {BEDROOM_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>

            {/* More Filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 flex-shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Price
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-accent-500 hover:text-accent-600 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Map/List toggle (mobile) */}
            <button
              onClick={() => setShowMap(!showMap)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500 text-white text-sm flex-shrink-0"
            >
              {showMap ? <List className="w-3.5 h-3.5" /> : <Map className="w-3.5 h-3.5" />}
              {showMap ? 'List' : 'Map'}
            </button>
          </div>

          {/* Price filter panel */}
          {showFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="text-sm text-slate-500 flex-shrink-0">Price Range:</span>
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input-field py-1.5 text-sm w-32"
              />
              <span className="text-slate-400">—</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input-field py-1.5 text-sm w-32"
              />
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 py-2 text-sm text-slate-500">
        <span className="font-medium text-slate-700">{filteredProperties.length}</span> properties found
      </div>

      {/* Main Content — Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Property List */}
        <div
          className={`${
            showMap ? 'hidden lg:block lg:w-1/2 xl:w-[45%]' : 'w-full'
          } overflow-y-auto h-[calc(100vh-180px)] px-4 pb-4`}
        >
          {filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Map className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm">Try adjusting your filters</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-3 text-accent-500 text-sm font-medium">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-4 ${showMap ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredProperties.map((property) => (
                <div key={property.id} id={`property-${property.id}`}>
                  <PropertyCard
                    property={property}
                    isActive={activeId === property.id}
                    onHover={setActiveId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div
          className={`${
            showMap ? 'w-full lg:w-1/2 xl:w-[55%]' : 'hidden'
          } h-[calc(100vh-180px)] sticky top-[180px] p-2`}
        >
          <PropertyMap
            properties={filteredProperties}
            activeId={activeId}
            onMarkerClick={handleMarkerClick}
          />
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
