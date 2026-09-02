// =====================================================
// MPSA SCHOOL
// FEES MODEL
// =====================================================

export const FEES_COLLECTION = "fees";

// =====================================================
// CREATE FEE DOCUMENT
// =====================================================

export function createFeeDocument({
  studentId,
  academicYear,
  totalFees = 0,
  discount = 0,
}) {
  const now = new Date();

  return {
    studentId,
    academicYear,

    totalFees: Number(totalFees) || 0,
    discount: Number(discount) || 0,

    payments: [],

    createdAt: now,
    updatedAt: now,
  };
}