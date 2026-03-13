export type PropertyType =
  | 'apartment'
  | 'house'
  | 'villa'
  | 'plot'
  | 'pg'
  | 'commercial'
  | 'office'
  | 'shop';

export type ListingType = 'sale' | 'rent' | 'lease' | 'pg';

export type PriceUnit = 'total' | 'per_sqft' | 'per_month';

export type Furnishing = 'furnished' | 'semi' | 'unfurnished';

export type UserRole = 'owner' | 'broker' | 'buyer' | 'tenant';

export type InquiryStatus = 'pending' | 'responded' | 'closed';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number;
  price_unit: PriceUnit;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  furnishing: Furnishing;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  owner_id: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  owner?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  property_id: string;
  sender_id: string;
  message: string;
  phone: string;
  status: InquiryStatus;
  created_at: string;
}

export interface SearchFilters {
  city?: string;
  property_type?: PropertyType;
  listing_type?: ListingType;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  furnishing?: Furnishing;
}
