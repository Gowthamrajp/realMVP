'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PROPERTY_TYPES, LISTING_TYPES, FURNISHING_OPTIONS, CITIES, AMENITIES } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function ListPropertyPage() {
  const [step, setStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = () => {
    toast.success('Property listing submitted! We will review and publish it shortly.');
    setStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7] text-black">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <Link href="/properties" className="inline-flex items-center gap-2 text-black/50 hover:text-black text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
          ← Back
        </Link>

        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
          List Your Property
        </h1>
        <p className="text-black/50 mb-8 text-sm uppercase tracking-wider">
          Reach thousands of buyers and tenants — completely free, no brokerage.
        </p>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 flex items-center justify-center text-xs font-black transition-all ${
                step >= s ? 'bg-black text-white' : 'border-2 border-black/20 text-black/40'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-black' : 'bg-black/10'}`} />}
            </div>
          ))}
        </div>

        {/* Success */}
        {step === 4 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 border-2 border-black flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Listing Submitted!</h2>
            <p className="text-black/50 mb-8 text-sm uppercase tracking-wider">Your property is being reviewed and will be published shortly.</p>
            <Link href="/properties" className="bg-black text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-black/80">Browse Properties</Link>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight">Basic Information</h2>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Property Title</label>
              <input type="text" placeholder="e.g., Spacious 3BHK in Bandra West" className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Listing Type</label>
                <select className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {LISTING_TYPES.map((lt) => (<option key={lt.value} value={lt.value}>{lt.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Property Type</label>
                <select className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {PROPERTY_TYPES.map((pt) => (<option key={pt.value} value={pt.value}>{pt.label}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Price (₹)</label>
                <input type="number" placeholder="3500000" className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Bedrooms</label>
                <select className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {[0,1,2,3,4,5].map((n) => (<option key={n} value={n}>{n === 0 ? 'N/A' : `${n} BHK`}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Bathrooms</label>
                <select className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {[0,1,2,3,4,5].map((n) => (<option key={n} value={n}>{n === 0 ? 'N/A' : n}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Area (sq.ft)</label>
                <input type="number" placeholder="1200" className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Furnishing</label>
                <select className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {FURNISHING_OPTIONS.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
                </select>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-black/80 transition-all">
              Next — Location & Details
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight">Location & Description</h2>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">City</label>
              <select className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                {CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Address</label>
              <input type="text" placeholder="Koramangala 4th Block, Near Forum Mall" className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">State</label>
                <input type="text" placeholder="Karnataka" className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Pincode</label>
                <input type="text" placeholder="560034" className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Description</label>
              <textarea rows={4} placeholder="Describe your property..." className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none resize-none" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-3">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((amenity) => (
                  <button key={amenity} onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                      selectedAmenities.includes(amenity)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black/60 border-black/10 hover:border-black/30'
                    }`}>{amenity}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border-2 border-black py-4 font-black uppercase tracking-widest text-sm hover:bg-black/5 transition-all">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-black text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-black/80 transition-all">Next — Photos</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight">Property Photos</h2>

            <div className="border-2 border-dashed border-black/20 p-12 text-center hover:border-black/40 transition-colors cursor-pointer">
              <span className="text-4xl block mb-3">📷</span>
              <p className="font-black text-sm uppercase tracking-widest mb-1">Upload property photos</p>
              <p className="text-xs text-black/40 uppercase tracking-wider">Drag & drop or click to browse. Max 10 photos.</p>
              <p className="text-[10px] text-black/30 mt-2 uppercase tracking-widest">JPG, PNG up to 5MB each</p>
            </div>

            <div className="bg-white border-2 border-black/5 p-4">
              <p className="font-black text-xs uppercase tracking-widest mb-2">📸 Photo Tips</p>
              <ul className="text-[10px] text-black/40 uppercase tracking-wider space-y-1 list-disc list-inside">
                <li>Use natural lighting</li>
                <li>Show all rooms including kitchen and bathrooms</li>
                <li>Include exterior shots and neighborhood views</li>
                <li>First photo becomes the cover image</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border-2 border-black py-4 font-black uppercase tracking-widest text-sm hover:bg-black/5 transition-all">Back</button>
              <button onClick={handleSubmit} className="flex-1 bg-black text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-black/80 transition-all">Submit Listing</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
