import { canMergeDuplicateTarget, duplicateVerificationNote } from './verificationRules';

describe('verification rules', () => {
  it('allows merge duplicate only into an already verified valid master store', () => {
    expect(canMergeDuplicateTarget('VERIFIED_VALID')).toBe(true);
    expect(canMergeDuplicateTarget('WAITING_VERIFICATION')).toBe(false);
    expect(canMergeDuplicateTarget('NEED_REVISION')).toBe(false);
    expect(canMergeDuplicateTarget(undefined)).toBe(false);
  });

  it('builds an audit note for duplicate merge decisions', () => {
    expect(
      duplicateVerificationNote({
        targetStoreName: 'Makmur Jaya Motor Pandean',
        targetStoreCode: 'KLWT-001',
        existingNotes: 'Alamat dan WhatsApp sama.',
      }),
    ).toBe('Merged duplicate with Makmur Jaya Motor Pandean (KLWT-001). Alamat dan WhatsApp sama.');
  });
});
