export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'RealMVP';

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot' },
  { value: 'pg', label: 'PG / Co-living' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office Space' },
  { value: 'shop', label: 'Shop' },
] as const;

export const LISTING_TYPES = [
  { value: 'sale', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'lease', label: 'Lease' },
  { value: 'pg', label: 'PG' },
] as const;

export const FURNISHING_OPTIONS = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
] as const;

export const BEDROOM_OPTIONS = [
  { value: 1, label: '1 BHK' },
  { value: 2, label: '2 BHK' },
  { value: 3, label: '3 BHK' },
  { value: 4, label: '4 BHK' },
  { value: 5, label: '5+ BHK' },
] as const;

export const CITIES = [
  'Mumbai',
  'Bangalore',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Gurgaon',
  'Noida',
  'Goa',
  'Chandigarh',
  'Kochi',
] as const;

export const AMENITIES = [
  'Parking',
  'Swimming Pool',
  'Gym',
  'Garden',
  'Lift',
  'Security',
  'Power Backup',
  'Water Supply',
  'Club House',
  'Children Play Area',
  'Gas Pipeline',
  'WiFi',
  'AC',
  'Laundry',
  'CCTV',
  'Fire Safety',
  'Intercom',
  'Visitor Parking',
  'Rainwater Harvesting',
  'Vastu Compliant',
] as const;

export const PRICE_RANGES_SALE = [
  { min: 0, max: 2500000, label: 'Under ₹25L' },
  { min: 2500000, max: 5000000, label: '₹25L – ₹50L' },
  { min: 5000000, max: 10000000, label: '₹50L – ₹1Cr' },
  { min: 10000000, max: 20000000, label: '₹1Cr – ₹2Cr' },
  { min: 20000000, max: 50000000, label: '₹2Cr – ₹5Cr' },
  { min: 50000000, max: Infinity, label: 'Above ₹5Cr' },
] as const;

export const PRICE_RANGES_RENT = [
  { min: 0, max: 10000, label: 'Under ₹10K' },
  { min: 10000, max: 20000, label: '₹10K – ₹20K' },
  { min: 20000, max: 50000, label: '₹20K – ₹50K' },
  { min: 50000, max: 100000, label: '₹50K – ₹1L' },
  { min: 100000, max: Infinity, label: 'Above ₹1L' },
] as const;

// Map default center (India)
export const MAP_DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
export const MAP_DEFAULT_ZOOM = 5;

// City coordinates for map
export const CITY_COORDINATES: Record<string, [number, number]> = {
  Mumbai: [19.076, 72.8777],
  Bangalore: [12.9716, 77.5946],
  Delhi: [28.6139, 77.209],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Pune: [18.5204, 73.8567],
  Kolkata: [22.5726, 88.3639],
  Ahmedabad: [23.0225, 72.5714],
  Jaipur: [26.9124, 75.7873],
  Lucknow: [26.8467, 80.9462],
  Gurgaon: [28.4595, 77.0266],
  Noida: [28.5355, 77.391],
  Goa: [15.2993, 74.124],
  Chandigarh: [30.7333, 76.7794],
  Kochi: [9.9312, 76.2673],
};
