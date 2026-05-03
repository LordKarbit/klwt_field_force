export const DUPLICATE_WARNING_THRESHOLD = 70;

export type DuplicateMatchKey = 'storeName' | 'whatsappNumber' | 'city' | 'district' | 'village' | 'addressDetail' | 'coordinates';

export type DuplicateMatchRow = {
  id: string;
  storeName: string;
  storeAlias?: string | null;
  storeCode?: string | null;
  province?: string | null;
  city?: string | null;
  district?: string | null;
  village?: string | null;
  addressDetail?: string | null;
  landmark?: string | null;
  whatsappNumber?: string | null;
  contactPersonName?: string | null;
  supplierName?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  verificationStatus?: string | null;
  submitTime?: string | Date | null;
};

export type DuplicateMatchSignal = {
  key: DuplicateMatchKey;
  label: string;
  weight: number;
  matched: boolean;
};

export type DuplicateMatchDetails = {
  score: number;
  percentage: number;
  matchedWeight: number;
  totalWeight: number;
  matchedKeys: DuplicateMatchKey[];
  matches: Record<DuplicateMatchKey, boolean>;
  signals: DuplicateMatchSignal[];
};

const duplicateMatchWeights: Record<DuplicateMatchKey, number> = {
  storeName: 30,
  whatsappNumber: 25,
  city: 10,
  district: 10,
  village: 8,
  addressDetail: 12,
  coordinates: 5,
};

export function normalizeStoreMatch(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(pt|cv|toko|bengkel|motor|auto|parts|sparepart|radiator|cooling|ac|jaya|sumber|sentosa|makmur|prima|mandiri)\b/g, '')
    .trim();
}

function normalizeTextMatch(value: string | null | undefined) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function sameText(left: string | null | undefined, right: string | null | undefined) {
  const normalizedLeft = normalizeTextMatch(left);
  const normalizedRight = normalizeTextMatch(right);
  return Boolean(normalizedLeft && normalizedLeft === normalizedRight);
}

function parseCoordinate(value: string | number | null | undefined) {
  const parsed = Number(String(value ?? '').trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export function coordinateDistanceMeters(source: DuplicateMatchRow, candidate: DuplicateMatchRow) {
  const sourceLat = parseCoordinate(source.latitude);
  const sourceLng = parseCoordinate(source.longitude);
  const candidateLat = parseCoordinate(candidate.latitude);
  const candidateLng = parseCoordinate(candidate.longitude);
  if (sourceLat === null || sourceLng === null || candidateLat === null || candidateLng === null) return null;

  const toRad = (value: number) => (value * Math.PI) / 180;
  const radiusMeters = 6371_000;
  const dLat = toRad(candidateLat - sourceLat);
  const dLng = toRad(candidateLng - sourceLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(sourceLat)) * Math.cos(toRad(candidateLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(radiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function duplicateMatchDetails(source: DuplicateMatchRow, candidate: DuplicateMatchRow): DuplicateMatchDetails {
  const sourceStore = normalizeStoreMatch(source.storeName);
  const candidateStore = normalizeStoreMatch(candidate.storeName);
  const sourceAddress = normalizeTextMatch(source.addressDetail);
  const candidateAddress = normalizeTextMatch(candidate.addressDetail);
  const coordinateDistance = coordinateDistanceMeters(source, candidate);
  const signals: DuplicateMatchSignal[] = [
    {
      key: 'storeName',
      label: 'Nama toko',
      weight: duplicateMatchWeights.storeName,
      matched: Boolean(sourceStore && sourceStore === candidateStore),
    },
    {
      key: 'whatsappNumber',
      label: 'Nomor WhatsApp',
      weight: duplicateMatchWeights.whatsappNumber,
      matched: sameText(source.whatsappNumber, candidate.whatsappNumber),
    },
    {
      key: 'city',
      label: 'Kota',
      weight: duplicateMatchWeights.city,
      matched: sameText(source.city, candidate.city),
    },
    {
      key: 'district',
      label: 'Kecamatan',
      weight: duplicateMatchWeights.district,
      matched: sameText(source.district, candidate.district),
    },
    {
      key: 'village',
      label: 'Kelurahan/desa',
      weight: duplicateMatchWeights.village,
      matched: sameText(source.village, candidate.village),
    },
    {
      key: 'addressDetail',
      label: 'Alamat',
      weight: duplicateMatchWeights.addressDetail,
      matched: Boolean(sourceAddress && candidateAddress && sourceAddress.slice(0, 24) === candidateAddress.slice(0, 24)),
    },
    {
      key: 'coordinates',
      label: 'Koordinat <= 100m',
      weight: duplicateMatchWeights.coordinates,
      matched: coordinateDistance !== null && coordinateDistance <= 100,
    },
  ];
  const totalWeight = signals.reduce((total, signal) => total + signal.weight, 0);
  const matchedWeight = signals.reduce((total, signal) => total + (signal.matched ? signal.weight : 0), 0);
  const percentage = totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0;
  const matches = signals.reduce(
    (result, signal) => {
      result[signal.key] = signal.matched;
      return result;
    },
    {} as Record<DuplicateMatchKey, boolean>,
  );

  return {
    score: percentage,
    percentage,
    matchedWeight,
    totalWeight,
    matchedKeys: signals.filter((signal) => signal.matched).map((signal) => signal.key),
    matches,
    signals,
  };
}

export function duplicateCandidateScore(source: DuplicateMatchRow, candidate: DuplicateMatchRow) {
  return duplicateMatchDetails(source, candidate).percentage;
}

export function duplicateCandidateSearchText(row: DuplicateMatchRow) {
  return [
    row.storeName,
    row.storeAlias,
    row.storeCode,
    row.province,
    row.city,
    row.district,
    row.village,
    row.addressDetail,
    row.landmark,
    row.whatsappNumber,
    row.contactPersonName,
    row.supplierName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function submittedAt(row: DuplicateMatchRow) {
  const timestamp = new Date(row.submitTime ?? 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function topDuplicateCandidates<T extends DuplicateMatchRow>(rows: T[], selected: T | undefined, search = '', limit = 10) {
  if (!selected) return [];
  const query = search.trim().toLowerCase();

  return rows
    .filter((row) => row.id !== selected.id && row.verificationStatus === 'VERIFIED_VALID')
    .map((row) => ({ row, score: duplicateCandidateScore(selected, row) }))
    .filter(({ score }) => score >= 25)
    .filter(({ row }) => !query || duplicateCandidateSearchText(row).includes(query))
    .sort((left, right) => {
      const scoreGap = right.score - left.score;
      if (scoreGap) return scoreGap;
      const cityGap = Number(right.row.city === selected.city) - Number(left.row.city === selected.city);
      if (cityGap) return cityGap;
      return submittedAt(right.row) - submittedAt(left.row);
    })
    .slice(0, limit);
}
