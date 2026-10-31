import * as turf from '@turf/turf';
import { kml } from 'togeojson';
import JSZip from 'jszip';
import { GeoJSONPolygon } from '../types/field';

/**
 * Calculates area of a GeoJSON polygon in hectares.
 * 1 hectare = 10,000 square meters.
 */
export function calculateAreaHa(geometry: GeoJSONPolygon | any): number {
  try {
    const areaM2 = turf.area(geometry);
    const ha = areaM2 / 10000;
    return Math.round(ha * 100) / 100;
  } catch (err) {
    console.error('Error calculating area:', err);
    return 0;
  }
}

/**
 * Returns [minLng, minLat, maxLng, maxLat] bounding box for zooming.
 */
export function getBoundsForGeometry(geometry: GeoJSONPolygon | any): [number, number, number, number] | null {
  try {
    const bbox = turf.bbox(geometry);
    return bbox as [number, number, number, number];
  } catch (err) {
    console.error('Error calculating bounds:', err);
    return null;
  }
}

/**
 * Returns center coordinate [lng, lat] for a geometry.
 */
export function getCenterCoordinate(geometry: GeoJSONPolygon | any): [number, number] {
  try {
    const centroid = turf.centroid(geometry);
    return centroid.geometry.coordinates as [number, number];
  } catch (err) {
    return [0, 0];
  }
}

/**
 * Parses user-uploaded file (GeoJSON, KML, or Zipped shapefile/geojson archive).
 */
export async function parseBoundaryFile(file: File): Promise<{
  name: string;
  geometry: GeoJSONPolygon;
  area_ha: number;
}> {
  const fileName = file.name.toLowerCase();

  // 1. Plain GeoJSON or JSON
  if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    return extractPolygonFromGeoJson(parsed, file.name);
  }

  // 2. KML File
  if (fileName.endsWith('.kml')) {
    const text = await file.text();
    const dom = new DOMParser().parseFromString(text, 'text/xml');
    const convertedGeoJson = kml(dom);
    return extractPolygonFromGeoJson(convertedGeoJson, file.name);
  }

  // 3. Zipped file (Shapefile or zipped GeoJSON)
  if (fileName.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(file);
    
    // Look for any geojson or json inside
    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir && (relativePath.endsWith('.geojson') || relativePath.endsWith('.json'))) {
        const content = await zipEntry.async('string');
        const parsed = JSON.parse(content);
        return extractPolygonFromGeoJson(parsed, file.name);
      }
    }

    // Look for KML inside
    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir && relativePath.endsWith('.kml')) {
        const content = await zipEntry.async('string');
        const dom = new DOMParser().parseFromString(content, 'text/xml');
        const converted = kml(dom);
        return extractPolygonFromGeoJson(converted, file.name);
      }
    }

    throw new Error('No compatible GeoJSON, KML, or boundary file found inside the zip archive.');
  }

  throw new Error('Unsupported format. Please upload a GeoJSON, KML, or zip archive.');
}

function extractPolygonFromGeoJson(geojson: any, defaultName: string) {
  let polygonGeom: GeoJSONPolygon | null = null;
  let fieldName = defaultName.replace(/\.[^/.]+$/, '');

  if (geojson.type === 'FeatureCollection' && geojson.features?.length > 0) {
    const feature = geojson.features.find((f: any) => 
      f.geometry?.type === 'Polygon' || f.geometry?.type === 'MultiPolygon'
    ) || geojson.features[0];

    if (feature.properties?.name) {
      fieldName = feature.properties.name;
    }

    if (feature.geometry.type === 'Polygon') {
      polygonGeom = feature.geometry;
    } else if (feature.geometry.type === 'MultiPolygon') {
      // Pick first polygon in multipolygon
      polygonGeom = {
        type: 'Polygon',
        coordinates: feature.geometry.coordinates[0]
      };
    }
  } else if (geojson.type === 'Feature') {
    if (geojson.properties?.name) fieldName = geojson.properties.name;
    if (geojson.geometry?.type === 'Polygon') {
      polygonGeom = geojson.geometry;
    }
  } else if (geojson.type === 'Polygon') {
    polygonGeom = geojson;
  }

  if (!polygonGeom) {
    throw new Error('Could not find a valid Polygon geometry in the uploaded file.');
  }

  const area_ha = calculateAreaHa(polygonGeom);

  return {
    name: fieldName,
    geometry: polygonGeom,
    area_ha
  };
}
