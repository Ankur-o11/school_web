// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// RESULTS MODEL
// MongoDB Collection Helper
// =====================================================

import { getDatabase } from "../../config/database.js";

const COLLECTION_NAME = "results";

export function getResultsCollection() {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME);
}