'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, BedDouble, Bath, Maximize, CheckCircle } from 'lucide-react';
import { Property } from '@/types';
import { formatPrice, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  isActive?: boolean;
  onHover?: (id: string | null) => void;
}

export default function PropertyCard({ property, isActive, onHover }: PropertyCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <Link
      href={`/properties/${property.id}`}
      className={`card group block ${isActive ? 'ring-2 ring-accent-500 shadow-lg' : ''}`}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={property.images[imgIndex] || property.images[0]}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Image dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === imgIndex ? 'bg-white w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Heart button */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
        >
          <Heart
            className={`w-4 h-4 ${liked ? 'fill-accent-500 text-accent-500' : 'text-slate-600'}`}
          />
        </button>

        {/* Listing type badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge text-white ${
            property.listing_type === 'sale' ? 'bg-emerald-500' :
            property.listing_type === 'rent' ? 'bg-blue-500' :
            property.listing_type === 'pg' ? 'bg-purple-500' :
            'bg-amber-500'
          }`}>
            {getListingTypeLabel(property.listing_type)}
          </span>
        </div>

        {/* Verified badge */}
        {property.is_verified && (
          <div className="absolute bottom-3 left-3">
            <span className="badge bg-white/90 backdrop-blur-sm text-emerald-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-start justify-between mb-1">
          <span className="font-display font-bold text-lg text-primary-500">
            {formatPrice(property.price, property.listing_type)}
          </span>
          <span className="badge bg-slate-100 text-slate-600 text-[10px]">
            {getPropertyTypeLabel(property.property_type)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-medium text-slate-800 mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-slate-500">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" />
              <span>{property.bedrooms} Bed</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              <span>{property.bathrooms} Bath</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5" />
            <span>{property.area_sqft.toLocaleString('en-IN')} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
