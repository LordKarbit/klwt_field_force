export function canMergeDuplicateTarget(status: string | null | undefined) {
  return status === 'VERIFIED_VALID';
}

export function duplicateVerificationNote({
  targetStoreName,
  targetStoreCode,
  fallbackTargetId,
  existingNotes,
}: {
  targetStoreName?: string | null;
  targetStoreCode?: string | null;
  fallbackTargetId?: string | null;
  existingNotes?: string | null;
}) {
  return [
    `Merged duplicate with ${targetStoreName || 'selected store'} (${targetStoreCode || fallbackTargetId || '-'}).`,
    existingNotes,
  ]
    .filter(Boolean)
    .join(' ');
}
