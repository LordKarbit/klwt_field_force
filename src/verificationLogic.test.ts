import type { SurveyHistoryItem } from './api';
import { DUPLICATE_WARNING_THRESHOLD, duplicateCandidateScore, duplicateMatchDetails, normalizeStoreMatch, topDuplicateCandidates } from './verificationLogic';

function survey(overrides: Partial<SurveyHistoryItem>): SurveyHistoryItem {
  return {
    id: 'survey-id',
    assignmentId: '',
    storeCode: 'KLWT-001',
    storeName: 'Makmur Jaya Motor',
    storeAlias: '',
    merchantPotentialScore: 82,
    merchantGrade: 'A',
    dataQualityScore: 90,
    dataQualityGrade: 'Good',
    leadClassification: 'Hot Lead',
    warningFlags: [],
    verificationStatus: 'WAITING_VERIFICATION',
    duplicateCandidateCount: 0,
    duplicateTopScore: 0,
    verificatorId: '',
    verificationNotes: '',
    revisionRequest: '',
    verifiedAt: '',
    surveyorId: 'surveyor-1',
    surveyorName: 'Raka Pratama',
    managerName: 'Lamsihar Sitorus',
    province: 'Jawa Timur',
    city: 'Pasuruan',
    district: 'Rembang',
    village: 'Pandean',
    addressDetail: 'Jl Raya Pandean No 10',
    landmark: 'Dekat pasar',
    latitude: '-7.123',
    longitude: '112.123',
    gpsAccuracy: 12,
    gpsWarningFlag: false,
    gpsDistanceFromTarget: 0,
    visitOutcome: 'SURVEY_COMPLETED',
    plannedOrUnplanned: 'PLANNED',
    contactPersonName: 'Budi',
    picType: 'Owner',
    whatsappNumber: '08123456789',
    waEmptyReason: '',
    purchasingDecisionMaker: 'Owner',
    decisionMakerAvailability: 'Selalu ada',
    businessType: 'Toko radiator',
    vehicleSpecialization: ['Passenger'],
    storeScale: 'Medium',
    coolingProducts: ['Radiator coolant'],
    coolingShelfSize: 'Medium',
    coolingSalesActivity: 'Rutin',
    coolingBrands: ['Polibeli'],
    productSellingSegment: 'Mid',
    lowCostImportShare: 'Sedang',
    supplierType: ['Distributor'],
    supplierName: 'Supplier A',
    supplierDependency: 'Medium',
    supplierSatisfaction: 'Kurang puas',
    returnEase: 'Mudah',
    deliverySpeed: 'Cepat',
    paymentMethod: 'COD',
    restockFrequency: 'Mingguan',
    purchaseSizeRange: 'Medium',
    monthlyPurchaseValue: 'Rp1-5juta / bulan',
    marginExpectation: '16-25%',
    currentOrderMethod: ['WhatsApp'],
    mainPurchaseDriver: ['Harga'],
    priceSensitivity: 'Medium',
    opennessToNewSupplier: 'Terbuka',
    reasonToTryNewSupplier: ['Harga'],
    willingnessToReceiveFollowUp: 'Ya',
    storefrontPhotoUrl: '/api/evidence/front',
    interiorPhotoUrl: '/api/evidence/rack',
    picPhotoUrl: '/api/evidence/pic',
    photoMissingReason: '',
    surveyorNotes: '',
    candidateStoreStatus: 'CANDIDATE_STORE',
    submitTime: '2026-04-30T07:00:00.000Z',
    ...overrides,
  };
}

describe('duplicate matching flow', () => {
  it('normalizes noisy store names before matching', () => {
    expect(normalizeStoreMatch('Toko Cahaya Jaya Motor Radiator')).toBe('cahaya');
  });

  it('scores matching verified stores as a percentage using name, WA, location, address, and coordinate signals', () => {
    const source = survey({ id: 'source', storeName: 'Makmur Jaya Motor Pandean' });
    const candidate = survey({ id: 'target', storeName: 'Makmur Jaya Motor Pandean', verificationStatus: 'VERIFIED_VALID' });

    const details = duplicateMatchDetails(source, candidate);

    expect(duplicateCandidateScore(source, candidate)).toBe(100);
    expect(details.percentage).toBe(100);
    expect(details.matchedWeight).toBe(details.totalWeight);
    expect(details.percentage).toBeGreaterThanOrEqual(DUPLICATE_WARNING_THRESHOLD);
  });

  it('shows only the top 10 verified stores with real matching data', () => {
    const source = survey({ id: 'source' });
    const rows = [
      source,
      survey({ id: 'unverified-match', verificationStatus: 'WAITING_VERIFICATION' }),
      survey({ id: 'not-match', storeName: 'Mega Abadi', city: 'Bekasi', district: 'Utara', village: 'Kaliabang', whatsappNumber: '089999', addressDetail: 'Alamat lain', verificationStatus: 'VERIFIED_VALID' }),
      ...Array.from({ length: 12 }, (_, index) =>
        survey({
          id: `verified-${index}`,
          storeCode: `KLWT-${index}`,
          storeName: `Makmur Jaya Motor ${index}`,
          verificationStatus: 'VERIFIED_VALID',
          submitTime: `2026-04-${String(20 + index).padStart(2, '0')}T07:00:00.000Z`,
        }),
      ),
    ];

    const candidates = topDuplicateCandidates(rows, source);

    expect(candidates).toHaveLength(10);
    expect(candidates.every(({ row, score }) => row.verificationStatus === 'VERIFIED_VALID' && score > 0)).toBe(true);
    expect(candidates.some(({ row }) => row.id === 'not-match')).toBe(false);
  });

  it('keeps search inside the already matched top candidate set', () => {
    const source = survey({ id: 'source' });
    const candidates = topDuplicateCandidates(
      [
        source,
        survey({ id: 'target-a', storeName: 'Makmur Jaya Motor Pandean', storeCode: 'KLWT-A', verificationStatus: 'VERIFIED_VALID' }),
        survey({ id: 'target-b', storeName: 'Makmur Jaya Motor Cepoko', storeCode: 'KLWT-B', verificationStatus: 'VERIFIED_VALID' }),
      ],
      source,
      'cepoko',
    );

    expect(candidates.map(({ row }) => row.id)).toEqual(['target-b']);
  });
});
