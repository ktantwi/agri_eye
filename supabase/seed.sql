-- ==============================================================================
-- AgriEye — Demo Data Seed Script
-- ==============================================================================

-- If running on local Supabase studio or psql
DO $$
DECLARE
    demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
    field_1_id UUID := '11111111-1111-1111-1111-111111111111';
    field_2_id UUID := '22222222-2222-2222-2222-222222222222';
    field_3_id UUID := '33333333-3333-3333-3333-333333333333';
BEGIN
    -- Ensure profile exists
    INSERT INTO public.profiles (id, full_name, company, plan, role)
    VALUES (
        demo_user_id,
        'Sarah Jenkins',
        'Midwest AgriVenture Corp',
        'pro',
        'user'
    ) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    -- Field 1: Iowa Corn Belt — Prairie View Plot #4 (~38.4 ha)
    INSERT INTO public.fields (id, user_id, name, geometry, area_ha, crop_type, tags, color)
    VALUES (
        field_1_id,
        demo_user_id,
        'Prairie View Plot #4',
        ST_GeomFromText('POLYGON((-93.5824 42.0315, -93.5732 42.0315, -93.5732 42.0258, -93.5824 42.0258, -93.5824 42.0315))', 4326)::geography,
        38.42,
        'Corn (Dent)',
        ARRAY['Demo Field', 'Corn Belt', 'Pivot Irrigated'],
        '#16a34a'
    ) ON CONFLICT (id) DO NOTHING;

    -- Field 2: San Joaquin Valley — Orchard Block B (~24.6 ha)
    INSERT INTO public.fields (id, user_id, name, geometry, area_ha, crop_type, tags, color)
    VALUES (
        field_2_id,
        demo_user_id,
        'Orchard Block B (Almonds)',
        ST_GeomFromText('POLYGON((-120.4520 36.7820, -120.4440 36.7820, -120.4440 36.7760, -120.4520 36.7760, -120.4520 36.7820))', 4326)::geography,
        24.60,
        'Almonds',
        ARRAY['Drip Irrigation', 'High Value', 'West Coast'],
        '#84cc16'
    ) ON CONFLICT (id) DO NOTHING;

    -- Field 3: Champagne Valley — Vineyard Parcel 12 (~15.2 ha)
    INSERT INTO public.fields (id, user_id, name, geometry, area_ha, crop_type, tags, color)
    VALUES (
        field_3_id,
        demo_user_id,
        'Vineyard Parcel 12 (Pinot)',
        ST_GeomFromText('POLYGON((4.0210 49.0410, 4.0280 49.0410, 4.0280 49.0360, 4.0210 49.0360, 4.0210 49.0410))', 4326)::geography,
        15.20,
        'Grapes (Wine)',
        ARRAY['Europe', 'Organic', 'Export'],
        '#0284c7'
    ) ON CONFLICT (id) DO NOTHING;

    -- Timeseries for Field 1
    INSERT INTO public.ndvi_timeseries (field_id, date, mean_ndvi, cloud_pct) VALUES
        (field_1_id, '2026-05-10', 0.22, 2.1),
        (field_1_id, '2026-05-25', 0.34, 1.4),
        (field_1_id, '2026-06-10', 0.52, 0.8),
        (field_1_id, '2026-06-25', 0.68, 3.2),
        (field_1_id, '2026-07-12', 0.84, 0.5),
        (field_1_id, '2026-07-28', 0.87, 1.1),
        (field_1_id, '2026-08-14', 0.81, 2.0),
        (field_1_id, '2026-08-30', 0.74, 1.8),
        (field_1_id, '2026-09-15', 0.58, 4.0),
        (field_1_id, '2026-10-02', 0.41, 0.9),
        (field_1_id, '2026-10-20', 0.29, 1.2)
    ON CONFLICT DO NOTHING;

    -- Reports
    INSERT INTO public.reports (field_id, user_id, title, format, storage_path, file_size_bytes)
    VALUES
        (field_1_id, demo_user_id, 'Prairie View Peak Season NDVI Summary', 'PDF', 'reports/prairie-view-jul2026.pdf', 1420580),
        (field_1_id, demo_user_id, 'Field 4 Zonal Statistics & Boundary Shapefile', 'GeoTIFF', 'exports/field4-geotiff.tif', 8493020)
    ON CONFLICT DO NOTHING;

    -- Alerts
    INSERT INTO public.alerts (field_id, user_id, threshold, condition, active, email_notify)
    VALUES
        (field_1_id, demo_user_id, 0.45, 'below', true, true),
        (field_2_id, demo_user_id, 0.50, 'below', true, false)
    ON CONFLICT DO NOTHING;

END $$;
