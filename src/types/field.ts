// TypeScript interfaces for AgriEye

export type IndexType = 'NDVI' | 'EVI' | 'NDWI' | 'NDRE';
export type BasemapType = 'satellite' | 'streets' | 'terrain';
export type PaletteType = 'standard' | 'colorblind';
export type DrawTool = 'select' | 'polygon' | 'rectangle' | 'circle' | 'measure' | 'edit';
export type UserPlan = 'free' | 'pro' | 'business';
export type UserRole = 'user' | 'admin';

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [ [ [lng, lat], ... ] ]
}

export interface Field {
  id: string;
  user_id: string;
  name: string;
  geometry: GeoJSONPolygon;
  area_ha: number;
  crop_type: string;
  tags: string[];
  color?: string;
  created_at: string;
  latest_ndvi?: number;
  ndvi_trend?: 'up' | 'down' | 'stable';
  latest_image_date?: string;
}

export interface AnalysisStats {
  mean: number;
  min: number;
  max: number;
  std_dev: number;
  cloud_pct: number;
  index: IndexType;
  histogram?: { bin: string; count: number; pct: number }[];
}

export interface TimeseriesPoint {
  date: string;
  mean_ndvi: number;
  cloud_pct: number;
  status?: string;
}

export interface Alert {
  id: string;
  field_id: string;
  field_name?: string;
  threshold: number;
  condition: 'below' | 'drop_by';
  active: boolean;
  email_notify: boolean;
  last_triggered?: string;
  created_at: string;
}

export interface ReportItem {
  id: string;
  field_id: string;
  field_name: string;
  title: string;
  format: 'PDF' | 'GeoTIFF' | 'CSV' | 'PNG';
  storage_path: string;
  file_size_bytes: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  company?: string;
  plan: UserPlan;
  role: UserRole;
  created_at: string;
}

export interface PixelInspection {
  lng: number;
  lat: number;
  index: IndexType;
  value: number;
  classification: string;
  date: string;
  resolution_meters: number;
}
