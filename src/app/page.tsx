'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockProperties } from '@/data/mockProperties';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [searchCity] = useState('');
  const [searchType, setSearchType] = useState('sale');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProperties = mockProperties.slice(0, 3);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchType) params.set('listing_type', searchType);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-white overflow-hidden border-b border-black/5">
        {/* Dot pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />

        <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tighter text-black mb-8 uppercase">
            Find Your Perfect<br />Property in India
          </h1>

          {/* Search Box */}
          <div className="w-full max-w-3xl bg-white border-2 border-black p-2">
            {/* Tabs */}
            <div className="flex border-b border-black/10 mb-2">
              {['sale', 'rent', 'pg', 'commercial'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                    searchType === type
                      ? 'border-black text-black'
                      : 'border-transparent text-black/40 hover:text-black/60'
                  }`}
                >
                  {type === 'sale' ? 'Buy' : type === 'rent' ? 'Rent' : type === 'pg' ? 'PG' : 'Commercial'}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#f7f7f7] border-none focus:ring-1 focus:ring-black text-sm uppercase tracking-tight placeholder:text-black/30 outline-none"
                  placeholder="Search by city, locality, or project"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-black text-white px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-black/80 transition-all"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-6 md:px-20 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-2">Curated selection</p>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Featured Properties</h2>
            </div>
            <Link href="/properties" className="text-sm font-bold border-b-2 border-black pb-1 hover:text-black/70 transition-colors">
              View All Properties
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="bg-white border border-black/5 hover:shadow-2xl transition-all group block"
              >
                <div className="aspect-[4/3] bg-zinc-200 relative overflow-hidden">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest">
                    {property.listing_type === 'sale' ? 'For Sale' :
                     property.listing_type === 'rent' ? 'For Rent' :
                     property.listing_type === 'pg' ? 'PG' : 'For Lease'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-xl uppercase tracking-tight">{property.title}</h3>
                      <p className="text-xs text-black/40 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <p className="font-black text-xl">{formatPrice(property.price, property.listing_type)}</p>
                  </div>
                  <div className="flex border-t border-black/5 pt-4 gap-6">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
                        <span className="text-xs font-bold uppercase">{property.bedrooms} Bed</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2.25"/></svg>
                        <span className="text-xs font-bold uppercase">{property.bathrooms} Bath</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>
                      <span className="text-xs font-bold uppercase">{property.area_sqft.toLocaleString('en-IN')} sqft</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-white px-6 md:px-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-4">Our Commitment</p>
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
              We Redefine The<br />Property Search<br />Experience
            </h2>
            <p className="text-black/60 mb-10 max-w-md">
              No clutter, no noise. Just the best properties in India presented with absolute clarity and precision.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm mb-1">Verified Only</h4>
                  <p className="text-xs text-black/40 uppercase tracking-wider">Every listing goes through a rigorous quality check.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm mb-1">Zero Brokerage</h4>
                  <p className="text-xs text-black/40 uppercase tracking-wider">Direct deals with owners on selected premium projects.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm mb-1">Instant Tours</h4>
                  <p className="text-xs text-black/40 uppercase tracking-wider">Book physical or virtual tours in under 60 seconds.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-black aspect-square w-full absolute -top-10 -right-10 opacity-5" />
            <Image
              src="https://picsum.photos/seed/arch/800/800"
              alt="Modern Architecture"
              width={800}
              height={800}
              className="relative z-10 w-full h-full object-cover border border-black grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
