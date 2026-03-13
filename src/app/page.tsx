'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Home, Building2, Warehouse, Users, ArrowRight, Star, Shield, IndianRupee } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/properties/PropertyCard';
import { mockProperties } from '@/data/mockProperties';
import { CITIES } from '@/lib/constants';

const categories = [
  { icon: Home, label: 'Buy', desc: 'Find your dream home', listing_type: 'sale', color: 'bg-emerald-500' },
  { icon: Building2, label: 'Rent', desc: 'Apartments & houses', listing_type: 'rent', color: 'bg-blue-500' },
  { icon: Users, label: 'PG', desc: 'Shared living spaces', listing_type: 'pg', color: 'bg-purple-500' },
  { icon: Warehouse, label: 'Commercial', desc: 'Office & retail', property_type: 'commercial', color: 'bg-amber-500' },
];

export default function HomePage() {
  const router = useRouter();
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('sale');

  const featuredProperties = mockProperties.slice(0, 6);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchType) params.set('listing_type', searchType);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Find Your Perfect
              <br />
              <span className="text-accent-400">Property</span> in India
            </h1>
            <p className="text-primary-200 text-lg md:text-xl max-w-2xl mx-auto">
              Explore thousands of apartments, houses, villas, and more across India.
              Free listings, no hidden charges.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-4">
              {/* Listing type tabs */}
              <div className="flex gap-1 mb-3 bg-slate-100 rounded-xl p-1">
                {['sale', 'rent', 'pg'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSearchType(type)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      searchType === type
                        ? 'bg-white text-primary-500 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {type === 'sale' ? 'Buy' : type === 'rent' ? 'Rent' : 'PG'}
                  </button>
                ))}
              </div>

              {/* Search inputs */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="input-field pl-10 appearance-none cursor-pointer"
                  >
                    <option value="">All Cities</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="btn-accent flex items-center justify-center gap-2 sm:px-8"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex justify-center gap-8 mt-8 text-white/80 text-sm">
              <div className="text-center">
                <div className="font-display font-bold text-2xl text-white">500+</div>
                <div>Properties</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-2xl text-white">15+</div>
                <div>Cities</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-2xl text-white">100%</div>
                <div>Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-primary-500 mb-3">
            What are you looking for?
          </h2>
          <p className="text-slate-500">Explore properties by category</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/properties?${cat.listing_type ? `listing_type=${cat.listing_type}` : `property_type=${cat.property_type}`}`}
              className="card group p-6 text-center hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-800 mb-1">{cat.label}</h3>
              <p className="text-sm text-slate-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore on Map CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <Link
          href="/properties"
          className="block bg-gradient-to-r from-primary-500 to-primary-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/400')] opacity-10 bg-cover bg-center" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                🗺️ Explore on Map
              </h2>
              <p className="text-primary-200 max-w-lg">
                Find properties near you with our interactive map. See prices, locations, and details at a glance — just like Airbnb.
              </p>
            </div>
            <div className="flex items-center gap-2 btn-accent whitespace-nowrap group-hover:scale-105 transition-transform">
              Open Map View
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-primary-500 mb-2">
              Featured Properties
            </h2>
            <p className="text-slate-500">Handpicked properties for you</p>
          </div>
          <Link
            href="/properties"
            className="hidden md:flex items-center gap-2 text-accent-500 font-medium hover:text-accent-600 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/properties" className="btn-outline inline-flex items-center gap-2">
            View All Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-primary-500 mb-3">
              Why Choose RealMVP?
            </h2>
            <p className="text-slate-500">We believe finding a home should be simple and free</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">100% Free</h3>
              <p className="text-slate-500 text-sm">No hidden charges, no premium plans needed. All features are free for everyone.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Verified Listings</h3>
              <p className="text-slate-500 text-sm">Every property is verified to ensure you get genuine listings and reliable information.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Direct Contact</h3>
              <p className="text-slate-500 text-sm">Connect directly with owners — no middlemen, no brokerage fees required.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
