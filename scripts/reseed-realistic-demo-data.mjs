import fs from 'node:fs/promises';
import path from 'node:path';
import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';

const apply = process.argv.includes('--apply');
const dryRun = !apply || process.argv.includes('--dry-run');
const dbPath = path.resolve('data/klwt-surveyor.sqlite');
const backupDir = path.resolve('data/backups');
const tinyPngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';

const campaignStartMs = new Date('2026-04-20T00:00:00+07:00').getTime();
const msDay = 86_400_000;
const dailySubmitCounts = [10, 12, 14, 13, 16, 15, 18, 16, 20, 17, 19, 18, 12];

function createSeededRandom(seed = 20260502) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const random = createSeededRandom();

function pick(items) {
  if (!items.length) throw new Error('Cannot pick from empty list');
  return items[Math.floor(random() * items.length)];
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function repeat(value, count) {
  return Array.from({ length: count }, () => value);
}

function weightedPick(options) {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let cursor = random() * total;
  for (const option of options) {
    cursor -= option.weight;
    if (cursor <= 0) return option.value;
  }
  return options[options.length - 1].value;
}

function dateAt(dayOffset, hour = 9, minute = 0) {
  return campaignStartMs + dayOffset * msDay + hour * 3_600_000 + minute * 60_000;
}

function json(value) {
  return JSON.stringify(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function grade(score) {
  if (score >= 86) return 'A+';
  if (score >= 78) return 'A';
  if (score >= 68) return 'B';
  if (score >= 58) return 'C';
  return 'D';
}

function dataGrade(score) {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
}

function leadClass(score, hasWa, openToSupplier, outcome) {
  if (outcome !== 'Survey Completed') return 'Low Lead';
  if (score >= 86 && hasWa && openToSupplier) return 'Hot Lead';
  if (score >= 77 && openToSupplier) return 'Qualified Lead';
  if (score >= 70) return 'Strategic Lead';
  return 'Normal Lead';
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function profileName(profile) {
  return normalizeText(profile.name || profile.username || profile.id);
}

function selectAll(db, sql, params = []) {
  return db.prepare(sql).all(params);
}

function loadLocationPools(db) {
  const allJava = selectAll(db, 'select province, city, district, village from location');
  const dki = selectAll(
    db,
    "select province, city, district, village from location where province = 'DKI Jakarta' and city not like '%Kepulauan%'",
  );
  const surabaya = selectAll(
    db,
    "select province, city, district, village from location where province = 'Jawa Timur' and city in ('Kota Surabaya', 'Surabaya')",
  );
  const jatim = selectAll(
    db,
    "select province, city, district, village from location where province = 'Jawa Timur' and city in ('Sidoarjo', 'Gresik', 'Malang', 'Mojokerto', 'Pasuruan')",
  );
  const otherWest = selectAll(
    db,
    "select province, city, district, village from location where province in ('Banten', 'Jawa Barat') and city not like '%Kepulauan%'",
  );
  const otherEast = selectAll(
    db,
    "select province, city, district, village from location where province in ('Jawa Tengah', 'Daerah Istimewa Yogyakarta')",
  );

  return {
    allJava,
    dki: dki.length ? dki : allJava,
    surabaya: surabaya.length ? surabaya : allJava,
    jatim: jatim.length ? jatim : allJava,
    otherWest: otherWest.length ? otherWest : allJava,
    otherEast: otherEast.length ? otherEast : allJava,
  };
}

function locationForBucket(pools, bucket) {
  if (bucket === 'dki') return pick(pools.dki);
  if (bucket === 'surabaya') return pick(pools.surabaya);
  if (bucket === 'jatim') return pick(pools.jatim);
  if (bucket === 'otherWest') return pick(pools.otherWest);
  if (bucket === 'otherEast') return pick(pools.otherEast);
  return pick(pools.allJava);
}

function baseCoordinate(location) {
  const city = location.city.toLowerCase();
  if (city.includes('jakarta barat')) return { lat: -6.171, lng: 106.759 };
  if (city.includes('jakarta pusat')) return { lat: -6.185, lng: 106.827 };
  if (city.includes('jakarta selatan')) return { lat: -6.261, lng: 106.810 };
  if (city.includes('jakarta timur')) return { lat: -6.226, lng: 106.900 };
  if (city.includes('jakarta utara')) return { lat: -6.133, lng: 106.863 };
  if (city.includes('surabaya')) return { lat: -7.257, lng: 112.752 };
  if (city.includes('sidoarjo')) return { lat: -7.447, lng: 112.718 };
  if (city.includes('gresik')) return { lat: -7.164, lng: 112.656 };
  if (city.includes('malang')) return { lat: -7.982, lng: 112.630 };
  if (city.includes('mojokerto')) return { lat: -7.470, lng: 112.440 };
  if (city.includes('pasuruan')) return { lat: -7.646, lng: 112.907 };
  if (location.province === 'Banten') return { lat: -6.120, lng: 106.150 };
  if (location.province === 'Jawa Barat') return { lat: -6.914, lng: 107.609 };
  if (location.province === 'Jawa Tengah') return { lat: -7.005, lng: 110.438 };
  if (location.province === 'Daerah Istimewa Yogyakarta') return { lat: -7.795, lng: 110.369 };
  return { lat: -7.25, lng: 112.75 };
}

function coordinateFor(location, wideJitter = false) {
  const base = baseCoordinate(location);
  const jitter = wideJitter ? 0.036 : 0.014;
  return {
    latitude: (base.lat + (random() - 0.5) * jitter).toFixed(6),
    longitude: (base.lng + (random() - 0.5) * jitter).toFixed(6),
  };
}

const storePrefixes = [
  'Prima Radiator',
  'Surya Cooling',
  'Berkah AC Mobil',
  'Mandiri Sparepart',
  'Sinar Jaya Radiator',
  'Mitra Cooling Parts',
  'Sentosa Auto Cool',
  'Karya Teknik Radiator',
  'Nusantara AC Mobil',
  'Central Onderdil Cooling',
];

const landmarks = [
  'dekat pasar utama',
  'seberang minimarket',
  'samping bengkel ban',
  'ruko deret otomotif',
  'belakang SPBU',
  'akses jalan kolektor',
  'dekat terminal kecil',
  'kompleks sentra sparepart',
];

const contactNames = [
  'Budi Santoso',
  'Agus Firmansyah',
  'Rina Wulandari',
  'Hendra Gunawan',
  'Sari Lestari',
  'Dedi Kurniawan',
  'Maya Oktaviani',
  'Taufik Hidayat',
  'Eko Prabowo',
  'Nuraini Safitri',
];

function makeStoreName(location, index) {
  const area = normalizeText(location.district || location.village || location.city).replace(/^Kecamatan\s+/i, '');
  return `${pick(storePrefixes)} ${area} ${String(index + 1).padStart(2, '0')}`;
}

function addressFor(location) {
  const roadNumber = 8 + Math.floor(random() * 180);
  const road = weightedPick([
    { value: 'Jl. Raya', weight: 4 },
    { value: 'Jl. Industri', weight: 2 },
    { value: 'Jl. Sentra Onderdil', weight: 2 },
    { value: 'Jl. Pasar Mobil', weight: 1 },
  ]);
  return `${road} ${normalizeText(location.village)}, No. ${roadNumber}`;
}

function pickSurveyorForTeam(teamSurveyors, totals) {
  const sorted = [...teamSurveyors].sort((left, right) => {
    const totalGap = (totals.get(left.id) ?? 0) - (totals.get(right.id) ?? 0);
    if (totalGap) return totalGap;
    return profileName(left).localeCompare(profileName(right));
  });
  return sorted[0];
}

function buildTeamData(db) {
  const profiles = selectAll(
    db,
    `select up.id, up.authUserId, u.name, up.username, up.role, up.managerId, up.area
     from userProfile up
     join user u on u.id = up.authUserId
     where up.status = 'Active'`,
  );
  const managers = new Map(profiles.filter((row) => row.role === 'Manager').map((row) => [row.id, row]));
  const surveyors = profiles.filter((row) => row.role === 'Surveyor');
  const westSurveyors = surveyors.filter((row) => row.area.includes('DKI') || managers.get(row.managerId)?.area.includes('DKI'));
  const eastSurveyors = surveyors.filter((row) => row.area.includes('Jawa Timur') || managers.get(row.managerId)?.area.includes('Jawa Timur'));
  const verificators = profiles.filter((row) => row.role === 'Verificator');
  const admins = profiles.filter((row) => row.role === 'Administrator');
  const heads = profiles.filter((row) => row.role === 'Head');

  if (!westSurveyors.length || !eastSurveyors.length || !verificators.length) {
    throw new Error('Required active surveyor/verificator profiles were not found.');
  }

  return { profiles, managers, westSurveyors, eastSurveyors, verificators, admins, heads };
}

function managerForSurveyor(team, surveyor) {
  const manager = team.managers.get(surveyor.managerId);
  return manager ?? surveyor;
}

function buildStatusQueue() {
  return shuffle([
    ...repeat('VERIFIED_VALID', 118),
    ...repeat('WAITING_VERIFICATION', 36),
    ...repeat('WAITING_VERIFICATION_WARNING', 22),
    ...repeat('NEED_REVISION', 16),
    ...repeat('REJECTED_INVALID', 5),
    ...repeat('MERGED_DUPLICATE', 3),
  ]);
}

function buildSurveyBuckets() {
  return shuffle([
    ...repeat('dki', 108),
    ...repeat('surabaya', 54),
    ...repeat('jatim', 14),
    ...repeat('otherWest', 12),
    ...repeat('otherEast', 12),
  ]);
}

function buildDaySlots() {
  return dailySubmitCounts.flatMap((count, dayIndex) => repeat(dayIndex, count));
}

function makeOptions(index, outcome) {
  const vehicleSpecialization = shuffle([
    'Mobil penumpang',
    'LCGC/MPV',
    'Pick-up ringan',
    'Fleet komersial',
    'Truk ringan',
  ]).slice(0, 1 + Math.floor(random() * 2));
  const coolingProducts = shuffle(['Radiator', 'Kondensor', 'Evaporator', 'Extra fan', 'Compressor', 'Coolant']).slice(0, 2 + Math.floor(random() * 3));
  const coolingBrands = shuffle(['Denso', 'Sanden', 'ND', 'Valeo', 'Local import', 'OEM copotan', 'Aftermarket China']).slice(0, 2 + Math.floor(random() * 3));
  const supplierType = shuffle(['Distributor lokal', 'Sales kanvas', 'Marketplace B2B', 'Toko grosir', 'Importir langsung']).slice(0, 1 + Math.floor(random() * 2));
  const currentOrderMethod = shuffle(['WhatsApp sales', 'Telepon', 'Kunjungan sales', 'Marketplace', 'Datang ke grosir']).slice(0, 1 + Math.floor(random() * 2));
  const mainPurchaseDriver = shuffle(['Harga', 'Ketersediaan stok', 'Kecepatan kirim', 'Garansi tukar', 'Kualitas stabil']).slice(0, 2);
  const reasonToTryNewSupplier = shuffle(['Harga lebih kompetitif', 'Stok lebih lengkap', 'Tempo pembayaran', 'Garansi mudah', 'Pengiriman cepat']).slice(0, 2);
  const completed = outcome === 'Survey Completed';

  return {
    vehicleSpecialization,
    coolingProducts,
    coolingBrands,
    supplierType,
    currentOrderMethod,
    mainPurchaseDriver,
    reasonToTryNewSupplier,
    storeScale: completed ? weightedPick([{ value: 'Kecil', weight: 2 }, { value: 'Menengah', weight: 5 }, { value: 'Besar', weight: 2 }]) : 'Belum terverifikasi',
    coolingShelfSize: completed ? weightedPick([{ value: 'Tidak terlihat', weight: 1 }, { value: 'Kecil', weight: 2 }, { value: 'Sedang', weight: 5 }, { value: 'Besar', weight: 2 }]) : 'Tidak terlihat',
    coolingSalesActivity: completed ? weightedPick([{ value: 'Lambat', weight: 1 }, { value: 'Reguler', weight: 5 }, { value: 'Cepat', weight: 3 }]) : 'Tidak diketahui',
    productSellingSegment: completed ? weightedPick([{ value: 'Retail bengkel', weight: 5 }, { value: 'Fleet kecil', weight: 2 }, { value: 'Reseller', weight: 2 }]) : 'Tidak diketahui',
    lowCostImportShare: completed ? weightedPick([{ value: 'Rendah', weight: 2 }, { value: 'Sedang', weight: 4 }, { value: 'Tinggi', weight: 3 }, { value: 'Campuran', weight: 2 }]) : 'Tidak diketahui',
    supplierName: completed ? pick(['CV Sumber Makmur', 'PT Jaya Cooling', 'Agen Denso Lokal', 'Grosir Kenari', 'Sentra Onderdil Surabaya', 'Importir Mangga Dua']) : 'Tidak disebutkan',
    supplierDependency: completed ? weightedPick([{ value: 'Rendah', weight: 2 }, { value: 'Sedang', weight: 5 }, { value: 'Tinggi', weight: 3 }]) : 'Tidak diketahui',
    supplierSatisfaction: completed ? weightedPick([{ value: 'Puas', weight: 4 }, { value: 'Cukup puas', weight: 4 }, { value: 'Kurang puas', weight: 2 }, { value: 'Sedang cari alternatif', weight: 2 }]) : 'Tidak diketahui',
    returnEase: completed ? weightedPick([{ value: 'Mudah', weight: 4 }, { value: 'Sedang', weight: 4 }, { value: 'Sulit', weight: 2 }]) : 'Tidak diketahui',
    deliverySpeed: completed ? weightedPick([{ value: 'Same day', weight: 2 }, { value: '1 hari', weight: 4 }, { value: '2-3 hari', weight: 3 }, { value: '>3 hari', weight: 1 }]) : 'Tidak diketahui',
    paymentMethod: completed ? weightedPick([{ value: 'Cash', weight: 3 }, { value: 'Transfer', weight: 5 }, { value: 'Tempo 7 hari', weight: 2 }, { value: 'Tempo 14 hari', weight: 1 }]) : 'Tidak diketahui',
    restockFrequency: completed ? weightedPick([{ value: 'Mingguan', weight: 4 }, { value: '2 mingguan', weight: 4 }, { value: 'Bulanan', weight: 2 }]) : 'Tidak diketahui',
    purchaseSizeRange: completed ? weightedPick([{ value: '1-3 pcs', weight: 3 }, { value: '4-10 pcs', weight: 5 }, { value: '>10 pcs', weight: 2 }]) : 'Tidak diketahui',
    monthlyPurchaseValue: completed ? weightedPick([{ value: '<5 juta', weight: 2 }, { value: '5-15 juta', weight: 5 }, { value: '15-30 juta', weight: 3 }, { value: '>30 juta', weight: 1 }]) : 'Tidak diketahui',
    marginExpectation: completed ? weightedPick([{ value: '<10%', weight: 1 }, { value: '10-20%', weight: 5 }, { value: '20-30%', weight: 3 }, { value: '>30%', weight: 1 }]) : 'Tidak diketahui',
    priceSensitivity: completed ? weightedPick([{ value: 'Rendah', weight: 2 }, { value: 'Sedang', weight: 5 }, { value: 'Tinggi', weight: 3 }]) : 'Tidak diketahui',
    opennessToNewSupplier: completed ? weightedPick([{ value: 'Terbuka', weight: 5 }, { value: 'Netral', weight: 3 }, { value: 'Tidak terbuka', weight: 2 }]) : 'Tidak diketahui',
    willingnessToReceiveFollowUp: completed ? weightedPick([{ value: 'Ya', weight: 7 }, { value: 'Mungkin', weight: 2 }, { value: 'Tidak', weight: 1 }]) : 'Tidak',
    purchasingDecisionMaker: completed ? weightedPick([{ value: 'Owner', weight: 6 }, { value: 'Kepala toko', weight: 3 }, { value: 'Purchasing', weight: 1 }]) : 'Tidak ditemui',
    decisionMakerAvailability: completed ? weightedPick([{ value: 'Ditemui langsung', weight: 6 }, { value: 'Via staf', weight: 3 }, { value: 'Tidak ditemui', weight: 1 }]) : 'Tidak ditemui',
    businessType: completed ? weightedPick([{ value: 'Toko sparepart', weight: 5 }, { value: 'Bengkel AC mobil', weight: 3 }, { value: 'Toko radiator', weight: 2 }, { value: 'Workshop fleet', weight: 1 }]) : 'Belum diketahui',
    picType: completed ? weightedPick([{ value: 'Owner', weight: 6 }, { value: 'Karyawan', weight: 4 }]) : 'Karyawan',
    contactPersonName: completed ? pick(contactNames) : 'Tidak disebutkan',
    storeAlias: index % 5 === 0 ? `Cabang ${String.fromCharCode(65 + (index % 4))}` : null,
  };
}

function scoreSurvey(options, warningFlags, outcome, hasWa) {
  if (outcome !== 'Survey Completed') {
    const quality = clamp(70 - warningFlags.length * 8, 42, 76);
    return {
      merchantPotentialScore: 45 + Math.floor(random() * 18),
      merchantGrade: 'C',
      dataQualityScore: quality,
      dataQualityGrade: dataGrade(quality),
      leadClassification: 'Low Lead',
    };
  }

  let merchant = 58 + Math.floor(random() * 30);
  if (options.storeScale === 'Besar') merchant += 8;
  if (options.coolingSalesActivity === 'Cepat') merchant += 7;
  if (options.monthlyPurchaseValue === '>30 juta') merchant += 8;
  if (options.monthlyPurchaseValue === '15-30 juta') merchant += 5;
  if (options.opennessToNewSupplier === 'Terbuka') merchant += 5;
  if (options.supplierSatisfaction === 'Kurang puas' || options.supplierSatisfaction === 'Sedang cari alternatif') merchant += 4;
  merchant = clamp(merchant, 42, 99);

  let quality = 93 - warningFlags.length * 7;
  if (!hasWa) quality -= 8;
  if (options.decisionMakerAvailability === 'Tidak ditemui') quality -= 6;
  quality = clamp(quality, 36, 98);

  return {
    merchantPotentialScore: merchant,
    merchantGrade: grade(merchant),
    dataQualityScore: quality,
    dataQualityGrade: dataGrade(quality),
    leadClassification: leadClass(merchant, hasWa, options.opennessToNewSupplier === 'Terbuka', outcome),
  };
}

function makePhotoRows(row, evidenceIds, capturedAt) {
  return evidenceIds
    .filter((item) => item.id)
    .map((item) => ({
      id: item.id,
      surveyId: row.id,
      uploadedBy: row.surveyorId,
      photoType: item.type,
      filename: `${item.id}.png`,
      mimeType: 'image/png',
      dataBase64: tinyPngBase64,
      capturedAt,
      createdAt: capturedAt,
    }));
}

function buildSurveys(team, pools) {
  const buckets = buildSurveyBuckets();
  const statuses = buildStatusQueue();
  const daySlots = buildDaySlots();
  const totals = new Map();
  const surveys = [];
  const photoRows = [];

  for (let index = 0; index < buckets.length; index += 1) {
    const bucket = buckets[index];
    const dayOffset = daySlots[index];
    const teamSurveyors = bucket === 'dki' || bucket === 'otherWest' ? team.westSurveyors : team.eastSurveyors;
    const surveyor = pickSurveyorForTeam(teamSurveyors, totals);
    totals.set(surveyor.id, (totals.get(surveyor.id) ?? 0) + 1);
    const manager = managerForSurveyor(team, surveyor);
    const location = locationForBucket(pools, bucket);
    const outcome = weightedPick([
      { value: 'Survey Completed', weight: 92 },
      { value: 'Store Closed', weight: 3 },
      { value: 'Address Not Found', weight: 2 },
      { value: 'Refused', weight: 2 },
      { value: 'Need Revisit', weight: 1 },
    ]);
    const completed = outcome === 'Survey Completed';
    const coords = coordinateFor(location, false);
    const options = makeOptions(index, outcome);
    const hasWa = completed && random() > 0.12;
    const verifierWhatsappReachable = hasWa ? random() > 0.09 : false;
    const verifierPhoneCallable = hasWa ? random() > 0.16 : false;
    const followUpWaAvailable = hasWa && verifierWhatsappReachable;
    const missingInterior = completed && random() < 0.09;
    const missingPic = completed && random() < 0.07;
    const gpsWarningFlag = random() < 0.09;
    const warningFlags = [
      gpsWarningFlag ? 'GPS_WARNING_GT_100M' : null,
      !completed ? 'VISIT_NOT_COMPLETED' : null,
      completed && !hasWa ? 'WA_EMPTY_WITH_REASON' : null,
      completed && hasWa && !verifierWhatsappReachable ? 'VERIFIER_WA_UNREACHABLE' : null,
      completed && hasWa && !verifierPhoneCallable ? 'VERIFIER_PHONE_UNREACHABLE' : null,
      missingInterior ? 'MISSING_INTERIOR_PHOTO' : null,
      missingPic ? 'MISSING_PIC_PHOTO' : null,
    ].filter(Boolean);
    const score = scoreSurvey(options, warningFlags, outcome, followUpWaAvailable);
    const submitTime = dateAt(dayOffset, 10 + (index % 7), (index * 7) % 60);
    const visitStartTime = submitTime - (18 + Math.floor(random() * 42)) * 60_000;
    const status = statuses[index];
    const verified = ['VERIFIED_VALID', 'REJECTED_INVALID', 'MERGED_DUPLICATE'].includes(status);
    const revision = status === 'NEED_REVISION';
    const verifiedAt = verified ? submitTime + (2 + Math.floor(random() * 22)) * 3_600_000 : null;
    const surveyId = `SURV-${String(index + 1).padStart(4, '0')}-${nanoid(5)}`;
    const storeCode = `KLWT-SV-2026-${String(index + 1).padStart(4, '0')}`;
    const storefrontId = completed ? `EVD-FRONT-${String(index + 1).padStart(4, '0')}` : null;
    const interiorId = completed && !missingInterior ? `EVD-RACK-${String(index + 1).padStart(4, '0')}` : null;
    const picId = completed && !missingPic ? `EVD-PIC-${String(index + 1).padStart(4, '0')}` : null;
    const row = {
      id: surveyId,
      assignmentId: index < 160 ? `ASG-SUB-${String(index + 1).padStart(4, '0')}` : null,
      storeCode,
      candidateStoreStatus:
        status === 'VERIFIED_VALID' ? 'VERIFIED_MASTER_STORE' : status === 'REJECTED_INVALID' ? 'REJECTED_STORE' : status === 'MERGED_DUPLICATE' ? 'MERGED_DUPLICATE' : 'CANDIDATE_STORE',
      storeName: makeStoreName(location, index),
      storeAlias: options.storeAlias,
      visitOutcome: outcome,
      plannedOrUnplanned: index < 170 ? 'PLANNED' : 'UNPLANNED',
      province: location.province,
      city: location.city,
      district: location.district,
      village: location.village,
      addressDetail: addressFor(location),
      landmark: pick(landmarks),
      latitude: coords.latitude,
      longitude: coords.longitude,
      gpsAccuracy: gpsWarningFlag ? 38 + Math.floor(random() * 44) : 6 + Math.floor(random() * 22),
      gpsWarningFlag: gpsWarningFlag ? 1 : 0,
      gpsDistanceFromTarget: gpsWarningFlag ? 130 + Math.floor(random() * 360) : Math.floor(random() * 85),
      contactPersonName: options.contactPersonName,
      picType: options.picType,
      whatsappNumber: hasWa ? `08${String(1200000000 + index * 977 + Math.floor(random() * 9000)).slice(0, 10)}` : null,
      waEmptyReason: hasWa ? null : completed ? 'PIC meminta follow-up lewat telepon toko' : 'Kunjungan belum selesai',
      purchasingDecisionMaker: options.purchasingDecisionMaker,
      decisionMakerAvailability: options.decisionMakerAvailability,
      businessType: options.businessType,
      vehicleSpecialization: json(options.vehicleSpecialization),
      storeScale: options.storeScale,
      coolingProducts: json(options.coolingProducts),
      coolingShelfSize: options.coolingShelfSize,
      coolingSalesActivity: options.coolingSalesActivity,
      coolingBrands: json(options.coolingBrands),
      productSellingSegment: options.productSellingSegment,
      lowCostImportShare: options.lowCostImportShare,
      supplierType: json(options.supplierType),
      supplierName: options.supplierName,
      supplierDependency: options.supplierDependency,
      supplierSatisfaction: options.supplierSatisfaction,
      returnEase: options.returnEase,
      deliverySpeed: options.deliverySpeed,
      paymentMethod: options.paymentMethod,
      restockFrequency: options.restockFrequency,
      purchaseSizeRange: options.purchaseSizeRange,
      monthlyPurchaseValue: options.monthlyPurchaseValue,
      marginExpectation: options.marginExpectation,
      currentOrderMethod: json(options.currentOrderMethod),
      mainPurchaseDriver: json(options.mainPurchaseDriver),
      priceSensitivity: options.priceSensitivity,
      opennessToNewSupplier: options.opennessToNewSupplier,
      reasonToTryNewSupplier: json(options.reasonToTryNewSupplier),
      willingnessToReceiveFollowUp: options.willingnessToReceiveFollowUp,
      storefrontPhotoUrl: storefrontId ? `/api/evidence/${storefrontId}` : '',
      interiorPhotoUrl: interiorId ? `/api/evidence/${interiorId}` : '',
      picPhotoUrl: picId ? `/api/evidence/${picId}` : '',
      photoMissingReason: warningFlags.some((flag) => flag.includes('MISSING')) ? 'Toko sedang ramai | Owner/PIC menolak foto orang' : !completed ? 'Kunjungan belum selesai' : null,
      surveyorNotes: completed
        ? `PIC menyebut kebutuhan fast moving ${pick(options.coolingProducts).toLowerCase()} dan ingin pembanding harga untuk supplier berikutnya.`
        : `Outcome ${outcome}; perlu tindak lanjut sesuai instruksi manager area.`,
      warningFlags: json(warningFlags),
      merchantPotentialScore: score.merchantPotentialScore,
      merchantGrade: score.merchantGrade,
      dataQualityScore: score.dataQualityScore,
      dataQualityGrade: score.dataQualityGrade,
      leadClassification: score.leadClassification,
      verificationStatus: status,
      verifierPhoneCallable,
      verifierWhatsappReachable,
      verifierContactCheckedAt: verifiedAt ?? submitTime + (18 + Math.floor(random() * 42)) * 60_000,
      verificatorId: verified || revision ? team.verificators[0].id : null,
      verificationNotes: verified ? 'Data lengkap dan konsisten untuk baseline outlet.' : status === 'REJECTED_INVALID' ? 'Alamat atau profil toko tidak memenuhi kriteria.' : null,
      revisionRequest: revision ? 'Lengkapi foto PIC/interior dan konfirmasi ulang nomor WhatsApp pemilik.' : null,
      surveyorId: surveyor.id,
      surveyorName: profileName(surveyor),
      managerId: manager.id,
      managerName: profileName(manager),
      visitDate: visitStartTime,
      visitStartTime,
      submitTime,
      verifiedAt: revision ? null : verifiedAt,
      createdAt: submitTime,
      updatedAt: verifiedAt ?? submitTime,
    };

    surveys.push(row);
    photoRows.push(...makePhotoRows(row, [
      { id: storefrontId, type: 'storefront' },
      { id: interiorId, type: 'interior' },
      { id: picId, type: 'pic' },
    ], submitTime));
  }

  applyDuplicateFixtures(surveys);
  return { surveys, photoRows };
}

function copyDuplicateFields(source, target) {
  source.storeName = target.storeName;
  source.storeAlias = target.storeAlias;
  source.province = target.province;
  source.city = target.city;
  source.district = target.district;
  source.village = target.village;
  source.addressDetail = target.addressDetail;
  source.landmark = target.landmark;
  source.latitude = target.latitude;
  source.longitude = target.longitude;
  source.whatsappNumber = target.whatsappNumber;
  source.waEmptyReason = null;
  source.candidateStoreStatus = 'DUPLICATE_CANDIDATE';
  source.verificationStatus = 'WAITING_VERIFICATION_WARNING';
  const flags = new Set(JSON.parse(source.warningFlags));
  source.warningFlags = json(Array.from(flags));
}

function applyDuplicateFixtures(surveys) {
  const verified = surveys.filter((row) => row.verificationStatus === 'VERIFIED_VALID' && row.whatsappNumber);
  const pending = surveys.filter((row) => ['WAITING_VERIFICATION', 'WAITING_VERIFICATION_WARNING'].includes(row.verificationStatus));
  const pairs = Math.min(6, verified.length, pending.length);
  for (let index = 0; index < pairs; index += 1) {
    copyDuplicateFields(pending[index], verified[index]);
  }
}

function assignmentFromSurvey(row) {
  if (!row.assignmentId) return null;
  return {
    id: row.assignmentId,
    storeName: row.storeName,
    province: row.province,
    city: row.city,
    district: row.district,
    village: row.village,
    addressDetail: row.addressDetail,
    landmark: row.landmark,
    latitude: row.latitude,
    longitude: row.longitude,
    assignedManagerId: row.managerId,
    assignedManagerName: row.managerName,
    assignedSurveyorId: row.surveyorId,
    assignedSurveyorName: row.surveyorName,
    visitDate: row.visitStartTime,
    priority: row.leadClassification === 'Hot Lead' || row.gpsWarningFlag ? 'High' : row.dataQualityScore < 65 ? 'Medium' : 'Low',
    visitObjective: row.leadClassification === 'Hot Lead' ? 'Hot lead qualification' : 'PRD v2 outlet survey',
    plannedOrUnplanned: row.plannedOrUnplanned,
    status: 'SUBMITTED',
    notes: 'Auto-generated submitted visit from realistic demo dataset.',
    createdAt: row.createdAt - 24 * 3_600_000,
    updatedAt: row.updatedAt,
  };
}

function buildFutureAssignments(team, pools, submittedAssignments) {
  const assignments = [...submittedAssignments];
  const targetCount = 480;
  const surveyors = [...team.westSurveyors, ...team.eastSurveyors].sort((left, right) => profileName(left).localeCompare(profileName(right)));
  let sequence = 1;

  while (assignments.length < targetCount) {
    const surveyor = surveyors[sequence % surveyors.length];
    const manager = managerForSurveyor(team, surveyor);
    const bucket = weightedPick([
      { value: 'dki', weight: 44 },
      { value: 'surabaya', weight: 28 },
      { value: 'jatim', weight: 9 },
      { value: 'otherWest', weight: 10 },
      { value: 'otherEast', weight: 9 },
    ]);
    const location = locationForBucket(pools, bucket);
    const coords = coordinateFor(location, false);
    const dayOffset = 12 + Math.floor((assignments.length - submittedAssignments.length) / surveyors.length);
    const idNumber = assignments.length - submittedAssignments.length + 1;
    const status = weightedPick([
      { value: 'READY', weight: 72 },
      { value: 'IN_PROGRESS', weight: 8 },
      { value: 'REVISIT', weight: 10 },
      { value: 'NO_GPS_YET', weight: 5 },
      { value: 'DRAFT', weight: 5 },
    ]);

    assignments.push({
      id: `ASG-PLAN-${String(idNumber).padStart(4, '0')}`,
      storeName: makeStoreName(location, 500 + idNumber),
      province: location.province,
      city: location.city,
      district: location.district,
      village: location.village,
      addressDetail: addressFor(location),
      landmark: pick(landmarks),
      latitude: coords.latitude,
      longitude: coords.longitude,
      assignedManagerId: manager.id,
      assignedManagerName: profileName(manager),
      assignedSurveyorId: surveyor.id,
      assignedSurveyorName: profileName(surveyor),
      visitDate: dateAt(dayOffset, 8 + (sequence % 9), (sequence * 11) % 60),
      priority: weightedPick([{ value: 'High', weight: 18 }, { value: 'Medium', weight: 50 }, { value: 'Low', weight: 32 }]),
      visitObjective: weightedPick([
        { value: 'Coverage expansion', weight: 36 },
        { value: 'Cooling category audit', weight: 26 },
        { value: 'Hot lead follow-up', weight: 18 },
        { value: 'Revisit missing evidence', weight: 12 },
        { value: 'PRD v2 outlet qualification', weight: 8 },
      ]),
      plannedOrUnplanned: 'PLANNED',
      status,
      notes: status === 'REVISIT' ? 'Follow-up evidence atau PIC belum lengkap.' : 'Rute disusun berdasarkan clustering kecamatan dan target coverage.',
      createdAt: dateAt(10, 18, 0),
      updatedAt: dateAt(11, 9, sequence % 60),
    });
    sequence += 1;
  }

  return assignments;
}

function buildExportJobs(team, surveys) {
  const admin = team.admins[0] ?? team.heads[0] ?? team.verificators[0];
  const verified = surveys.filter((row) => row.verificationStatus === 'VERIFIED_VALID').length;
  const hotQualified = surveys.filter((row) => ['Hot Lead', 'Qualified Lead'].includes(row.leadClassification)).length;
  const photoLinks = surveys.filter((row) => row.storefrontPhotoUrl || row.interiorPhotoUrl || row.picPhotoUrl).length;
  const createdBy = admin?.id ?? 'system';
  const now = dateAt(12, 17, 20);
  return [
    { id: 'EXP-DEMO-001', name: 'Verified Store Database - Demo Realistis', kind: 'verified-store-database', scope: 'National', status: 'COMPLETED', ownerRole: 'Head', rowCount: verified, createdBy, createdAt: now - 4 * 3_600_000, completedAt: now - 4 * 3_600_000 + 90_000 },
    { id: 'EXP-DEMO-002', name: 'Hot & Qualified Leads DKI-Jatim', kind: 'hot-qualified-leads', scope: 'DKI Jakarta, Jawa Timur', status: 'COMPLETED', ownerRole: 'Manager', rowCount: hotQualified, createdBy, createdAt: now - 3 * 3_600_000, completedAt: now - 3 * 3_600_000 + 120_000 },
    { id: 'EXP-DEMO-003', name: 'Supplier Brand Intelligence', kind: 'supplier-brand-intelligence', scope: 'National', status: 'COMPLETED', ownerRole: 'Head', rowCount: surveys.length, createdBy, createdAt: now - 2 * 3_600_000, completedAt: now - 2 * 3_600_000 + 150_000 },
    { id: 'EXP-DEMO-004', name: 'Photo Evidence Links', kind: 'photo-evidence-links', scope: 'All submitted visits', status: 'COMPLETED', ownerRole: 'Verificator', rowCount: photoLinks, createdBy, createdAt: now - 90 * 60_000, completedAt: now - 88 * 60_000 },
    { id: 'EXP-DEMO-005', name: 'Surveyor Performance Snapshot', kind: 'surveyor-performance', scope: 'Campaign Apr-May 2026', status: 'COMPLETED', ownerRole: 'Manager', rowCount: new Set(surveys.map((row) => row.surveyorId)).size, createdBy, createdAt: now - 35 * 60_000, completedAt: now - 33 * 60_000 },
  ];
}

function notificationRow(recipientUserId, payload, createdAt, read = false) {
  return {
    id: nanoid(),
    recipientUserId,
    type: payload.type,
    severity: payload.severity,
    title: payload.title,
    body: payload.body,
    entityType: payload.entityType,
    entityId: payload.entityId,
    actionView: payload.actionView,
    metadata: json(payload.metadata ?? {}),
    readAt: read ? createdAt + 25 * 60_000 : null,
    createdAt,
  };
}

function buildNotifications(team, surveys, assignments) {
  const rows = [];
  const verificatorRecipients = [...team.verificators, ...team.admins].map((row) => row.id);
  const openSurveys = surveys
    .filter((row) => ['WAITING_VERIFICATION', 'WAITING_VERIFICATION_WARNING'].includes(row.verificationStatus))
    .sort((left, right) => right.submitTime - left.submitTime)
    .slice(0, 24);
  for (const survey of openSurveys) {
    for (const recipient of verificatorRecipients) {
      rows.push(
        notificationRow(
          recipient,
          {
            type: 'survey_submitted',
            severity: survey.warningFlags === '[]' ? 'info' : 'warning',
            title: 'Survey baru menunggu verifikasi',
            body: `${survey.storeName} dikirim oleh ${survey.surveyorName}.`,
            entityType: 'surveyResult',
            entityId: survey.id,
            actionView: 'verification',
            metadata: { storeName: survey.storeName, surveyorName: survey.surveyorName, verificationStatus: survey.verificationStatus },
          },
          survey.submitTime + 3 * 60_000,
          random() < 0.35,
        ),
      );
    }
  }

  for (const survey of surveys.filter((row) => row.verificationStatus === 'NEED_REVISION').slice(0, 12)) {
    rows.push(
      notificationRow(
        survey.surveyorId,
        {
          type: 'verification_decision',
          severity: 'warning',
          title: 'Survey perlu revisi',
          body: `${survey.storeName} dikembalikan untuk perbaikan evidence atau kontak PIC.`,
          entityType: 'surveyResult',
          entityId: survey.id,
          actionView: 'surveyor',
          metadata: { storeName: survey.storeName, revisionRequest: survey.revisionRequest },
        },
        survey.submitTime + 5 * 3_600_000,
        random() < 0.45,
      ),
    );
  }

  for (const assignment of assignments.filter((row) => row.status === 'READY' && row.priority === 'High').slice(0, 18)) {
    rows.push(
      notificationRow(
        assignment.assignedSurveyorId,
        {
          type: 'assignment_created',
          severity: 'warning',
          title: 'Kunjungan prioritas ditugaskan',
          body: `${assignment.storeName} dijadwalkan di ${assignment.city}/${assignment.district}.`,
          entityType: 'assignment',
          entityId: assignment.id,
          actionView: 'surveyor',
          metadata: { storeName: assignment.storeName, visitDate: assignment.visitDate, priority: assignment.priority },
        },
        assignment.createdAt + 20 * 60_000,
        random() < 0.25,
      ),
    );
  }

  return rows.sort((left, right) => right.createdAt - left.createdAt);
}

function tableInsert(db, table, rows) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const statement = db.prepare(`insert into "${table}" (${columns.map((column) => `"${column}"`).join(', ')}) values (${columns.map((column) => `@${column}`).join(', ')})`);
  for (const row of rows) statement.run(row);
}

function summarize(surveys, assignments, photoRows, notifications) {
  const byProvince = Object.fromEntries(
    Object.entries(
      surveys.reduce((counts, row) => {
        counts[row.province] = (counts[row.province] ?? 0) + 1;
        return counts;
      }, {}),
    ).sort((left, right) => right[1] - left[1]),
  );
  const byCity = Object.fromEntries(
    Object.entries(
      surveys.reduce((counts, row) => {
        counts[row.city] = (counts[row.city] ?? 0) + 1;
        return counts;
      }, {}),
    )
      .sort((left, right) => right[1] - left[1])
      .slice(0, 10),
  );
  const byStatus = Object.fromEntries(
    Object.entries(
      surveys.reduce((counts, row) => {
        counts[row.verificationStatus] = (counts[row.verificationStatus] ?? 0) + 1;
        return counts;
      }, {}),
    ).sort((left, right) => right[1] - left[1]),
  );
  const bySurveyor = Object.fromEntries(
    Object.entries(
      surveys.reduce((counts, row) => {
        counts[row.surveyorName] = (counts[row.surveyorName] ?? 0) + 1;
        return counts;
      }, {}),
    ).sort((left, right) => right[1] - left[1]),
  );

  return {
    surveys: surveys.length,
    assignments: assignments.length,
    photoEvidence: photoRows.length,
    notifications: notifications.length,
    byProvince,
    topCities: byCity,
    verificationStatus: byStatus,
    surveyorSubmitted: bySurveyor,
    submittedDateWindow: {
      first: new Date(Math.min(...surveys.map((row) => row.submitTime))).toISOString(),
      last: new Date(Math.max(...surveys.map((row) => row.submitTime))).toISOString(),
      dailySubmitCounts,
    },
  };
}

async function main() {
  const db = new Database(dbPath, apply ? {} : { readonly: true });
  db.pragma('foreign_keys = ON');
  const currentCounts = Object.fromEntries(
    ['assignment', 'surveyResult', 'photoEvidence', 'exportJob', 'notification', 'auditLog'].map((table) => [
      table,
      db.prepare(`select count(*) as count from "${table}"`).get().count,
    ]),
  );

  const team = buildTeamData(db);
  const pools = loadLocationPools(db);
  const { surveys, photoRows } = buildSurveys(team, pools);
  const submittedAssignments = surveys.map(assignmentFromSurvey).filter(Boolean);
  const assignments = buildFutureAssignments(team, pools, submittedAssignments);
  const exportJobs = buildExportJobs(team, surveys);
  const notifications = buildNotifications(team, surveys, assignments);
  const plannedSummary = summarize(surveys, assignments, photoRows, notifications);

  console.log(JSON.stringify({ mode: apply && !dryRun ? 'apply' : 'dry-run', currentCounts, plannedSummary }, null, 2));

  if (dryRun) {
    db.close();
    return;
  }

  await fs.mkdir(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `klwt-surveyor-before-reseed-${stamp}.sqlite`);
  await db.backup(backupPath);

  const replaceData = db.transaction(() => {
    db.prepare('delete from "photoEvidence"').run();
    db.prepare('delete from "notification"').run();
    db.prepare('delete from "surveyResult"').run();
    db.prepare('delete from "assignment"').run();
    db.prepare('delete from "exportJob"').run();
    db.prepare('delete from "auditLog"').run();

    tableInsert(db, 'assignment', assignments);
    tableInsert(db, 'surveyResult', surveys);
    tableInsert(db, 'photoEvidence', photoRows);
    tableInsert(db, 'exportJob', exportJobs);
    tableInsert(db, 'notification', notifications);
  });

  replaceData();
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.close();
  console.log(JSON.stringify({ ok: true, backupPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
