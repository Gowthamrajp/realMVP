'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
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
    setStep(4); // Success step
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Back */}
        <Link href="/properties" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-500 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="font-display text-3xl font-bold text-primary-500 mb-2">
          List Your Property
        </h1>
        <p className="text-slate-500 mb-8">
          Reach thousands of buyers and tenants — completely free, no brokerage.
        </p>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= s ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Success state */}
        {step === 4 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary-500 mb-2">Listing Submitted!</h2>
            <p className="text-slate-500 mb-8">Your property is being reviewed and will be published shortly.</p>
            <Link href="/properties" className="btn-primary">Browse Properties</Link>
          </div>
        )}

        {/* Step 1 — Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Property Title</label>
              <input type="text" placeholder="e.g., Spacious 3BHK in Bandra West" className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Listing Type</label>
                <select className="input-field">
                  {LISTING_TYPES.map((lt) => (
                    <option key={lt.value} value={lt.value}>{lt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                <select className="input-field">
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>{pt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                <input type="number" placeholder="e.g., 3500000" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                <select className="input-field">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n === 0 ? 'N/A' : `${n} BHK`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                <select className="input-field">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n === 0 ? 'N/A' : n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Area (sq.ft)</label>
                <input type="number" placeholder="e.g., 1200" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Furnishing</label>
                <select className="input-field">
                  {FURNISHING_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary w-full">
              Next — Location & Details
            </button>
          </div>
        )}

        {/* Step 2 — Location & Description */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold">Location & Description</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <select className="input-field">
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input type="text" placeholder="e.g., Koramangala 4th Block, Near Forum Mall" className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input type="text" placeholder="e.g., Karnataka" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                <input type="text" placeholder="e.g., 560034" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea rows={4} placeholder="Describe your property — size, features, nearby landmarks..." className="input-field resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      selectedAmenities.includes(amenity)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">Next — Photos</button>
            </div>
          </div>
        )}

        {/* Step 3 — Photos */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold">Property Photos</h2>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-primary-300 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-1">Upload property photos</p>
              <p className="text-sm text-slate-400">Drag & drop or click to browse. Max 10 photos.</p>
              <p className="text-xs text-slate-400 mt-2">JPG, PNG up to 5MB each</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
              <p className="font-medium mb-1">📸 Photo tips for better listings:</p>
              <ul className="list-disc list-inside text-blue-600 space-y-1">
                <li>Use natural lighting</li>
                <li>Show all rooms including kitchen and bathrooms</li>
                <li>Include exterior shots and neighborhood views</li>
                <li>First photo becomes the cover image</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
              <button onClick={handleSubmit} className="btn-accent flex-1">Submit Listing</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
