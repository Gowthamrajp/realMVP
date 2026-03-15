'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PROPERTY_TYPES, LISTING_TYPES, FURNISHING_OPTIONS, CITIES, AMENITIES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ListPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    listing_type: LISTING_TYPES[0].value,
    property_type: PROPERTY_TYPES[0].value,
    price: '',
    bedrooms: '0',
    bathrooms: '0',
    area_sqft: '',
    furnishing: FURNISHING_OPTIONS[0].value,
    city: CITIES[0],
    address: '',
    state: '',
    pincode: '',
    description: '',
  });

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addFiles = useCallback((files: FileList | File[]) => {
    const newPhotos = Array.from(files)
      .filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024)
      .slice(0, 10 - photos.length)
      .map(file => ({ file, preview: URL.createObjectURL(file) }));
    if (newPhotos.length === 0 && files.length > 0) {
      toast.error('Only JPG/PNG images under 5MB are allowed');
      return;
    }
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 10));
  }, [photos.length]);

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.city) {
      toast.error('Please fill in title, price, and city');
      return;
    }
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      // 1. Upload photos to storage
      const imageUrls: string[] = [];
      for (const photo of photos) {
        const ext = photo.file.name.split('.').pop() || 'jpg';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(path, photo.file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(path);
        imageUrls.push(urlData.publicUrl);
      }

      // 2. Insert property row
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: form.title,
          description: form.description || null,
          property_type: form.property_type,
          listing_type: form.listing_type,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          area_sqft: Number(form.area_sqft) || 0,
          furnishing: form.furnishing,
          address: form.address || null,
          city: form.city,
          state: form.state || null,
          pincode: form.pincode || null,
          images: imageUrls,
          amenities: selectedAmenities,
          is_active: true,
        })
        .select('id')
        .single();

      if (error) throw error;

      toast.success('Property published successfully!');
      router.push(`/properties/${data.id}`);
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to submit listing');
    } finally {
      setIsSubmitting(false);
    }
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
              <input type="text" placeholder="e.g., Spacious 3BHK in Bandra West" value={form.title} onChange={(e) => updateForm('title', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Listing Type</label>
                <select value={form.listing_type} onChange={(e) => updateForm('listing_type', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {LISTING_TYPES.map((lt) => (<option key={lt.value} value={lt.value}>{lt.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Property Type</label>
                <select value={form.property_type} onChange={(e) => updateForm('property_type', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {PROPERTY_TYPES.map((pt) => (<option key={pt.value} value={pt.value}>{pt.label}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Price (₹)</label>
                <input type="number" placeholder="3500000" value={form.price} onChange={(e) => updateForm('price', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Bedrooms</label>
                <select value={form.bedrooms} onChange={(e) => updateForm('bedrooms', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {[0,1,2,3,4,5].map((n) => (<option key={n} value={n}>{n === 0 ? 'N/A' : `${n} BHK`}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Bathrooms</label>
                <select value={form.bathrooms} onChange={(e) => updateForm('bathrooms', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                  {[0,1,2,3,4,5].map((n) => (<option key={n} value={n}>{n === 0 ? 'N/A' : n}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Area (sq.ft)</label>
                <input type="number" placeholder="1200" value={form.area_sqft} onChange={(e) => updateForm('area_sqft', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Furnishing</label>
                <select value={form.furnishing} onChange={(e) => updateForm('furnishing', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
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
              <select value={form.city} onChange={(e) => updateForm('city', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none">
                {CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Address</label>
              <input type="text" placeholder="Koramangala 4th Block, Near Forum Mall" value={form.address} onChange={(e) => updateForm('address', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">State</label>
                <input type="text" placeholder="Karnataka" value={form.state} onChange={(e) => updateForm('state', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Pincode</label>
                <input type="text" placeholder="560034" value={form.pincode} onChange={(e) => updateForm('pincode', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">Description</label>
              <textarea rows={4} placeholder="Describe your property..." value={form.description} onChange={(e) => updateForm('description', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-black/10 focus:border-black text-sm outline-none resize-none" />
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
            <h2 className="text-xl font-black uppercase tracking-tight">
              Property Photos
              {photos.length > 0 && <span className="text-black/40 ml-2">({photos.length}/10)</span>}
            </h2>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
            />

            {/* Drop zone */}
            <div
              className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                isDragOver ? 'border-black bg-black/5' : 'border-black/20 hover:border-black/40'
              } ${photos.length >= 10 ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
              }}
            >
              <svg className="w-10 h-10 mx-auto mb-3 text-black/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p className="font-black text-sm uppercase tracking-widest mb-1">
                {isDragOver ? 'Drop photos here' : 'Upload property photos'}
              </p>
              <p className="text-xs text-black/40 uppercase tracking-wider">
                {photos.length >= 10 ? 'Maximum 10 photos reached' : 'Drag & drop or click to browse. Max 10 photos.'}
              </p>
              <p className="text-[10px] text-black/30 mt-2 uppercase tracking-widest">JPG, PNG, WebP up to 5MB each</p>
            </div>

            {/* Image previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square bg-zinc-100 overflow-hidden border border-black/10 group">
                    <img src={photo.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-black text-white text-[8px] font-black uppercase px-1.5 py-0.5 tracking-widest">
                        Cover
                      </div>
                    )}
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <div className="absolute bottom-1 right-1 text-[8px] text-white/80 bg-black/50 px-1">
                      {(photo.file.size / 1024 / 1024).toFixed(1)}MB
                    </div>
                  </div>
                ))}
                {photos.length < 10 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-black/20 flex flex-col items-center justify-center hover:border-black/40 transition-colors"
                  >
                    <span className="text-2xl text-black/30">+</span>
                    <span className="text-[8px] text-black/30 uppercase tracking-widest mt-1">Add More</span>
                  </button>
                )}
              </div>
            )}

            <div className="bg-white border-2 border-black/5 p-4">
              <p className="font-black text-xs uppercase tracking-widest mb-2">Photo Tips</p>
              <ul className="text-[10px] text-black/40 uppercase tracking-wider space-y-1 list-disc list-inside">
                <li>Use natural lighting</li>
                <li>Show all rooms including kitchen and bathrooms</li>
                <li>Include exterior shots and neighborhood views</li>
                <li>First photo becomes the cover image</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border-2 border-black py-4 font-black uppercase tracking-widest text-sm hover:bg-black/5 transition-all">Back</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-black text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Publishing...' : `Submit Listing${photos.length > 0 ? ` (${photos.length} photos)` : ''}`}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
