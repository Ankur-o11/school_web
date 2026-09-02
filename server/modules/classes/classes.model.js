import { getDatabase } from "../../config/database.js";

const COLLECTION_NAME = "classes";

export function getClassesCollection() {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME);
}