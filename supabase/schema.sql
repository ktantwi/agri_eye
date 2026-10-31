-- ==============================================================================
-- AgriEye — Database Schema & Security Policies (Supabase / Postgres + PostGIS)
-- ==============================================================================

-- 1. Enable PostGIS extension for spatial queries and geometry calculations
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company TEXT,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Fields Table (stores farm/field boundaries as PostGIS Geography Polygons)
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    geometry GEOGRAPHY(POLYGON, 4326) NOT NULL,
    area_ha NUMERIC(10, 2) NOT NULL,
    crop_type TEXT DEFAULT 'Corn',
    tags TEXT[] DEFAULT '{}',
    color TEXT DEFAULT '#16a34a',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Spatial index on geometry for blazing-fast bounding-box & containment queries
CREATE INDEX IF NOT EXISTS idx_fields_geometry ON public.fields USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON public.fields(user_id);

-- 4. Analyses Table (summary stats for satellite acquisitions)
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    satellite TEXT NOT NULL DEFAULT 'Sentinel-2 L2A',
    index_type TEXT NOT NULL DEFAULT 'NDVI' CHECK (index_type IN ('NDVI', 'EVI', 'NDWI', 'NDRE')),
    mean_ndvi NUMERIC(5, 4),
    min_ndvi NUMERIC(5, 4),
    max_ndvi NUMERIC(5, 4),
    std_ndvi NUMERIC(5, 4),
    cloud_pct NUMERIC(5, 2) DEFAULT 0,
    tile_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_analyses_field_id ON public.analyses(field_id);
CREATE INDEX IF NOT EXISTS idx_analyses_dates ON public.analyses(field_id, date_start, date_end);

-- 5. NDVI Timeseries Table (multi-temporal trend data for charting)
CREATE TABLE IF NOT EXISTS public.ndvi_timeseries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mean_ndvi NUMERIC(5, 4) NOT NULL,
    cloud_pct NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_timeseries_field_date ON public.ndvi_timeseries(field_id, date ASC);

-- 6. Alerts Table (crop stress / NDVI anomaly triggers)
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    threshold NUMERIC(5, 4) NOT NULL DEFAULT 0.4000,
    condition TEXT NOT NULL DEFAULT 'below' CHECK (condition IN ('below', 'drop_by')),
    active BOOLEAN NOT NULL DEFAULT true,
    email_notify BOOLEAN NOT NULL DEFAULT true,
    last_triggered TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_field_id ON public.alerts(field_id);

-- 7. Reports Table (PDF, GeoTIFF, CSV export records)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('PDF', 'GeoTIFF', 'CSV', 'PNG')),
    storage_path TEXT NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);

-- 8. Contact Messages Table (public landing contact form submissions)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'replied', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Usage Logs Table (monitoring GEE tile calls, rate limits & quota)
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL,
    bytes_transferred BIGINT DEFAULT 0,
    execution_time_ms INT DEFAULT 0,
    status_code INT DEFAULT 200,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_usage_user_date ON public.usage_logs(user_id, created_at);


-- ==============================================================================
-- Row Level Security (RLS) Policies on Every Table
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ndvi_timeseries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Fields Policies (Strict isolation per user)
CREATE POLICY "Users can view own fields"
    ON public.fields FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own fields"
    ON public.fields FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fields"
    ON public.fields FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fields"
    ON public.fields FOR DELETE
    USING (auth.uid() = user_id);

-- Analyses Policies
CREATE POLICY "Users can view analyses for own fields"
    ON public.analyses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.fields
            WHERE fields.id = analyses.field_id AND fields.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert analyses for own fields"
    ON public.analyses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.fields
            WHERE fields.id = analyses.field_id AND fields.user_id = auth.uid()
        )
    );

-- Timeseries Policies
CREATE POLICY "Users can view timeseries for own fields"
    ON public.ndvi_timeseries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.fields
            WHERE fields.id = ndvi_timeseries.field_id AND fields.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert timeseries for own fields"
    ON public.ndvi_timeseries FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.fields
            WHERE fields.id = ndvi_timeseries.field_id AND fields.user_id = auth.uid()
        )
    );

-- Alerts Policies
CREATE POLICY "Users can view own alerts"
    ON public.alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alerts"
    ON public.alerts FOR ALL
    USING (auth.uid() = user_id);

-- Reports Policies
CREATE POLICY "Users can view own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reports"
    ON public.reports FOR ALL
    USING (auth.uid() = user_id);

-- Contact Messages Policies (Public can insert contact inquiry; admins can read)
CREATE POLICY "Anyone can submit contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages"
    ON public.contact_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Usage Logs Policies
CREATE POLICY "Users can view own usage logs"
    ON public.usage_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users or service can insert usage logs"
    ON public.usage_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);


-- ==============================================================================
-- Triggers & Automation
-- ==============================================================================

-- Function to automatically create profile and seed demo field on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_field_id UUID;
BEGIN
    -- 1. Create Profile
    INSERT INTO public.profiles (id, full_name, plan, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'free',
        'user'
    );

    -- 2. Seed Demo Field so the app looks alive immediately!
    -- Demo field: "Iowa Corn Belt — Prairie View Plot #4", ~38.4 hectares
    INSERT INTO public.fields (
        id,
        user_id,
        name,
        geometry,
        area_ha,
        crop_type,
        tags,
        color
    ) VALUES (
        uuid_generate_v4(),
        NEW.id,
        'Iowa Corn Belt — Prairie View Plot #4',
        ST_GeomFromText(
            'POLYGON((-93.5824 42.0315, -93.5732 42.0315, -93.5732 42.0258, -93.5824 42.0258, -93.5824 42.0315))',
            4326
        )::geography,
        38.42,
        'Corn (Dent)',
        ARRAY['Demo Field', 'Corn Belt', 'Pivot Irrigated'],
        '#16a34a'
    ) RETURNING id INTO new_field_id;

    -- 3. Seed sample timeseries for demo field
    INSERT INTO public.ndvi_timeseries (field_id, date, mean_ndvi, cloud_pct) VALUES
        (new_field_id, '2026-05-10', 0.22, 2.1),
        (new_field_id, '2026-05-25', 0.34, 1.4),
        (new_field_id, '2026-06-10', 0.52, 0.8),
        (new_field_id, '2026-06-25', 0.68, 3.2),
        (new_field_id, '2026-07-12', 0.84, 0.5),
        (new_field_id, '2026-07-28', 0.87, 1.1),
        (new_field_id, '2026-08-14', 0.81, 2.0),
        (new_field_id, '2026-08-30', 0.74, 1.8),
        (new_field_id, '2026-09-15', 0.58, 4.0),
        (new_field_id, '2026-10-02', 0.41, 0.9),
        (new_field_id, '2026-10-20', 0.29, 1.2);

    -- 4. Seed sample analysis
    INSERT INTO public.analyses (
        field_id,
        date_start,
        date_end,
        satellite,
        index_type,
        mean_ndvi,
        min_ndvi,
        max_ndvi,
        std_ndvi,
        cloud_pct
    ) VALUES (
        new_field_id,
        '2026-07-01',
        '2026-07-31',
        'Sentinel-2 L2A',
        'NDVI',
        0.8450,
        0.5820,
        0.9140,
        0.0680,
        0.50
    );

    -- 5. Seed sample alert
    INSERT INTO public.alerts (
        field_id,
        user_id,
        threshold,
        condition,
        active,
        email_notify
    ) VALUES (
        new_field_id,
        NEW.id,
        0.45,
        'below',
        true,
        true
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
