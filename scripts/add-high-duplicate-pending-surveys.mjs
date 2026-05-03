import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';

const db = new Database('data/klwt-surveyor.sqlite');
const desiredCount = 8;
const generatedPrefix = 'KLWT-DUP-QA-';

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeStore(value) {
  return normalizeText(value)
    .replace(/\b(pt|cv|toko|bengkel|motor|auto|parts|sparepart|radiator|cooling|ac|jaya|sumber|sentosa|makmur|prima|mandiri)\b/g, '')
    .trim();
}

function sameText(left, right) {
  const normalizedLeft = normalizeText(left);
  const normalizedRight = normalizeText(right);
  return Boolean(normalizedLeft && normalizedLeft === normalizedRight);
}

function parseCoordinate(value) {
  const parsed = Number(String(value ?? '').trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function coordinateDistanceMeters(source, candidate) {
  const sourceLat = parseCoordinate(source.latitude);
  const sourceLng = parseCoordinate(source.longitude);
  const candidateLat = parseCoordinate(candidate.latitude);
  const candidateLng = parseCoordinate(candidate.longitude);
  if (sourceLat === null || sourceLng === null || candidateLat === null || candidateLng === null) return null;

  const toRad = (value) => (value * Math.PI) / 180;
  const radiusMeters = 6371_000;
  const dLat = toRad(candidateLat - sourceLat);
  const dLng = toRad(candidateLng - sourceLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(sourceLat)) * Math.cos(toRad(candidateLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(radiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function duplicateScore(source, candidate) {
  const sourceStore = normalizeStore(source.storeName);
  const candidateStore = normalizeStore(candidate.storeName);
  const sourceAddress = normalizeText(source.addressDetail);
  const candidateAddress = normalizeText(candidate.addressDetail);
  const coordinateDistance = coordinateDistanceMeters(source, candidate);
  const signals = [
    { weight: 30, matched: Boolean(sourceStore && sourceStore === candidateStore) },
    { weight: 25, matched: sameText(source.whatsappNumber, candidate.whatsappNumber) },
    { weight: 10, matched: sameText(source.city, candidate.city) },
    { weight: 10, matched: sameText(source.district, candidate.district) },
    { weight: 8, matched: sameText(source.village, candidate.village) },
    { weight: 12, matched: Boolean(sourceAddress && candidateAddress && sourceAddress.slice(0, 24) === candidateAddress.slice(0, 24)) },
    { weight: 5, matched: coordinateDistance !== null && coordinateDistance <= 100 },
  ];
  const matchedWeight = signals.reduce((total, signal) => total + (signal.matched ? signal.weight : 0), 0);
  const totalWeight = signals.reduce((total, signal) => total + signal.weight, 0);
  return totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0;
}

function jitterCoordinate(value, index, direction) {
  const parsed = parseCoordinate(value);
  if (parsed === null) return value;
  const offset = (0.00008 + index * 0.00001) * direction;
  return (parsed + offset).toFixed(6);
}

function cloneForDuplicate(source, index) {
  const now = new Date('2026-05-03T10:00:00+07:00').getTime();
  const submitTime = now - index * 23 * 60_000;
  const visitStartTime = submitTime - 18 * 60_000;
  const visitDate = new Date(submitTime);
  visitDate.setHours(8, 0, 0, 0);

  return {
    ...source,
    id: nanoid(),
    assignmentId: null,
    storeCode: `${generatedPrefix}${String(index + 1).padStart(3, '0')}`,
    candidateStoreStatus: 'CANDIDATE_STORE',
    storeName: index % 3 === 1 ? `Toko ${source.storeName}` : source.storeName,
    storeAlias: source.storeName,
    plannedOrUnplanned: 'UNPLANNED',
    addressDetail: `${source.addressDetail}, kunjungan ulang surveyor`,
    latitude: jitterCoordinate(source.latitude, index, index % 2 === 0 ? 1 : -1),
    longitude: jitterCoordinate(source.longitude, index, index % 2 === 0 ? -1 : 1),
    gpsAccuracy: Math.min(24, Math.max(6, Number(source.gpsAccuracy ?? 10) + (index % 4))),
    gpsWarningFlag: 0,
    gpsDistanceFromTarget: 18 + index * 3,
    surveyorNotes: `Sampel antrean duplicate review. Dibuat dari ${source.storeCode} untuk validasi skor duplikasi >70%.`,
    warningFlags: '[]',
    verificationStatus: 'WAITING_VERIFICATION_WARNING',
    verificatorId: null,
    verificationNotes: null,
    revisionRequest: null,
    verifierPhoneCallable: null,
    verifierWhatsappReachable: null,
    verifierContactCheckedAt: null,
    visitDate: visitDate.getTime(),
    visitStartTime,
    submitTime,
    verifiedAt: null,
    createdAt: submitTime,
    updatedAt: submitTime,
  };
}

const sources = db
  .prepare(
    `select *
     from surveyResult
     where verificationStatus = 'VERIFIED_VALID'
       and whatsappNumber is not null
       and trim(whatsappNumber) <> ''
       and trim(storeName) <> ''
       and trim(city) <> ''
       and trim(district) <> ''
       and trim(village) <> ''
       and trim(addressDetail) <> ''
     order by submitTime desc
     limit ?`,
  )
  .all(desiredCount);

if (sources.length < desiredCount) {
  throw new Error(`Butuh ${desiredCount} sumber VERIFIED_VALID, hanya menemukan ${sources.length}.`);
}

const columns = Object.keys(sources[0]);
const insertSql = `insert into surveyResult (${columns.map((column) => `"${column}"`).join(', ')}) values (${columns.map((column) => `@${column}`).join(', ')})`;
const updateSql = `update surveyResult set ${columns
  .filter((column) => column !== 'id' && column !== 'storeCode')
  .map((column) => `"${column}" = @${column}`)
  .join(', ')} where storeCode = @storeCode`;
const insertSurvey = db.prepare(insertSql);
const updateSurvey = db.prepare(updateSql);
const findByStoreCode = db.prepare('select id from surveyResult where storeCode = ?');

const changes = db.transaction(() => {
  const rows = sources.map(cloneForDuplicate);
  for (const row of rows) {
    const existing = findByStoreCode.get(row.storeCode);
    if (existing) {
      updateSurvey.run({ ...row, id: existing.id });
    } else {
      insertSurvey.run(row);
    }
  }
  return rows;
})();

const verification = changes.map((row, index) => ({
  storeCode: row.storeCode,
  storeName: row.storeName,
  duplicateTargetCode: sources[index].storeCode,
  duplicateTargetName: sources[index].storeName,
  duplicateScore: duplicateScore(row, sources[index]),
  verificationStatus: row.verificationStatus,
}));

const belowThreshold = verification.filter((row) => row.duplicateScore < 70);
if (belowThreshold.length) {
  throw new Error(`Ada generated duplicate di bawah 70%: ${JSON.stringify(belowThreshold)}`);
}

console.log(JSON.stringify({ generated: verification.length, rows: verification }, null, 2));
