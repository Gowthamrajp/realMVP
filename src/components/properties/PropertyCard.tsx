'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types';
import { formatPrice, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils';
import { useState, useRef } from 'react';

interface PropertyCardProps {
  property: Property;
  isActive?: boolean;
  onHover?: (id: string | null) => void;
}

export default function PropertyCard({ property, isActive, onHover }: PropertyCardProps) {
  const [liked, setLiked] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollTo = (dir: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!carouselRef.current) return;
    const width = carouselRef.current.offsetWidth;
    carouselRef.current.scrollBy({ left: dir === 'right' ? width : -width, behavior: 'smooth' });
  };

  return (
    <Link
      href={`/properties/${property.id}`}
      className={`bg-white border hover:shadow-2xl transition-all group block ${
        isActive ? 'border-black shadow-lg' : 'border-black/5'
      }`}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image — swipeable carousel */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {property.images.map((img, i) => (
            <div key={i} className="relative flex-shrink-0 w-full h-full snap-start">
              <Image
                src={img}
                alt={`${property.title} ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Heart button */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
        >
          <span className={`text-sm ${liked ? 'text-black' : 'text-black/40'}`}>
            {liked ? '♥' : '♡'}
          </span>
        </button>

        {/* Listing type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest">
            {getListingTypeLabel(property.listing_type)}
          </span>
        </div>

        {/* Verified badge */}
        {property.is_verified && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase px-2 py-1 tracking-wider">
              ✓ Verified
            </span>
          </div>
        )}

        {/* Arrow navigation buttons — visible on hover */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={(e) => scrollTo('left', e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-black text-sm font-bold"
            >
              ‹
            </button>
            <button
              onClick={(e) => scrollTo('right', e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-black text-sm font-bold"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price + Type */}
        <div className="flex items-start justify-between mb-2">
          <span className="font-black text-xl">
            {formatPrice(property.price, property.listing_type)}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40 border border-black/10 px-2 py-0.5">
            {getPropertyTypeLabel(property.property_type)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-black text-sm uppercase tracking-tight mb-2 group-hover:text-black/70 transition-colors line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-black/40 uppercase tracking-widest mb-3">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 border-t border-black/5 pt-3">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
              <span className="text-xs font-bold uppercase">{property.bedrooms} Bed</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2.25"/></svg>
              <span className="text-xs font-bold uppercase">{property.bathrooms} Bath</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>
            <span className="text-xs font-bold uppercase">{property.area_sqft.toLocaleString('en-IN')} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
