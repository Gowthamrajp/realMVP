'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockProperties } from '@/data/mockProperties';
import { formatPriceDetailed, getListingTypeLabel, getPropertyTypeLabel, formatArea, timeAgo } from '@/lib/utils';

const PropertyMap = dynamic(() => import('@/components/properties/PropertyMap'), { ssr: false });

export default function PropertyDetailPage() {
  const params = useParams();
  const property = mockProperties.find((p) => p.id === params.id);

  const [currentImg, setCurrentImg] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [liked, setLiked] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');

  const similarProperties = useMemo(() => {
    if (!property) return [];
    return mockProperties
      .filter((p) => p.id !== property.id && (p.city === property.city || p.listing_type === property.listing_type))
      .slice(0, 3);
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] text-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <span className="text-6xl mb-4">🏠</span>
          <p className="text-xl font-black uppercase tracking-tighter">Property not found</p>
          <Link href="/properties" className="mt-4 bg-black text-white px-6 py-3 text-sm font-black uppercase tracking-widest">Browse Properties</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black">
      <Navbar />

      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 md:px-20 py-3">
        <Link href="/properties" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors">
          ← Back to listings
        </Link>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 md:px-20 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 overflow-hidden">
          <div className="relative aspect-[4/3] md:aspect-auto md:row-span-2 cursor-pointer group bg-zinc-200"
            onClick={() => setShowGallery(true)}>
            <Image src={property.images[0]} alt={property.title} fill
              className="object-cover group-hover:scale-105 transition-transform duration-500" priority />
          </div>
          {property.images.slice(1, 3).map((img, i) => (
            <div key={i} className="relative aspect-[4/3] hidden md:block cursor-pointer group bg-zinc-200"
              onClick={() => { setCurrentImg(i + 1); setShowGallery(true); }}>
              <Image src={img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              {i === 1 && property.images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-black text-lg uppercase tracking-widest">+{property.images.length - 3} photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Gallery */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          <button onClick={() => setShowGallery(false)} className="absolute top-4 right-4 text-white text-2xl font-black">✕</button>
          <button onClick={() => setCurrentImg((currentImg - 1 + property.images.length) % property.images.length)}
            className="absolute left-4 text-white text-3xl">‹</button>
          <button onClick={() => setCurrentImg((currentImg + 1) % property.images.length)}
            className="absolute right-4 text-white text-3xl">›</button>
          <Image src={property.images[currentImg]} alt="" fill className="object-contain p-8" />
          <div className="absolute bottom-4 text-white text-xs font-black uppercase tracking-widest">
            {currentImg + 1} / {property.images.length}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest">
                  {getListingTypeLabel(property.listing_type)}
                </span>
                <span className="border-2 border-black/10 text-[10px] font-black uppercase px-3 py-1 tracking-widest">
                  {getPropertyTypeLabel(property.property_type)}
                </span>
                {property.is_verified && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">✓ Verified</span>
                )}
              </div>
              <div className="flex items-start justify-between">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{property.title}</h1>
                <div className="flex gap-2">
                  <button onClick={() => setLiked(!liked)}
                    className="w-10 h-10 border-2 border-black/10 flex items-center justify-center hover:border-black transition-all">
                    {liked ? '♥' : '♡'}
                  </button>
                  <button className="w-10 h-10 border-2 border-black/10 flex items-center justify-center hover:border-black transition-all">
                    ↗
                  </button>
                </div>
              </div>
              <p className="text-xs text-black/40 uppercase tracking-widest mt-2">
                📍 {property.address}, {property.city}, {property.state} — {property.pincode}
              </p>
              <p className="text-3xl font-black mt-4">
                {formatPriceDetailed(property.price, property.listing_type)}
              </p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.bedrooms > 0 && (
                <div className="bg-white border border-black/5 p-4 text-center">
                  <svg className="w-6 h-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
                  <div className="font-black text-lg">{property.bedrooms}</div>
                  <div className="text-[10px] text-black/40 uppercase tracking-widest">Bedrooms</div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="bg-white border border-black/5 p-4 text-center">
                  <svg className="w-6 h-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2.25"/></svg>
                  <div className="font-black text-lg">{property.bathrooms}</div>
                  <div className="text-[10px] text-black/40 uppercase tracking-widest">Bathrooms</div>
                </div>
              )}
              <div className="bg-white border border-black/5 p-4 text-center">
                <svg className="w-6 h-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>
                <div className="font-black text-lg">{formatArea(property.area_sqft)}</div>
                <div className="text-[10px] text-black/40 uppercase tracking-widest">Area</div>
              </div>
              <div className="bg-white border border-black/5 p-4 text-center">
                <svg className="w-6 h-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3M4 12h16"/></svg>
                <div className="font-black text-lg capitalize">{property.furnishing}</div>
                <div className="text-[10px] text-black/40 uppercase tracking-widest">Furnishing</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-3">About this property</h2>
              <p className="text-black/60 leading-relaxed">{property.description}</p>
              <p className="text-[10px] text-black/30 mt-3 uppercase tracking-widest">Listed {timeAgo(property.created_at)}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 p-3 bg-white border border-black/5">
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-xs font-bold uppercase tracking-wider">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4">Location</h2>
              <div className="h-[300px] overflow-hidden">
                <PropertyMap properties={[property]} activeId={property.id}
                  center={[property.latitude, property.longitude]} zoom={14} />
              </div>
            </div>
          </div>

          {/* Right — Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/5 p-6 sticky top-24 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-lg">
                  {property.owner_id.charAt(property.owner_id.length - 1).toUpperCase()}
                </div>
                <div>
                  <div className="font-black uppercase tracking-tight">Property Owner</div>
                  <div className="text-[10px] text-black/40 uppercase tracking-widest">✓ Verified Owner</div>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  placeholder={`Hi, I'm interested in your ${getPropertyTypeLabel(property.property_type).toLowerCase()} in ${property.city}.`}
                  value={inquiryMsg} onChange={(e) => setInquiryMsg(e.target.value)} rows={4}
                  className="w-full px-4 py-3 bg-[#f7f7f7] border-2 border-black/10 focus:border-black text-sm outline-none resize-none" />
                <input type="tel" placeholder="Your phone number"
                  value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f7f7f7] border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>

              <button className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-black/80 transition-all">
                Send Inquiry
              </button>
              <button className="w-full border-2 border-black py-4 font-black uppercase tracking-widest text-sm hover:bg-black/5 transition-all">
                Call Owner
              </button>
              <p className="text-[10px] text-black/30 text-center uppercase tracking-widest">
                Free and no brokerage — contact owner directly
              </p>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((p) => (
                <Link key={p.id} href={`/properties/${p.id}`}
                  className="bg-white border border-black/5 hover:shadow-2xl transition-all group block">
                  <div className="aspect-[4/3] bg-zinc-200 relative overflow-hidden">
                    <Image src={p.images[0]} alt={p.title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest">
                      {getListingTypeLabel(p.listing_type)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-xl uppercase tracking-tight">{p.title}</h3>
                    <p className="text-xs text-black/40 uppercase tracking-widest mt-1">📍 {p.city}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
