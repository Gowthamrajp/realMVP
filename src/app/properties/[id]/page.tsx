'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, Heart, Share2, MapPin, BedDouble, Bath, Maximize,
  Armchair, CheckCircle, Phone, MessageCircle, ChevronLeft, ChevronRight,
  X, Building2, Calendar, Shield
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/properties/PropertyCard';
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
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
          <Building2 className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">Property not found</p>
          <Link href="/properties" className="mt-4 btn-primary text-sm">Browse Properties</Link>
        </div>
      </div>
    );
  }

  const amenityIcons: Record<string, string> = {
    Parking: '🅿️', 'Swimming Pool': '🏊', Gym: '💪', Garden: '🌳',
    Lift: '🛗', Security: '🔒', 'Power Backup': '⚡', 'Water Supply': '💧',
    'Club House': '🏛️', 'Children Play Area': '🎮', 'Gas Pipeline': '🔥',
    WiFi: '📶', AC: '❄️', Laundry: '👔', CCTV: '📹', 'Fire Safety': '🧯',
    Intercom: '📞', 'Visitor Parking': '🚗', 'Rainwater Harvesting': '🌧️',
    'Vastu Compliant': '🕉️',
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <Link href="/properties" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-500 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden">
          {/* Main Image */}
          <div
            className="relative aspect-[4/3] md:aspect-auto md:row-span-2 cursor-pointer group"
            onClick={() => setShowGallery(true)}
          >
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* Side Images */}
          {property.images.slice(1, 3).map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] hidden md:block cursor-pointer group"
              onClick={() => { setCurrentImg(i + 1); setShowGallery(true); }}
            >
              <Image src={img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              {i === 1 && property.images.length > 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">+{property.images.length - 3} photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          <button onClick={() => setShowGallery(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-10">
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentImg((currentImg - 1 + property.images.length) % property.images.length)}
            className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentImg((currentImg + 1) % property.images.length)}
            className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <Image
            src={property.images[currentImg]}
            alt=""
            fill
            className="object-contain p-8"
          />
          <div className="absolute bottom-4 text-white text-sm">
            {currentImg + 1} / {property.images.length}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge text-white ${
                      property.listing_type === 'sale' ? 'bg-emerald-500' :
                      property.listing_type === 'rent' ? 'bg-blue-500' :
                      property.listing_type === 'pg' ? 'bg-purple-500' : 'bg-amber-500'
                    }`}>
                      {getListingTypeLabel(property.listing_type)}
                    </span>
                    <span className="badge bg-slate-100 text-slate-600">
                      {getPropertyTypeLabel(property.property_type)}
                    </span>
                    {property.is_verified && (
                      <span className="badge bg-emerald-50 text-emerald-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-primary-500">
                    {property.title}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-accent-500 text-accent-500' : 'text-slate-400'}`} />
                  </button>
                  <button className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all">
                    <Share2 className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.city}, {property.state} — {property.pincode}</span>
              </div>

              <div className="font-display text-3xl font-bold text-accent-500">
                {formatPriceDetailed(property.price, property.listing_type)}
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.bedrooms > 0 && (
                <div className="card p-4 text-center">
                  <BedDouble className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <div className="font-semibold text-slate-800">{property.bedrooms}</div>
                  <div className="text-xs text-slate-500">Bedrooms</div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="card p-4 text-center">
                  <Bath className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <div className="font-semibold text-slate-800">{property.bathrooms}</div>
                  <div className="text-xs text-slate-500">Bathrooms</div>
                </div>
              )}
              <div className="card p-4 text-center">
                <Maximize className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                <div className="font-semibold text-slate-800">{formatArea(property.area_sqft)}</div>
                <div className="text-xs text-slate-500">Area</div>
              </div>
              <div className="card p-4 text-center">
                <Armchair className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                <div className="font-semibold text-slate-800 capitalize">{property.furnishing}</div>
                <div className="text-xs text-slate-500">Furnishing</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-3">About this property</h2>
              <p className="text-slate-600 leading-relaxed">{property.description}</p>
              <div className="mt-3 flex items-center gap-1 text-sm text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                Listed {timeAgo(property.created_at)}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <span className="text-lg">{amenityIcons[amenity] || '✓'}</span>
                      <span className="text-sm text-slate-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">Location</h2>
              <div className="h-[300px] rounded-2xl overflow-hidden">
                <PropertyMap
                  properties={[property]}
                  activeId={property.id}
                  center={[property.latitude, property.longitude]}
                  zoom={14}
                />
              </div>
            </div>
          </div>

          {/* Right — Contact / Inquiry */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {property.owner_id.charAt(property.owner_id.length - 1).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-slate-800">Property Owner</div>
                  <div className="flex items-center gap-1 text-sm text-emerald-500">
                    <Shield className="w-3 h-3" />
                    Verified Owner
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  placeholder={`Hi, I'm interested in your ${getPropertyTypeLabel(property.property_type).toLowerCase()} in ${property.city}. Please share more details.`}
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  rows={4}
                  className="input-field text-sm resize-none"
                />
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              <button className="w-full btn-accent flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Send Inquiry
              </button>

              <button className="w-full btn-outline flex items-center justify-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                Call Owner
              </button>

              <p className="text-xs text-slate-400 text-center">
                Free and no brokerage — contact owner directly
              </p>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-primary-500 mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
