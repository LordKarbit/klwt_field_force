import { rawDb } from './db';

export type LocationAddress = {
  province: string;
  city: string;
  district: string;
  village: string;
};

export type ReverseLocationResult = LocationAddress & {
  boundaryId: string;
  code: string | null;
  source: string;
};

type BoundaryRow = ReverseLocationResult & {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
  rings: string;
};

type Coordinate = [number, number];
type BoundaryRings = Coordinate[][];

const locationTable = '"location"';
const boundaryTable = '"locationBoundary"';

function scalarCount(sql: string, params: unknown[] = []) {
  return (rawDb.prepare(sql).get(...params) as { count: number }).count;
}

export function boundaryDataStatus() {
  const count = scalarCount(`select count(*) as count from ${boundaryTable}`);
  return {
    available: count > 0,
    count,
    source: count > 0 ? 'locationBoundary' : 'location',
  };
}

function activeLocationSource() {
  return boundaryDataStatus().available ? boundaryTable : locationTable;
}

export function locationMasterCount() {
  const source = activeLocationSource();
  if (source === boundaryTable) {
    return scalarCount(
      `select count(*) as count from (
        select distinct province, city, district, village from ${boundaryTable}
      )`,
    );
  }
  return scalarCount(`select count(*) as count from ${locationTable}`);
}

export function listLocationProvinces() {
  const source = activeLocationSource();
  const rows = rawDb
    .prepare(`select distinct province as name from ${source} order by province collate nocase`)
    .all() as Array<{ name: string }>;
  return rows.map((row) => row.name);
}

export function listLocationCities(province: string) {
  const source = activeLocationSource();
  const rows = rawDb
    .prepare(`select distinct city as name from ${source} where province = ? order by city collate nocase`)
    .all(province) as Array<{ name: string }>;
  return rows.map((row) => row.name);
}

export function listLocationDistricts(province: string, city: string) {
  const source = activeLocationSource();
  const rows = rawDb
    .prepare(
      `select distinct district as name from ${source}
       where province = ? and city = ?
       order by district collate nocase`,
    )
    .all(province, city) as Array<{ name: string }>;
  return rows.map((row) => row.name);
}

export function listLocationVillages(province: string, city: string, district: string) {
  const source = activeLocationSource();
  const rows = rawDb
    .prepare(
      `select distinct village as name from ${source}
       where province = ? and city = ? and district = ?
       order by village collate nocase`,
    )
    .all(province, city, district) as Array<{ name: string }>;
  return rows.map((row) => row.name);
}

export function locationExists(location: LocationAddress) {
  const source = activeLocationSource();
  const row = rawDb
    .prepare(
      `select 1 from ${source}
       where province = ? and city = ? and district = ? and village = ?
       limit 1`,
    )
    .get(location.province, location.city, location.district, location.village);
  return Boolean(row);
}

function pointInRing(longitude: number, latitude: number, ring: Coordinate[]) {
  let inside = false;
  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current, current += 1) {
    const [currentLng, currentLat] = ring[current];
    const [previousLng, previousLat] = ring[previous];
    const intersects =
      currentLat > latitude !== previousLat > latitude &&
      longitude < ((previousLng - currentLng) * (latitude - currentLat)) / (previousLat - currentLat) + currentLng;
    if (intersects) inside = !inside;
  }
  return inside;
}

function parseRings(serialized: string) {
  const parsed = JSON.parse(serialized) as BoundaryRings;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((ring) => Array.isArray(ring) && ring.length >= 3);
}

function pointInBoundary(longitude: number, latitude: number, serializedRings: string) {
  try {
    return parseRings(serializedRings).some((ring) => pointInRing(longitude, latitude, ring));
  } catch {
    return false;
  }
}

function distanceToBoundingBoxMeters(latitude: number, longitude: number, boundary: BoundaryRow) {
  const nearestLat = Math.max(boundary.minLat, Math.min(latitude, boundary.maxLat));
  const nearestLng = Math.max(boundary.minLng, Math.min(longitude, boundary.maxLng));
  const latMeters = (latitude - nearestLat) * 111_320;
  const lngMeters = (longitude - nearestLng) * 111_320 * Math.cos((latitude * Math.PI) / 180);
  return Math.hypot(latMeters, lngMeters);
}

export function reverseLocation(latitude: number, longitude: number, accuracyMeters = 50) {
  if (!boundaryDataStatus().available) return null;

  const marginDegrees = Math.min(0.005, Math.max(0.00015, accuracyMeters / 111_320));
  const rows = rawDb
    .prepare(
      `select
         id as boundaryId,
         province,
         city,
         district,
         village,
         code,
         minLat,
         minLng,
         maxLat,
         maxLng,
         rings,
         source
       from ${boundaryTable}
       where minLat <= ? and maxLat >= ? and minLng <= ? and maxLng >= ?
       order by ((maxLat - minLat) * (maxLng - minLng)) asc
       limit 80`,
    )
    .all(latitude + marginDegrees, latitude - marginDegrees, longitude + marginDegrees, longitude - marginDegrees) as BoundaryRow[];

  const directMatch = rows.find((row) => pointInBoundary(longitude, latitude, row.rings));
  if (directMatch) {
    const { boundaryId, province, city, district, village, code, source } = directMatch;
    return { boundaryId, province, city, district, village, code, source };
  }

  const nearest = rows
    .map((row) => ({ row, distance: distanceToBoundingBoxMeters(latitude, longitude, row) }))
    .sort((left, right) => left.distance - right.distance)[0];

  if (!nearest || nearest.distance > Math.max(accuracyMeters, 35)) return null;
  const { boundaryId, province, city, district, village, code, source } = nearest.row;
  return { boundaryId, province, city, district, village, code, source };
}
