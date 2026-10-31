import { createClient } from '@supabase/supabase-js';
import { Field, UserProfile, Alert, ReportItem, TimeseriesPoint } from '../types/field';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// Demo / Mock Data Store for Instant Local Interactive Use
// ==============================================================================

const DEMO_USER_ID = 'demo-user-1234';

export const INITIAL_DEMO_PROFILE: UserProfile = {
  id: DEMO_USER_ID,
  email: 'agronomist@agrieye.io',
  full_name: 'Dr. Sarah Jenkins',
  company: 'Midwest Agronomic Services',
  plan: 'pro',
  role: 'user',
  created_at: new Date().toISOString(),
};

export const INITIAL_DEMO_FIELDS: Field[] = [
  {
    id: 'field-1',
    user_id: DEMO_USER_ID,
    name: 'Prairie View Plot #4',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-93.5824, 42.0315],
          [-93.5732, 42.0315],
          [-93.5732, 42.0258],
          [-93.5824, 42.0258],
          [-93.5824, 42.0315]
        ]
      ]
    },
    area_ha: 38.42,
    crop_type: 'Corn (Dent)',
    tags: ['Demo Field', 'Corn Belt', 'Pivot Irrigated'],
    color: '#16a34a',
    latest_ndvi: 0.84,
    ndvi_trend: 'up',
    latest_image_date: '2026-07-28',
    created_at: '2026-05-01T08:00:00Z',
  },
  {
    id: 'field-2',
    user_id: DEMO_USER_ID,
    name: 'San Joaquin Orchard Block B',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-120.4520, 36.7820],
          [-120.4440, 36.7820],
          [-120.4440, 36.7760],
          [-120.4520, 36.7760],
          [-120.4520, 36.7820]
        ]
      ]
    },
    area_ha: 24.60,
    crop_type: 'Almonds',
    tags: ['West Coast', 'Drip Irrigated', 'High Value'],
    color: '#84cc16',
    latest_ndvi: 0.69,
    ndvi_trend: 'stable',
    latest_image_date: '2026-07-25',
    created_at: '2026-05-15T10:30:00Z',
  },
  {
    id: 'field-3',
    user_id: DEMO_USER_ID,
    name: 'Champagne Vineyard Parcel 12',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [4.0210, 49.0410],
          [4.0280, 49.0410],
          [4.0280, 49.0360],
          [4.0210, 49.0360],
          [4.0210, 49.0410]
        ]
      ]
    },
    area_ha: 15.20,
    crop_type: 'Wine Grapes (Pinot Noir)',
    tags: ['Europe', 'Organic Certified', 'Hillside'],
    color: '#0284c7',
    latest_ndvi: 0.74,
    ndvi_trend: 'down',
    latest_image_date: '2026-07-20',
    created_at: '2026-06-01T14:15:00Z',
  }
];

export const INITIAL_DEMO_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    field_id: 'field-1',
    field_name: 'Prairie View Plot #4',
    threshold: 0.45,
    condition: 'below',
    active: true,
    email_notify: true,
    last_triggered: '2026-05-12T09:00:00Z',
    created_at: '2026-05-02T11:00:00Z',
  },
  {
    id: 'alert-2',
    field_id: 'field-2',
    field_name: 'San Joaquin Orchard Block B',
    threshold: 0.50,
    condition: 'below',
    active: true,
    email_notify: false,
    created_at: '2026-05-20T16:30:00Z',
  }
];

export const INITIAL_DEMO_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    field_id: 'field-1',
    field_name: 'Prairie View Plot #4',
    title: 'Mid-Season Vigor & Anomaly Summary',
    format: 'PDF',
    storage_path: 'reports/prairie-view-jul2026.pdf',
    file_size_bytes: 1420580,
    created_at: '2026-07-28T14:30:00Z',
  },
  {
    id: 'rep-2',
    field_id: 'field-1',
    field_name: 'Prairie View Plot #4',
    title: 'High-Resolution 10m GeoTIFF Export',
    format: 'GeoTIFF',
    storage_path: 'exports/field1-geotiff.tif',
    file_size_bytes: 8493020,
    created_at: '2026-07-28T14:32:00Z',
  },
  {
    id: 'rep-3',
    field_id: 'field-2',
    field_name: 'San Joaquin Orchard Block B',
    title: 'Seasonal NDVI Time-Series (CSV)',
    format: 'CSV',
    storage_path: 'exports/orchard_b_timeseries.csv',
    file_size_bytes: 24500,
    created_at: '2026-07-25T11:20:00Z',
  }
];

// Helper to get or set local demo storage
export function getLocalStoredFields(): Field[] {
  try {
    const raw = localStorage.getItem('agrieye_demo_fields');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse fields from localStorage', e);
  }
  localStorage.setItem('agrieye_demo_fields', JSON.stringify(INITIAL_DEMO_FIELDS));
  return INITIAL_DEMO_FIELDS;
}

export function saveLocalStoredFields(fields: Field[]) {
  localStorage.setItem('agrieye_demo_fields', JSON.stringify(fields));
}
