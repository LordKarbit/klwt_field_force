import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const defaultKmlPath = 'C:/Users/Samsul/Downloads/Java Subdistrict Borders.kml';
const sourcePath = process.argv[2] ?? process.env.LOCATION_BOUNDARY_KML ?? defaultKmlPath;
const dbPath = process.env.KLWT_DB_PATH ?? 'data/klwt-surveyor.sqlite';
const simplifyEpsilon = Number(process.env.BOUNDARY_SIMPLIFY_EPSILON ?? '0.00005');
const batchSize = Number(process.env.BOUNDARY_IMPORT_BATCH_SIZE ?? '250');

if (!fs.existsSync(sourcePath)) {
  console.error(`KML file not found: ${sourcePath}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function ensureTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS "location" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "province" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "district" TEXT NOT NULL,
      "village" TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "location_unique_idx" ON "location" ("province", "city", "district", "village");
    CREATE INDEX IF NOT EXISTS "location_province_idx" ON "location" ("province");
    CREATE INDEX IF NOT EXISTS "location_city_idx" ON "location" ("province", "city");
    CREATE INDEX IF NOT EXISTS "location_district_idx" ON "location" ("province", "city", "district");

    CREATE TABLE IF NOT EXISTS "locationBoundary" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "province" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "district" TEXT NOT NULL,
      "village" TEXT NOT NULL,
      "code" TEXT,
      "minLat" REAL NOT NULL,
      "minLng" REAL NOT NULL,
      "maxLat" REAL NOT NULL,
      "maxLng" REAL NOT NULL,
      "rings" TEXT NOT NULL,
      "pointCount" INTEGER NOT NULL,
      "source" TEXT NOT NULL DEFAULT 'kml',
      "createdAt" INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "locationBoundary_bbox_idx" ON "locationBoundary" ("minLng", "maxLng", "minLat", "maxLat");
    CREATE INDEX IF NOT EXISTS "locationBoundary_location_idx" ON "locationBoundary" ("province", "city", "district", "village");

    DROP TABLE IF EXISTS "locationBoundaryImport";
    CREATE TABLE "locationBoundaryImport" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "province" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "district" TEXT NOT NULL,
      "village" TEXT NOT NULL,
      "code" TEXT,
      "minLat" REAL NOT NULL,
      "minLng" REAL NOT NULL,
      "maxLat" REAL NOT NULL,
      "maxLng" REAL NOT NULL,
      "rings" TEXT NOT NULL,
      "pointCount" INTEGER NOT NULL,
      "source" TEXT NOT NULL,
      "createdAt" INTEGER NOT NULL
    );
  `);
}

function xmlValue(block, name) {
  const match = new RegExp(`<SimpleData name="${name}">([\\s\\S]*?)<\\/SimpleData>`).exec(block);
  return match ? decodeXml(match[1]).trim() : '';
}

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function squaredDistance(left, right) {
  const deltaLng = left[0] - right[0];
  const deltaLat = left[1] - right[1];
  return deltaLng * deltaLng + deltaLat * deltaLat;
}

function perpendicularDistanceSquared(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return squaredDistance(point, start);
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  const projected = [start[0] + t * dx, start[1] + t * dy];
  return squaredDistance(point, projected);
}

function simplifyOpenPath(points, epsilon) {
  if (points.length <= 3 || epsilon <= 0) return points;
  const epsilonSquared = epsilon * epsilon;
  const keep = new Uint8Array(points.length);
  const stack = [[0, points.length - 1]];
  keep[0] = 1;
  keep[points.length - 1] = 1;

  while (stack.length) {
    const [first, last] = stack.pop();
    let maxDistance = 0;
    let maxIndex = first;
    for (let index = first + 1; index < last; index += 1) {
      const distance = perpendicularDistanceSquared(points[index], points[first], points[last]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = index;
      }
    }
    if (maxDistance > epsilonSquared) {
      keep[maxIndex] = 1;
      stack.push([first, maxIndex], [maxIndex, last]);
    }
  }

  return points.filter((_point, index) => keep[index]);
}

function simplifyClosedRing(points, epsilon) {
  if (points.length <= 4 || epsilon <= 0) return points;
  const withoutClosure =
    squaredDistance(points[0], points[points.length - 1]) < 1e-18 ? points.slice(0, -1) : points.slice();
  if (withoutClosure.length <= 4) return withoutClosure;

  const centroid = withoutClosure.reduce(
    (accumulator, point) => [accumulator[0] + point[0], accumulator[1] + point[1]],
    [0, 0],
  );
  centroid[0] /= withoutClosure.length;
  centroid[1] /= withoutClosure.length;

  let startIndex = 0;
  let farthestDistance = -1;
  withoutClosure.forEach((point, index) => {
    const distance = squaredDistance(point, centroid);
    if (distance > farthestDistance) {
      farthestDistance = distance;
      startIndex = index;
    }
  });

  const rotated = [...withoutClosure.slice(startIndex), ...withoutClosure.slice(0, startIndex), withoutClosure[startIndex]];
  const simplified = simplifyOpenPath(rotated, epsilon).slice(0, -1);
  return simplified.length >= 3 ? simplified : withoutClosure;
}

function parseCoordinateBlock(coordinateText) {
  const coordinatePattern = /(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,-?\d+(?:\.\d+)?)?/g;
  const points = [];
  let match;
  let minLat = Number.POSITIVE_INFINITY;
  let minLng = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;

  while ((match = coordinatePattern.exec(coordinateText)) !== null) {
    const longitude = Number(match[1]);
    const latitude = Number(match[2]);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
    points.push([Number(longitude.toFixed(7)), Number(latitude.toFixed(7))]);
    minLat = Math.min(minLat, latitude);
    minLng = Math.min(minLng, longitude);
    maxLat = Math.max(maxLat, latitude);
    maxLng = Math.max(maxLng, longitude);
  }

  if (points.length < 3) return null;
  return {
    ring: simplifyClosedRing(points, simplifyEpsilon),
    pointCount: points.length,
    minLat,
    minLng,
    maxLat,
    maxLng,
  };
}

function extractRings(block) {
  const rings = [];
  let pointCount = 0;
  let minLat = Number.POSITIVE_INFINITY;
  let minLng = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  const outerPattern = /<outerBoundaryIs>[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>[\s\S]*?<\/outerBoundaryIs>/g;
  const fallbackPattern = /<coordinates>([\s\S]*?)<\/coordinates>/g;
  let pattern = outerPattern;
  let match;

  while ((match = pattern.exec(block)) !== null) {
    const parsed = parseCoordinateBlock(match[1]);
    if (!parsed) continue;
    rings.push(parsed.ring);
    pointCount += parsed.pointCount;
    minLat = Math.min(minLat, parsed.minLat);
    minLng = Math.min(minLng, parsed.minLng);
    maxLat = Math.max(maxLat, parsed.maxLat);
    maxLng = Math.max(maxLng, parsed.maxLng);
  }

  if (!rings.length) {
    pattern = fallbackPattern;
    while ((match = pattern.exec(block)) !== null) {
      const parsed = parseCoordinateBlock(match[1]);
      if (!parsed) continue;
      rings.push(parsed.ring);
      pointCount += parsed.pointCount;
      minLat = Math.min(minLat, parsed.minLat);
      minLng = Math.min(minLng, parsed.minLng);
      maxLat = Math.max(maxLat, parsed.maxLat);
      maxLng = Math.max(maxLng, parsed.maxLng);
    }
  }

  if (!rings.length) return null;
  return { rings, pointCount, minLat, minLng, maxLat, maxLng };
}

function fnv1aHex(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function processPlacemark(block, sequence) {
  const province = xmlValue(block, 'WADMPR');
  const city = xmlValue(block, 'WADMKK');
  const district = xmlValue(block, 'WADMKC');
  const village = xmlValue(block, 'WADMKD');
  if (!province || !city || !district || !village) return null;

  const geometry = extractRings(block);
  if (!geometry) return null;

  const code = xmlValue(block, 'KDEPUM') || xmlValue(block, 'KDEBPS') || xmlValue(block, 'OBJECTID') || null;
  return {
    id: `BND-${String(sequence).padStart(6, '0')}`,
    province,
    city,
    district,
    village,
    code,
    minLat: geometry.minLat,
    minLng: geometry.minLng,
    maxLat: geometry.maxLat,
    maxLng: geometry.maxLng,
    rings: JSON.stringify(geometry.rings),
    pointCount: geometry.pointCount,
    source: 'java-subdistrict-borders-kml',
    createdAt: Date.now(),
  };
}

ensureTables();

const insertBoundary = db.prepare(`
  insert into "locationBoundaryImport"
    ("id", "province", "city", "district", "village", "code", "minLat", "minLng", "maxLat", "maxLng", "rings", "pointCount", "source", "createdAt")
  values
    (@id, @province, @city, @district, @village, @code, @minLat, @minLng, @maxLat, @maxLng, @rings, @pointCount, @source, @createdAt)
`);

const insertLocation = db.prepare(`
  insert or ignore into "location" ("id", "province", "city", "district", "village")
  values (@id, @province, @city, @district, @village)
`);

const insertBatch = db.transaction((rows) => {
  for (const row of rows) {
    insertBoundary.run(row);
    insertLocation.run({
      id: `LOC-KML-${fnv1aHex(`${row.province}|${row.city}|${row.district}|${row.village}`)}`,
      province: row.province,
      city: row.city,
      district: row.district,
      village: row.village,
    });
  }
});

let buffer = '';
let scanned = 0;
let imported = 0;
let skipped = 0;
let batch = [];
const stream = fs.createReadStream(sourcePath, { encoding: 'utf8', highWaterMark: 1024 * 1024 });

function flushBatch() {
  if (!batch.length) return;
  insertBatch(batch);
  batch = [];
}

function consumeBuffer(final = false) {
  while (true) {
    const start = buffer.indexOf('<Placemark');
    if (start === -1) {
      buffer = final ? '' : buffer.slice(-64);
      return;
    }

    const end = buffer.indexOf('</Placemark>', start);
    if (end === -1) {
      buffer = buffer.slice(start);
      return;
    }

    const blockEnd = end + '</Placemark>'.length;
    const block = buffer.slice(start, blockEnd);
    scanned += 1;
    const row = processPlacemark(block, scanned);
    if (row) {
      batch.push(row);
      imported += 1;
      if (batch.length >= batchSize) flushBatch();
    } else {
      skipped += 1;
    }

    if (scanned % 500 === 0) {
      console.log(`Processed ${scanned.toLocaleString('id-ID')} placemarks, imported ${imported.toLocaleString('id-ID')}.`);
    }

    buffer = buffer.slice(blockEnd);
  }
}

console.log(`Importing location boundaries from ${sourcePath}`);
console.log(`SQLite target: ${dbPath}`);
console.log(`Simplification epsilon: ${simplifyEpsilon}`);

await new Promise((resolve, reject) => {
  stream.on('data', (chunk) => {
    buffer += chunk;
    consumeBuffer(false);
  });
  stream.on('error', reject);
  stream.on('end', resolve);
});

consumeBuffer(true);
flushBatch();

db.transaction(() => {
  db.exec(`
    delete from "locationBoundary";
    insert into "locationBoundary"
      ("id", "province", "city", "district", "village", "code", "minLat", "minLng", "maxLat", "maxLng", "rings", "pointCount", "source", "createdAt")
    select
      "id", "province", "city", "district", "village", "code", "minLat", "minLng", "maxLat", "maxLng", "rings", "pointCount", "source", "createdAt"
    from "locationBoundaryImport";
    drop table "locationBoundaryImport";
  `);
})();

const boundaryCount = db.prepare('select count(*) as count from "locationBoundary"').get().count;
const locationCount = db.prepare('select count(*) as count from "location"').get().count;
console.log(
  `Done. Scanned ${scanned.toLocaleString('id-ID')} placemarks, imported ${boundaryCount.toLocaleString(
    'id-ID',
  )} boundaries, skipped ${skipped.toLocaleString('id-ID')}. Master locations: ${locationCount.toLocaleString('id-ID')}.`,
);

db.close();
