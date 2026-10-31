import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { useMapStore } from '../../store/mapStore';
import { Field, GeoJSONPolygon, BasemapType } from '../../types/field';
import { calculateAreaHa, getBoundsForGeometry } from '../../lib/geoUtils';
import { fetchPixelValue } from '../../lib/geeApi';

interface MapContainerProps {
  onMapReady?: (map: maplibregl.Map) => void;
}

const BASEMAP_STYLES: Record<BasemapType, any> = {
  satellite: {
    version: 8,
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'esri-satellite-layer',
        type: 'raster',
        source: 'esri-satellite',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
  streets: {
    version: 8,
    sources: {
      'osm-streets': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'osm-streets-layer',
        type: 'raster',
        source: 'osm-streets',
      },
    ],
  },
  terrain: {
    version: 8,
    sources: {
      'opentopo': {
        type: 'raster',
        tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenTopoMap, OpenStreetMap',
        maxzoom: 17,
      },
    },
    layers: [
      {
        id: 'opentopo-layer',
        type: 'raster',
        source: 'opentopo',
      },
    ],
  },
};

export const MapContainer: React.FC<MapContainerProps> = ({ onMapReady }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const {
    fields,
    selectedField,
    setSelectedField,
    activeBasemap,
    activeIndex,
    paletteType,
    layerOpacity,
    dateRange,
    timelineDate,
    compareMode,
    compareDateA,
    compareDateB,
    swipePosition,
    drawTool,
    setDrawTool,
    isDrawing,
    setIsDrawing,
    setCurrentDrawAreaHa,
    setPixelInspection,
    addField,
  } = useMapStore();

  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter: [number, number] = selectedField
      ? [selectedField.geometry.coordinates[0][0][0], selectedField.geometry.coordinates[0][0][1]]
      : [-93.578, 42.028]; // Central Iowa Corn Belt demo center

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: BASEMAP_STYLES.satellite,
      center: initialCenter,
      zoom: 13.5,
      pitch: 0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    // Initialize MapboxDraw
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      styles: [
        // Active line
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#84cc16', 'line-dasharray': [0.2, 2], 'line-width': 3 },
        },
        // Active polygon fill
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: { 'fill-color': '#84cc16', 'fill-opacity': 0.25 },
        },
        // Active polygon stroke
        {
          id: 'gl-draw-polygon-stroke',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#14532d', 'line-width': 2.5 },
        },
        // Vertex points
        {
          id: 'gl-draw-point',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          paint: { 'circle-radius': 5, 'circle-color': '#84cc16', 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff' },
        },
      ],
    });

    map.addControl(draw as any);
    drawRef.current = draw;

    map.on('load', () => {
      setMapLoaded(true);
      if (onMapReady) onMapReady(map);

      // Add Saved Fields GeoJSON Source & Layers
      map.addSource('fields-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: fields.map((f) => ({
            type: 'Feature',
            id: f.id,
            geometry: f.geometry,
            properties: {
              id: f.id,
              name: f.name,
              area_ha: f.area_ha,
              crop_type: f.crop_type,
              color: f.color || '#16a34a',
            },
          })),
        },
      });

      // Fields Fill Layer
      map.addLayer({
        id: 'fields-fill',
        type: 'fill',
        source: 'fields-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.18,
        },
      });

      // Fields Outline Stroke Layer
      map.addLayer({
        id: 'fields-outline',
        type: 'line',
        source: 'fields-source',
        paint: {
          'line-color': '#84cc16',
          'line-width': 2.5,
          'line-dasharray': [2, 1],
        },
      });

      // Selected Field Highlight Layer
      map.addLayer({
        id: 'fields-selected-highlight',
        type: 'line',
        source: 'fields-source',
        paint: {
          'line-color': '#ffffff',
          'line-width': 4,
        },
        filter: ['==', 'id', selectedField?.id || ''],
      });

      // Click field boundary to select
      map.on('click', 'fields-fill', (e) => {
        if (drawRef.current && drawRef.current.getMode() !== 'simple_select') return;
        const feature = e.features?.[0];
        if (feature) {
          const fieldId = feature.properties?.id;
          const found = fields.find((f) => f.id === fieldId);
          if (found) {
            setSelectedField(found);
          }
        }
      });

      // Click anywhere to probe exact pixel NDVI
      map.on('click', async (e) => {
        if (drawRef.current && drawRef.current.getMode() !== 'simple_select') return;
        
        // Check if clicked point is inside any field
        const pt = turf.point([e.lngLat.lng, e.lngLat.lat]);
        const matched = fields.find((f) => {
          try {
            return turf.booleanPointInPolygon(pt, f.geometry as any);
          } catch {
            return false;
          }
        });

        if (matched) {
          const pixelData = await fetchPixelValue({
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
            date_start: dateRange.start,
            date_end: timelineDate || dateRange.end,
            index: activeIndex,
          });
          setPixelInspection(pixelData);
        }
      });

      // Cursor pointer on field hover
      map.on('mouseenter', 'fields-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'fields-fill', () => {
        map.getCanvas().style.cursor = '';
      });

      // Setup dynamic NDVI Raster Tile source
      updateNdviRasterLayer(map);
    });

    // Draw Event Listeners
    map.on('draw.create', (e: any) => {
      const feature = e.features?.[0];
      if (feature && feature.geometry.type === 'Polygon') {
        const area_ha = calculateAreaHa(feature.geometry);
        const newField: Field = {
          id: `field-${Date.now()}`,
          user_id: 'user-id',
          name: `Plot #${fields.length + 1} (${area_ha} ha)`,
          geometry: feature.geometry,
          area_ha,
          crop_type: 'Corn (Dent)',
          tags: ['Drawn Field'],
          color: '#16a34a',
          created_at: new Date().toISOString(),
          latest_ndvi: 0.82,
          ndvi_trend: 'up',
          latest_image_date: '2026-07-28',
        };
        addField(newField);
        draw.deleteAll();
        setIsDrawing(false);
        setDrawTool('select');
      }
    });

    map.on('draw.render', () => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const activeGeom = data.features[data.features.length - 1].geometry;
        if (activeGeom.type === 'Polygon') {
          const liveHa = calculateAreaHa(activeGeom);
          setCurrentDrawAreaHa(liveHa);
        }
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update basemap style
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    map.setStyle(BASEMAP_STYLES[activeBasemap]);
    map.once('style.load', () => {
      // Re-add sources and layers after basemap style switch
      refreshLayersOnMap(map);
    });
  }, [activeBasemap]);

  // Update fields data source whenever fields change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const source = map.getSource('fields-source') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: fields.map((f) => ({
          type: 'Feature',
          id: f.id,
          geometry: f.geometry,
          properties: {
            id: f.id,
            name: f.name,
            area_ha: f.area_ha,
            crop_type: f.crop_type,
            color: f.color || '#16a34a',
          },
        })),
      });
    }
  }, [fields, mapLoaded]);

  // Update selected highlight & flyTo field
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !selectedField) return;

    if (map.getLayer('fields-selected-highlight')) {
      map.setFilter('fields-selected-highlight', ['==', 'id', selectedField.id]);
    }

    // Smooth camera fly-to field bounding box
    const bounds = getBoundsForGeometry(selectedField.geometry);
    if (bounds) {
      map.fitBounds(bounds, {
        padding: { top: 100, bottom: 120, left: 340, right: 400 },
        duration: 1400,
        maxZoom: 16.5,
      });
    }

    // Refresh NDVI raster
    updateNdviRasterLayer(map);
  }, [selectedField, mapLoaded]);

  // Update raster opacity & index
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    if (map.getLayer('ndvi-raster-layer')) {
      map.setPaintProperty('ndvi-raster-layer', 'raster-opacity', layerOpacity);
    }
  }, [layerOpacity, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    updateNdviRasterLayer(map);
  }, [activeIndex, paletteType, timelineDate, dateRange, compareMode, mapLoaded]);

  // Helper to re-add layers after style changes
  const refreshLayersOnMap = (map: maplibregl.Map) => {
    if (!map.getSource('fields-source')) {
      map.addSource('fields-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: fields.map((f) => ({
            type: 'Feature',
            id: f.id,
            geometry: f.geometry,
            properties: { id: f.id, color: f.color || '#16a34a' },
          })),
        },
      });

      map.addLayer({
        id: 'fields-fill',
        type: 'fill',
        source: 'fields-source',
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.18 },
      });

      map.addLayer({
        id: 'fields-outline',
        type: 'line',
        source: 'fields-source',
        paint: { 'line-color': '#84cc16', 'line-width': 2.5, 'line-dasharray': [2, 1] },
      });

      map.addLayer({
        id: 'fields-selected-highlight',
        type: 'line',
        source: 'fields-source',
        paint: { 'line-color': '#ffffff', 'line-width': 4 },
        filter: ['==', 'id', selectedField?.id || ''],
      });
    }
    updateNdviRasterLayer(map);
  };

  // Helper to update GEE / simulated satellite raster layer
  const updateNdviRasterLayer = (map: maplibregl.Map) => {
    if (!map.isStyleLoaded()) return;

    // Remove old raster layers if present
    if (map.getLayer('ndvi-raster-layer')) map.removeLayer('ndvi-raster-layer');
    if (map.getSource('ndvi-raster-source')) map.removeSource('ndvi-raster-source');

    // Build XYZ tile URL
    const baseUrl = import.meta.env.VITE_GEE_API_URL || 'http://localhost:8080';
    const tileUrl = `${baseUrl}/ndvi/mock-tiles/{z}/{x}/{y}.png?index=${activeIndex}&palette=${paletteType}`;

    map.addSource('ndvi-raster-source', {
      type: 'raster',
      tiles: [tileUrl],
      tileSize: 256,
      maxzoom: 18,
    });

    // Add raster layer beneath field outlines
    const beforeId = map.getLayer('fields-outline') ? 'fields-outline' : undefined;
    map.addLayer(
      {
        id: 'ndvi-raster-layer',
        type: 'raster',
        source: 'ndvi-raster-source',
        paint: {
          'raster-opacity': layerOpacity,
          'raster-fade-duration': 300,
        },
      },
      beforeId
    );
  };

  // Draw tool trigger from DrawToolbar
  useEffect(() => {
    const draw = drawRef.current;
    if (!draw) return;

    if (drawTool === 'polygon' && isDrawing) {
      draw.changeMode('draw_polygon');
    } else if (drawTool === 'rectangle' && isDrawing) {
      // Draw rectangle using polygon mode
      draw.changeMode('draw_polygon');
    } else if (drawTool === 'circle' && isDrawing) {
      draw.changeMode('draw_polygon');
    } else if (drawTool === 'edit' && selectedField) {
      draw.changeMode('direct_select', { featureId: selectedField.id });
    } else if (drawTool === 'select') {
      draw.changeMode('simple_select');
    }
  }, [drawTool, isDrawing, selectedField]);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
