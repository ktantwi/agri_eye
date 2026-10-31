# AgriEye — Satellite Crop & Vegetation Monitoring Platform

> **"See your fields from space."**  
> An interactive, map-first geospatial web application for precision agriculture, crop health tracking, and multi-spectral satellite intelligence.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-4.7-brightgreen)](https://maplibre.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.11-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Earth Engine](https://img.shields.io/badge/Google_Earth_Engine-Sentinel--2-4285F4?logo=google)](https://earthengine.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostGIS_%2B_RLS-3ECF8E?logo=supabase)](https://supabase.com/)

---

## 🌾 Overview & Vision

**AgriEye** is built map-first. Upon logging in, the full-screen satellite viewport **IS** the application — no traditional dashboard gutters or excessive chrome. Floating glass-morphism panels host field catalogs, drawing toolbars, multi-spectral index switchers, seasonal phenology curves, and export generators.

### Key Capabilities
- **10-Meter Sentinel-2 Multi-Spectral Imagery**: European Space Agency (ESA) Level-2A Bottom-Of-Atmosphere (BOA) Surface Reflectance.
- **5-Day Global Revisit Cycle**: Automatic cloud masking via Scene Classification Layer (SCL) and Cloud Score+.
- **Multi-Index Engine**: Instant toggle between **NDVI** (chlorophyll vigor), **EVI** (dense canopy saturation resistance), **NDWI** (plant water stress), and **NDRE** (red-edge nitrogen chlorophyll).
- **Interactive Phenology Scrubber & Compare Curtain**: Drag the bottom timeline slider across seasonal passes, or split the map with an interactive swipe slider between two dates.
- **Pixel-Level Probe**: Click anywhere inside a field boundary to query exact 10m pixel values, vigor classification, and timestamp.
- **Field Boundary Ingestion**: Draw polygons, rectangles, or center-pivot circles with live hectare area readouts, or upload GeoJSON, KML, and zipped Shapefiles.
- **Agronomic Exports**: Download 32-bit floating point GeoTIFF grids (compatible with John Deere Operations Center and Climate FieldView), high-res PNG snapshots, time-series CSVs, and branded PDF agronomist reports.

---

## 🛠️ Tech Stack

| Tier | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, TanStack Query, Zustand, Canvas Confetti |
| **Mapping Engine** | MapLibre GL JS, Mapbox GL Draw, `@turf/turf` (geospatial math & area in hectares), Esri World Imagery & OpenStreetMap |
| **Backend API** | FastAPI (Python 3.11), `earthengine-api`, `uvicorn`, `pydantic`, `python-jose`, NumPy, Pillow |
| **Database & Auth** | Supabase (PostgreSQL 15 + PostGIS extension), Row Level Security (RLS) on all 8 tables, Auth triggers |
| **Hosting** | Vercel / Netlify (Frontend SPA), Google Cloud Run (GEE FastAPI Container) |

---

## 📂 Project Structure

```
ndvi-project/
├── index.html                   # SEO tags, JSON-LD schemas, Google Fonts (Fraunces & Inter)
├── vite.config.ts               # Vite build config with manual vendor chunk splitting
├── tailwind.config.js           # AgriEye brand tokens (forest #14532d, lime #84cc16, sand #fafaf5)
├── package.json
│
├── src/
│   ├── main.tsx                 # App mount & React Query provider
│   ├── App.tsx                  # Public, Auth, App, and Admin route trees
│   ├── types/field.ts           # Core domain models (Field, AnalysisStats, Timeseries, Alert)
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client + offline demo data store
│   │   ├── geeApi.ts            # Satellite processing API client & simulation engine
│   │   ├── geoUtils.ts          # Turf calculations (ha, bbox) & KML/Shapefile parser
│   │   ├── pdfExport.ts         # High-resolution PDF agronomist report generator
│   │   └── csvExport.ts         # CSV zonal statistics & timeseries exporter
│   ├── store/
│   │   ├── mapStore.ts          # Zustand store for map, active index, drawing, timeline
│   │   └── authStore.ts         # Zustand store for auth session & user plan
│   ├── components/
│   │   ├── common/              # Logo (iris leaf-satellite eye), Navbar, Footer
│   │   └── map/                 # MapContainer, FloatingTopBar, DrawToolbar,
│   │                            # LeftFieldsPanel, RightAnalysisPanel, TimelineSlider,
│   │                            # CompareCurtain, Legend, PixelInspectionPopup,
│   │                            # UploadModal, OnboardingTour
│   └── pages/
│       ├── public/              # LandingPage (live demo), Features, Pricing, WhatIsNdvi, Faq, Blog, Contact
│       ├── auth/                # LoginPage, SignupPage, ForgotPasswordPage
│       ├── app/                 # AppMapPage (/app), ReportsPage, AlertsPage, SettingsPage
│       └── admin/               # AdminDashboardPage (quota, users, latency, messages)
│
├── gee-backend/                 # Google Earth Engine FastAPI microservice
│   ├── main.py                  # Endpoints: /ndvi/tiles, /ndvi/dates, /ndvi/stats, /ndvi/pixel, /ndvi/export
│   ├── Dockerfile               # Google Cloud Run production deployment container
│   ├── requirements.txt         # FastAPI, earthengine-api, google-auth, pydantic, numpy
│   └── .env.example
│
└── supabase/
    ├── schema.sql               # PostGIS schema, GIST indexes, RLS policies, trigger auto-seeder
    └── seed.sql                 # Demo fields (Iowa Corn Belt, San Joaquin Orchard, Champagne Vineyard)
```

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.9+ (for GEE backend)

### 2. Frontend Setup
```bash
# Clone the repository and install dependencies
cd ndvi-project
npm install

# Copy environment variables
cp .env.example .env

# Run local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
- Click **"Instant Demo Access"** on the login page to immediately test the platform with seeded demo fields (Prairie View Plot #4 in the Iowa Corn Belt).

### 3. GEE Backend Setup (Optional for Development)
*Note: AgriEye includes an internal fallback simulation engine. If GEE credentials are not provided, the backend and frontend automatically generate realistic synthetic Sentinel-2 raster tiles and statistics.*

```bash
cd gee-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start the FastAPI service on port 8080
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

---

## 🗄️ Supabase Setup (PostgreSQL + PostGIS + RLS)

1. Create a new project at [database.new](https://database.new).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase/schema.sql` and run it. This:
   - Enables `postgis` and `uuid-ossp` extensions.
   - Creates `profiles`, `fields`, `analyses`, `ndvi_timeseries`, `alerts`, `reports`, `contact_messages`, and `usage_logs`.
   - Creates a spatial index: `CREATE INDEX idx_fields_geometry ON fields USING GIST (geometry);`.
   - Enables **Row Level Security (RLS)** on all tables so users can only access their own farm data.
   - Sets up the `handle_new_user()` trigger to automatically create a profile and seed a demo field upon signup.
4. (Optional) Run `supabase/seed.sql` to populate sample accounts.
5. In **Storage**, create two buckets: `reports` and `field-uploads`.
6. Copy your **Project URL** and **Anon Key** into your root `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

---

## 🛰️ Google Earth Engine (GEE) Production Setup

To connect live European Space Agency satellite data:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a GCP Project.
2. Enable the **Earth Engine API** in the API Library.
3. Register your project for Earth Engine access at [signup.earthengine.google.com](https://signup.earthengine.google.com).
4. Create a Service Account (e.g., `agrieye-gee-sa@your-project.iam.gserviceaccount.com`).
5. Grant it the role **Earth Engine Resource Viewer** or **Earth Engine User**.
6. Generate and download a JSON Private Key.
7. Set the environment variables in `gee-backend/.env`:
   ```env
   EE_SERVICE_ACCOUNT=agrieye-gee-sa@your-project.iam.gserviceaccount.com
   EE_KEY_FILE=/path/to/gee-service-account-key.json
   SUPABASE_JWT_SECRET=your-supabase-jwt-secret
   ```

### Deploy Backend to Google Cloud Run
```bash
cd gee-backend
gcloud run deploy agrieye-gee \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars EE_SERVICE_ACCOUNT="agrieye-gee-sa@...",SUPABASE_JWT_SECRET="..."
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| <kbd>D</kbd> | Activate Polygon Draw Mode |
| <kbd>Esc</kbd> | Cancel active drawing |
| <kbd>Del</kbd> / <kbd>Backspace</kbd> | Delete selected field |

---

## 📄 License
AgriEye is proprietary software built for precision agriculture. Satellite imagery provided courtesy of the European Space Agency (ESA) Copernicus Program and USGS/NASA Landsat.
