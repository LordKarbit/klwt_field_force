import fs from 'node:fs/promises';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { auth } from './auth';
import { db, rawDb, schema } from './db';

type SeedUser = {
  name: string;
  username: string;
  password: string;
  phone: string;
  role: 'Head' | 'Manager' | 'Surveyor' | 'Verificator' | 'Administrator';
  area: string;
  status?: 'Active' | 'Inactive';
  managerUsername?: string;
};

const campaignStart = new Date('2026-04-20T00:00:00+07:00');
const campaignEnd = new Date('2026-05-10T23:59:59+07:00');
const campaignCurrent = (() => {
  const now = new Date();
  if (now < campaignStart) return campaignStart;
  if (now > campaignEnd) return campaignEnd;
  return now;
})();
const dailyTargetPerSurveyor = 13;
const surveyorNames = [
  'Raka Pratama',
  'Dewi Anggraini',
  'Bagas Saputra',
  'Nadia Permatasari',
  'Fajar Ramadhan',
  'Sinta Maharani',
  'Arif Wicaksono',
  'Dian Puspita',
  'Rizky Maulana',
  'Maya Kartika',
  'Hendra Wijaya',
  'Putri Lestari',
  'Yusuf Aditya',
  'Intan Safitri',
  'Galih Prakoso',
  'Aulia Rahman',
];

function daysInclusive(start: Date, end: Date) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((endUtc - startUtc) / 86_400_000) + 1;
}

function campaignDate(dayOffset: number, hour = 8, minute = 0) {
  const value = new Date(campaignStart);
  value.setDate(campaignStart.getDate() + dayOffset);
  value.setHours(hour, minute, 0, 0);
  return value;
}

const elapsedCampaignDays = daysInclusive(campaignStart, campaignCurrent);
const totalCampaignDays = daysInclusive(campaignStart, campaignEnd);

const seedUsers: SeedUser[] = [
  {
    name: 'Nur Setyo Aji',
    username: 'head.polibeli',
    password: 'head123',
    phone: '0812-0000-1001',
    role: 'Head',
    area: 'National',
  },
  {
    name: 'Lamsihar Sitorus',
    username: 'manager.polibeli',
    password: 'manager123',
    phone: '0812-0000-1002',
    role: 'Manager',
    area: 'Banten, DKI Jakarta, Jawa Barat',
  },
  {
    name: 'Wahyu Kusuma Nugroho',
    username: 'manager2.polibeli',
    password: 'manager2123',
    phone: '0812-0000-1003',
    role: 'Manager',
    area: 'Jawa Tengah, DIY, Jawa Timur',
  },
  {
    name: 'Mira Anggraini',
    username: 'verificator.polibeli',
    password: 'verify123',
    phone: '0812-0000-1004',
    role: 'Verificator',
    area: 'National Verification Queue',
  },
  {
    name: 'Admin Operasional',
    username: 'admin.polibeli',
    password: 'admin123',
    phone: '0812-0000-1005',
    role: 'Administrator',
    area: 'System',
  },
  ...surveyorNames.map((name, index) => {
    const number = index + 1;
    const firstTeam = index < 8;
    return {
      name,
      username: index === 0 ? 'surveyor.polibeli' : `surveyor${String(number).padStart(2, '0')}.polibeli`,
      password: index === 0 ? 'surveyor123' : `surveyor${String(number).padStart(2, '0')}123`,
      phone: `0812-0000-${String(1100 + number).padStart(4, '0')}`,
      role: 'Surveyor' as const,
      area: firstTeam ? 'Banten, DKI Jakarta, Jawa Barat' : 'Jawa Tengah, DIY, Jawa Timur',
      managerUsername: firstTeam ? 'manager.polibeli' : 'manager2.polibeli',
    };
  }),
];

function emailForUsername(username: string) {
  return `${username.toLowerCase()}@polibeli.local`;
}

export async function seedDatabase() {
  for (const item of seedUsers) {
    const email = emailForUsername(item.username);
    let authUser = await db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });

    if (!authUser) {
      const response = await auth.handler(
        new Request('http://127.0.0.1:3005/api/auth/sign-up/email', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            email,
            password: item.password,
          }),
        }),
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to seed ${item.username}: ${message}`);
      }

      authUser = await db.query.user.findFirst({
        where: eq(schema.user.email, email),
      });
    }

    if (!authUser) continue;

    const existingProfile = await db.query.userProfile.findFirst({
      where: eq(schema.userProfile.authUserId, authUser.id),
    });

    if (existingProfile) continue;

    const managerProfile = item.managerUsername
      ? await db.query.userProfile.findFirst({
          where: eq(schema.userProfile.username, item.managerUsername),
        })
      : undefined;

    const now = new Date();
    await db.insert(schema.userProfile).values({
      id: nanoid(),
      authUserId: authUser.id,
      username: item.username,
      phone: item.phone,
      role: item.role,
      area: item.area,
      managerId: managerProfile?.id,
      status: item.status ?? 'Active',
      createdAt: now,
      updatedAt: now,
    });
  }

  await seedLocations();
  await seedSurveyResults();
  await seedAssignments();
  await seedExportJobs();
}

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

async function seedLocations() {
  const existingLocation = await db.query.location.findFirst();
  if (existingLocation) return;

  const csvText = await fs.readFile('DB Lokasi.csv', 'utf8');
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  const rows = lines.slice(1).map((line, index) => {
    const [province, city, district, village] = parseCsvLine(line);
    return {
      id: `LOC-${String(index + 1).padStart(6, '0')}`,
      province,
      city,
      district,
      village,
    };
  });

  const chunkSize = 500;
  for (let index = 0; index < rows.length; index += chunkSize) {
    await db.insert(schema.location).values(rows.slice(index, index + chunkSize)).onConflictDoNothing();
  }
}

function createSeededRandom(seed = 20260429) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const random = createSeededRandom();

function pick<T>(items: T[]) {
  return items[Math.floor(random() * items.length)];
}

function weightedPick<T>(items: ReadonlyArray<readonly [T, number]>) {
  const total = items.reduce((sum, item) => sum + item[1], 0);
  let cursor = random() * total;
  for (const [value, weight] of items) {
    cursor -= weight;
    if (cursor <= 0) return value;
  }
  return items[items.length - 1][0];
}

function sample<T>(items: T[], min: number, max: number) {
  const count = min + Math.floor(random() * (max - min + 1));
  const shuffled = [...items].sort(() => random() - 0.5);
  return shuffled.slice(0, count);
}

function json(value: unknown) {
  return JSON.stringify(value);
}

function gradeMerchant(score: number) {
  if (score >= 85) return 'A+';
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

function gradeQuality(score: number) {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Warning';
  return 'Poor';
}

function locationCoordinate(province: string) {
  const bases: Record<string, [number, number]> = {
    Banten: [-6.25, 106.1],
    'DKI Jakarta': [-6.18, 106.82],
    'Jawa Barat': [-6.9, 107.6],
    'Jawa Tengah': [-7.1, 110.4],
    'Daerah Istimewa Yogyakarta': [-7.8, 110.36],
    'Jawa Timur': [-7.55, 112.25],
  };
  const [lat, lng] = bases[province] ?? [-7.1, 110.4];
  return {
    latitude: (lat + (random() - 0.5) * 1.4).toFixed(6),
    longitude: (lng + (random() - 0.5) * 1.8).toFixed(6),
  };
}

async function seedSurveyResults() {
  const current = rawDb.prepare('select count(*) as count from "surveyResult"').get() as { count: number };
  const targetSubmitted = elapsedCampaignDays * dailyTargetPerSurveyor * surveyorNames.length;
  if (current.count >= targetSubmitted) return;

  const locations = rawDb
    .prepare('select province, city, district, village from "location" order by random() limit 2800')
    .all() as Array<{ province: string; city: string; district: string; village: string }>;

  const surveyorRows = await db
    .select({
      profile: schema.userProfile,
      authUser: schema.user,
    })
    .from(schema.userProfile)
    .innerJoin(schema.user, eq(schema.userProfile.authUserId, schema.user.id));

  const managers = surveyorRows.filter((row) => row.profile.role === 'Manager');
  const surveyors = surveyorRows.filter((row) => row.profile.role === 'Surveyor' && row.profile.status === 'Active');
  const verificator = surveyorRows.find((row) => row.profile.role === 'Verificator');
  const fallbackManager = managers[0];

  if (!locations.length || !surveyors.length || !fallbackManager) return;

  const businessTypes = [
    ['General Sparepart Retail', 34],
    ['Cooling Specialist / Radiator Shop', 22],
    ['AC & Cooling Specialist', 16],
    ['Workshop / Repair Garage', 14],
    ['Specialist Workshop', 7],
    ['Fleet / Commercial Workshop', 4],
    ['Wholesale Sparepart Distributor', 3],
  ] as const;
  const vehicleOptions = [
    'Japanese Passenger Car',
    'Commercial Van/Pickup',
    'Universal Mixed',
    'SUV/4x4',
    'Korean Passenger Car',
    'Chinese Car',
    'Diesel/Truck',
    'European Passenger Car',
  ];
  const coolingProducts = ['Radiator', 'Condenser', 'Cooling Fan', 'Water Pump', 'Radiator Hose', 'Radiator Cap', 'Coolant Accessories'];
  const brands = ['Denso', 'Koyorad', 'TYC', 'GMB', 'Aisin', 'Astra/Aspira', 'Sakura', 'Generic China', 'Local No Brand'];
  const supplierNames = ['Mitra Auto Supply', 'Sumber Rejeki Motor', 'Sentral Sparepart', 'Aneka Cooling Parts', 'Jaya Radiator Supply', 'Nusantara Auto', 'Indo Parts Grosir', 'Prima Radiator Supply', 'Tidak disebutkan'];
  const firstNames = ['Budi', 'Agus', 'Dedi', 'Rina', 'Siti', 'Hendra', 'Yanto', 'Asep', 'Wahyu', 'Tono', 'Maya', 'Dewi', 'Iwan', 'Rizky'];
  const storePrefixes = ['Sinar', 'Berkah', 'Maju', 'Jaya', 'Makmur', 'Sentosa', 'Prima', 'Mandiri', 'Sumber', 'Mega', 'Surya', 'Kencana', 'Barokah', 'Mitra'];
  const storeSuffixes = ['Motor', 'Sparepart', 'Radiator', 'Auto Parts', 'AC Mobil', 'Cooling Parts', 'Jaya Motor', 'Bengkel Mobil'];
  const streetNames = ['Jl. Raya', 'Jl. Industri', 'Jl. Pasar Baru', 'Jl. Ahmad Yani', 'Jl. Sudirman', 'Jl. Pemuda', 'Jl. Veteran', 'Jl. Alternatif'];
  const rows: Array<typeof schema.surveyResult.$inferInsert> = [];
  const start = current.count + 1;
  const target = targetSubmitted - current.count;

  for (let index = 0; index < target; index += 1) {
    const sequence = start + index;
    const dayOffset = Math.floor(index / (dailyTargetPerSurveyor * surveyors.length));
    const orderInDay = index % (dailyTargetPerSurveyor * surveyors.length);
    const visitSlot = Math.floor(orderInDay / surveyors.length);
    const location = locations[index % locations.length];
    const surveyor = surveyors[orderInDay % surveyors.length];
    const manager = managers.find((row) => row.profile.id === surveyor.profile.managerId) ?? fallbackManager;
    const businessType = weightedPick(businessTypes);
    const products = sample(coolingProducts, businessType.includes('Cooling') || businessType.includes('Radiator') ? 4 : 2, 7);
    const seenBrands = sample(brands, 2, 5);
    const vehicles = sample(vehicleOptions, 2, 4);
    const orderMethods = sample(['Didatangi sales canvasser', 'Order WhatsApp', 'Telepon', 'Marketplace', 'Ambil sendiri'], 1, 3);
    const purchaseDrivers = sample(['Harga murah', 'Margin besar', 'Brand terkenal', 'Kualitas stabil', 'Barang lengkap', 'Fast delivery', 'Retur mudah', 'Tempo pembayaran'], 2, 3);
    const tryReasons = sample(['Harga lebih murah', 'Margin lebih besar', 'Barang lebih lengkap', 'Tempo lebih enak', 'Retur lebih gampang', 'Pengiriman cepat', 'Kualitas stabil'], 2, 3);
    const hasWa = random() > 0.13;
    const gpsWarning = random() < 0.055;
    const interiorMissing = random() < 0.045;
    const picMissing = random() < 0.07;
    const supplierDissatisfied = random() < 0.32;
    const openToNew = weightedPick([
      ['Sangat terbuka', 30],
      ['Bisa coba', 44],
      ['Hanya merk tertentu', 18],
      ['Tidak suka coba baru', 8],
    ] as const);
    const shelfSize = weightedPick([
      ['Sedikit', 22],
      ['Sedang', 49],
      ['Banyak / dominan', 25],
      ['Tidak terlihat cooling parts', 4],
    ] as const);
    const salesActivity = weightedPick([
      ['Jarang', 12],
      ['Kadang', 28],
      ['Cukup rutin', 42],
      ['Sangat rutin', 18],
    ] as const);
    const restockFrequency = weightedPick([
      ['Hampir tiap hari', 8],
      ['Mingguan', 42],
      ['Bulanan', 31],
      ['Hanya saat ada permintaan', 17],
      ['Tidak tahu', 2],
    ] as const);
    const storeScale = weightedPick([
      ['Small', 28],
      ['Medium', 48],
      ['Large', 19],
      ['Wholesale / Distributor scale', 5],
    ] as const);
    const verifierWhatsappReachable = hasWa ? random() > 0.08 : false;
    const verifierPhoneCallable = hasWa ? random() > 0.15 : false;
    const followUpWaAvailable = hasWa && verifierWhatsappReachable;

    let score = 24;
    score += businessType.includes('Cooling') || businessType.includes('Radiator') ? 14 : businessType.includes('General') ? 9 : 5;
    score += products.length * 2;
    score += salesActivity === 'Sangat rutin' ? 10 : salesActivity === 'Cukup rutin' ? 7 : salesActivity === 'Kadang' ? 4 : 0;
    score += openToNew === 'Sangat terbuka' ? 11 : openToNew === 'Bisa coba' ? 7 : openToNew === 'Hanya merk tertentu' ? 2 : -5;
    score += supplierDissatisfied ? 6 : 1;
    score += followUpWaAvailable ? 4 : 0;
    score += storeScale === 'Large' || storeScale.includes('Wholesale') ? 5 : storeScale === 'Medium' ? 3 : 0;
    score = Math.max(24, Math.min(96, Math.round(score + (random() - 0.5) * 14)));

    const merchantGrade = gradeMerchant(score);
    const highCooling = products.length >= 4 && ['Cukup rutin', 'Sangat rutin'].includes(salesActivity);
    const leadClassification =
      (merchantGrade === 'A' || merchantGrade === 'A+') && ['Sangat terbuka', 'Bisa coba'].includes(openToNew) && followUpWaAvailable
        ? 'Hot Lead'
        : (merchantGrade === 'A' || merchantGrade === 'A+') && ['Sangat terbuka', 'Bisa coba'].includes(openToNew)
          ? 'Qualified Lead'
          : highCooling && !['Sangat terbuka', 'Bisa coba'].includes(openToNew)
            ? 'Strategic Lead'
            : merchantGrade === 'B'
              ? 'Normal Lead'
              : 'Low Priority';

    const warningFlags = [
      gpsWarning ? 'GPS_WARNING_GT_100M' : null,
      !hasWa ? 'WA_EMPTY_WITH_REASON' : null,
      hasWa && !verifierWhatsappReachable ? 'VERIFIER_WA_UNREACHABLE' : null,
      hasWa && !verifierPhoneCallable ? 'VERIFIER_PHONE_UNREACHABLE' : null,
    ].filter(Boolean);
    const dataQuality = Math.max(
      58,
      Math.min(99, 92 - (gpsWarning ? 14 : 0) - (!hasWa || !verifierWhatsappReachable ? 8 : 0) - (!verifierPhoneCallable ? 5 : 0) - Math.floor(random() * 7)),
    );
    const isToday = dayOffset === elapsedCampaignDays - 1;
    const verificationStatus = isToday
      ? weightedPick([
          ['WAITING_VERIFICATION', 54],
          ['VERIFIED_VALID', 32],
          ['NEED_REVISION', 10],
          ['REJECTED_INVALID', 3],
          ['MERGED_DUPLICATE', 1],
        ] as const)
      : weightedPick([
          ['VERIFIED_VALID', 84],
          ['WAITING_VERIFICATION', 7],
          ['NEED_REVISION', 6],
          ['REJECTED_INVALID', 2],
          ['MERGED_DUPLICATE', 1],
        ] as const);
    const visitDate = campaignDate(dayOffset, 8 + Math.floor(visitSlot / 2), (visitSlot % 2) * 28 + Math.floor(random() * 8));
    const submitTime = new Date(visitDate.getTime() + (10 + Math.floor(random() * 11)) * 60_000);
    const verifiedAt =
      ['VERIFIED_VALID', 'REJECTED_INVALID', 'MERGED_DUPLICATE'].includes(verificationStatus)
        ? new Date(submitTime.getTime() + (20 + Math.floor(random() * 180)) * 60_000)
        : null;
    const verifierContactCheckedAt = verifiedAt ?? new Date(submitTime.getTime() + (12 + Math.floor(random() * 36)) * 60_000);
    const storeName = `${pick(storePrefixes)} ${pick(storeSuffixes)} ${location.village}`;
    const coords = locationCoordinate(location.province);
    const storeCode = `KLWT-SV-${String(sequence).padStart(5, '0')}`;
    const missingPhotoReasons = [
      interiorMissing ? weightedPick([['Toko melarang foto area dalam', 38], ['Toko sedang ramai', 30], ['Alasan keamanan/privasi', 32]] as const) : null,
      picMissing ? weightedPick([['Owner/PIC menolak foto orang', 58], ['Owner/PIC tidak tersedia', 24], ['Alasan keamanan/privasi', 18]] as const) : null,
    ].filter(Boolean);
    const finalWarningFlags = [
      ...warningFlags,
      interiorMissing ? 'MISSING_INTERIOR_PHOTO_WITH_REASON' : null,
      picMissing ? 'MISSING_PIC_PHOTO_WITH_REASON' : null,
    ].filter(Boolean);

    rows.push({
      id: nanoid(),
      storeCode,
      candidateStoreStatus: verificationStatus === 'VERIFIED_VALID' ? 'VERIFIED_MASTER_STORE' : verificationStatus === 'MERGED_DUPLICATE' ? 'MERGED_DUPLICATE' : 'CANDIDATE_STORE',
      storeName,
      storeAlias: random() > 0.72 ? `${pick(storePrefixes)} ${location.village}` : null,
      visitOutcome: 'SURVEY_COMPLETED',
      plannedOrUnplanned: random() > 0.42 ? 'PLANNED' : 'UNPLANNED',
      province: location.province,
      city: location.city,
      district: location.district,
      village: location.village,
      addressDetail: `${pick(streetNames)} No. ${1 + Math.floor(random() * 280)}, ${location.village}`,
      landmark: `Dekat ${pick(['pasar', 'SPBU', 'bengkel ban', 'ruko utama', 'terminal kecil', 'toko oli'])} ${location.district}`,
      latitude: coords.latitude,
      longitude: coords.longitude,
      gpsAccuracy: 6 + Math.floor(random() * 18),
      gpsWarningFlag: gpsWarning,
      gpsDistanceFromTarget: gpsWarning ? 120 + Math.floor(random() * 360) : Math.floor(random() * 92),
      contactPersonName: pick(firstNames),
      picType: weightedPick([
        ['Owner', 63],
        ['Karyawan', 37],
      ] as const),
      whatsappNumber: hasWa ? `08${10 + Math.floor(random() * 89)}-${1000 + Math.floor(random() * 8999)}-${1000 + Math.floor(random() * 8999)}` : null,
      waEmptyReason: hasWa ? null : weightedPick([
        ['Owner/PIC menolak memberi nomor', 36],
        ['Owner/PIC tidak tersedia', 28],
        ['Toko tidak memiliki nomor WA bisnis', 18],
        ['Akan diberikan saat revisit', 18],
      ] as const),
      purchasingDecisionMaker: weightedPick([
        ['Owner', 56],
        ['Anak owner / family', 16],
        ['Kepala toko', 12],
        ['Mekanik', 8],
        ['Staff pembelian', 8],
      ] as const),
      decisionMakerAvailability: weightedPick([
        ['Selalu ada', 42],
        ['Pagi saja', 19],
        ['Sore saja', 12],
        ['By phone/WA', 22],
        ['Jarang datang', 5],
      ] as const),
      businessType,
      vehicleSpecialization: json(vehicles),
      storeScale,
      coolingProducts: json(products),
      coolingShelfSize: shelfSize,
      coolingSalesActivity: salesActivity,
      coolingBrands: json(seenBrands),
      productSellingSegment: weightedPick([
        ['Economy aftermarket', 36],
        ['Middle aftermarket', 34],
        ['OEM/OES trusted', 18],
        ['Mixed segment', 12],
      ] as const),
      lowCostImportShare: weightedPick([
        ['Rendah', 14],
        ['Sedang', 43],
        ['Tinggi', 38],
        ['Tidak tahu', 5],
      ] as const),
      supplierType: weightedPick([
        ['Distributor lokal', 34],
        ['Sales canvasser', 27],
        ['Grosir sparepart', 18],
        ['Importir langsung', 8],
        ['Marketplace', 6],
        ['Campur', 7],
      ] as const),
      supplierName: pick(supplierNames),
      supplierDependency: weightedPick([
        ['1 supplier utama', 24],
        ['2-3 supplier', 48],
        ['Banyak supplier', 24],
        ['Tidak tahu', 4],
      ] as const),
      supplierSatisfaction: supplierDissatisfied ? pick(['Kurang puas', 'Biasa saja']) : pick(['Puas', 'Biasa saja']),
      returnEase: supplierDissatisfied ? pick(['Sulit', 'Biasa saja']) : pick(['Mudah', 'Biasa saja']),
      deliverySpeed: supplierDissatisfied ? pick(['Lambat', 'Biasa saja']) : pick(['Cepat', 'Biasa saja']),
      paymentMethod: weightedPick([
        ['Cash', 32],
        ['COD', 28],
        ['Tempo 7 hari', 18],
        ['Tempo 14 hari', 12],
        ['Transfer sebelum kirim', 10],
      ] as const),
      restockFrequency,
      purchaseSizeRange: weightedPick([
        ['Kecil', 28],
        ['Sedang', 50],
        ['Besar', 18],
        ['Tidak bersedia menjawab', 4],
      ] as const),
      monthlyPurchaseValue: weightedPick([
        ['< Rp1 juta', 14],
        ['Rp1-5 juta', 36],
        ['Rp5-10 juta', 27],
        ['Rp10-25 juta', 17],
        ['> Rp25 juta', 6],
      ] as const),
      marginExpectation: weightedPick([
        ['< 10%', 8],
        ['10-15%', 37],
        ['16-25%', 42],
        ['> 25%', 13],
      ] as const),
      currentOrderMethod: json(orderMethods),
      mainPurchaseDriver: json(purchaseDrivers),
      priceSensitivity: weightedPick([
        ['Sangat harga', 43],
        ['Harga & kualitas seimbang', 45],
        ['Lebih cari merk terkenal', 12],
      ] as const),
      opennessToNewSupplier: openToNew,
      reasonToTryNewSupplier: json(tryReasons),
      willingnessToReceiveFollowUp: weightedPick([
        ['Mau dihubungi', 40],
        ['Boleh kirim katalog/price list dulu', 37],
        ['Perlu bicara owner', 17],
        ['Tidak tertarik saat ini', 6],
      ] as const),
      storefrontPhotoUrl: `/evidence/${storeCode}/storefront.jpg`,
      interiorPhotoUrl: interiorMissing ? '' : `/evidence/${storeCode}/interior.jpg`,
      picPhotoUrl: picMissing ? '' : `/evidence/${storeCode}/pic.jpg`,
      photoMissingReason: missingPhotoReasons.length ? missingPhotoReasons.join('|') : null,
      surveyorNotes:
        leadClassification === 'Hot Lead'
          ? `PIC tertarik menerima katalog cooling, terutama ${products.slice(0, 2).join(' dan ')} dengan harga kompetitif.`
          : `Toko menjual ${products.slice(0, 3).join(', ')}; supplier existing ${supplierDissatisfied ? 'masih ada keluhan' : 'cukup stabil'}.`,
      warningFlags: json(finalWarningFlags),
      merchantPotentialScore: score,
      merchantGrade,
      dataQualityScore: Math.max(45, dataQuality - (interiorMissing ? 7 : 0) - (picMissing ? 5 : 0)),
      dataQualityGrade: gradeQuality(Math.max(45, dataQuality - (interiorMissing ? 7 : 0) - (picMissing ? 5 : 0))),
      leadClassification,
      verificationStatus,
      verifierPhoneCallable,
      verifierWhatsappReachable,
      verifierContactCheckedAt,
      revisionRequest: verificationStatus === 'NEED_REVISION' ? pick(['Lengkapi patokan lokasi', 'Konfirmasi nomor WA owner', 'Perjelas supplier utama']) : null,
      verificatorId: verifiedAt || verificationStatus === 'NEED_REVISION' ? verificator?.profile.id ?? null : null,
      verificationNotes:
        verificationStatus === 'VERIFIED_VALID'
          ? 'Data valid, foto dan alamat konsisten.'
          : verificationStatus === 'REJECTED_INVALID'
            ? 'Data tidak cukup valid untuk menjadi master store.'
            : verificationStatus === 'MERGED_DUPLICATE'
              ? 'Digabung sebagai duplikat dari submit lebih awal.'
              : null,
      surveyorId: surveyor.profile.id,
      surveyorName: surveyor.authUser.name,
      managerId: manager.profile.id,
      managerName: manager.authUser.name,
      visitDate,
      visitStartTime: visitDate,
      submitTime,
      verifiedAt,
      createdAt: submitTime,
      updatedAt: verifiedAt ?? submitTime,
    });
  }

  const chunkSize = 100;
  for (let index = 0; index < rows.length; index += chunkSize) {
    await db.insert(schema.surveyResult).values(rows.slice(index, index + chunkSize)).onConflictDoNothing();
  }
}

async function seedAssignments() {
  const current = rawDb.prepare('select count(*) as count from "assignment"').get() as { count: number };
  if (current.count > 0) return;

  const locations = rawDb
    .prepare('select province, city, district, village from "location" order by random() limit 4600')
    .all() as Array<{ province: string; city: string; district: string; village: string }>;

  const teamRows = await db
    .select({
      profile: schema.userProfile,
      authUser: schema.user,
    })
    .from(schema.userProfile)
    .innerJoin(schema.user, eq(schema.userProfile.authUserId, schema.user.id));

  const managers = teamRows.filter((row) => row.profile.role === 'Manager');
  const surveyors = teamRows.filter((row) => row.profile.role === 'Surveyor' && row.profile.status === 'Active');
  const fallbackManager = managers[0];
  if (!locations.length || !surveyors.length || !fallbackManager) return;

  const rows: Array<typeof schema.assignment.$inferInsert> = [];
  const storePrefixes = ['Target Makmur', 'Target Berkah', 'Target Jaya', 'Target Sentosa', 'Target Prima', 'Target Sumber'];
  const storeSuffixes = ['Motor', 'Sparepart', 'Radiator', 'AC Mobil', 'Auto Parts', 'Cooling Parts'];

  for (let dayOffset = 0; dayOffset < totalCampaignDays; dayOffset += 1) {
    const visitDay = campaignDate(dayOffset);
    surveyors.forEach((surveyor, surveyorIndex) => {
      const manager = managers.find((row) => row.profile.id === surveyor.profile.managerId) ?? fallbackManager;
      for (let visitIndex = 0; visitIndex < dailyTargetPerSurveyor; visitIndex += 1) {
        const locationIndex = (dayOffset * surveyors.length * dailyTargetPerSurveyor + surveyorIndex * dailyTargetPerSurveyor + visitIndex) % locations.length;
        const location = locations[locationIndex];
        const coords = locationCoordinate(location.province);
        const visitDate = new Date(visitDay);
        visitDate.setHours(8 + Math.floor(visitIndex / 2), (visitIndex % 2) * 28, 0, 0);
        const isPast = dayOffset < elapsedCampaignDays - 1;
        const isToday = dayOffset === elapsedCampaignDays - 1;

        rows.push({
          id: nanoid(),
          storeName: `${pick(storePrefixes)} ${pick(storeSuffixes)} ${location.village}`,
          province: location.province,
          city: location.city,
          district: location.district,
          village: location.village,
          addressDetail: `${pick(['Jl. Raya', 'Jl. Pasar', 'Jl. Industri', 'Jl. Veteran'])} No. ${1 + Math.floor(random() * 220)}, ${location.village}`,
          landmark: `Dekat ${pick(['pasar', 'SPBU', 'ruko utama', 'bengkel ban', 'toko oli'])} ${location.district}`,
          latitude: visitIndex % 5 === 0 ? null : coords.latitude,
          longitude: visitIndex % 5 === 0 ? null : coords.longitude,
          assignedManagerId: manager.profile.id,
          assignedManagerName: manager.authUser.name,
          assignedSurveyorId: surveyor.profile.id,
          assignedSurveyorName: surveyor.authUser.name,
          visitDate,
          priority: weightedPick([
            ['High', 22],
            ['Medium', 58],
            ['Low', 20],
          ] as const),
          visitObjective: visitIndex % 6 === 0 ? 'Revisit' : 'Survey',
          plannedOrUnplanned: 'PLANNED',
          status: isPast ? 'SUBMITTED' : isToday && visitIndex < 4 ? 'IN_PROGRESS' : visitIndex % 5 === 0 ? 'NO_GPS_YET' : visitIndex % 6 === 0 ? 'REVISIT' : 'READY',
          notes: visitIndex % 6 === 0 ? 'Revisit candidate store dari histori sebelumnya.' : null,
          createdAt: campaignDate(Math.max(0, dayOffset - 1), 17, 30),
          updatedAt: isPast ? visitDate : campaignDate(Math.max(0, dayOffset - 1), 17, 30),
        });
      }
    });
  }

  const chunkSize = 100;
  for (let index = 0; index < rows.length; index += chunkSize) {
    await db.insert(schema.assignment).values(rows.slice(index, index + chunkSize)).onConflictDoNothing();
  }
}

async function seedExportJobs() {
  const current = rawDb.prepare('select count(*) as count from "exportJob"').get() as { count: number };
  if (current.count > 0) return;

  const now = new Date('2026-04-30T09:00:00+07:00');
  const rows: Array<typeof schema.exportJob.$inferInsert> = [
    ['All Survey Data', 'all-survey-data', 'National', 'Ready', 'Head'],
    ['Verified Store Database', 'verified-store-database', 'National', 'Ready', 'Administrator'],
    ['Hot Lead / Qualified Lead', 'hot-qualified-leads', 'National', 'Ready', 'Manager'],
    ['Supplier & Brand Intelligence', 'supplier-brand-intelligence', 'National', 'Ready', 'Head'],
    ['Raw Photo Evidence Link', 'photo-evidence-links', 'National', 'Ready', 'Verificator'],
    ['Surveyor Performance', 'surveyor-performance', 'National', 'Ready', 'Head'],
  ].map(([name, kind, scope, status, ownerRole]) => ({
    id: nanoid(),
    name,
    kind,
    scope,
    status,
    ownerRole,
    rowCount: 0,
    createdBy: 'system-seed',
    createdAt: now,
    completedAt: now,
  }));

  await db.insert(schema.exportJob).values(rows).onConflictDoNothing();
}
