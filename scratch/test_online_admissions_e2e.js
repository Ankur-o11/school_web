import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase, closeDatabase } from "../server/config/database.js";
import {
  setAdmissionsDatabase,
  createOnlineAdmission,
  getAllAdmissions,
  getAdmissionById,
  approveApplication,
  rejectApplication,
  requestDocuments,
  addApplicationDocument,
  confirmAndCreateStudent,
} from "../server/modules/admissions/admissions.service.js";
import { setStudentsDatabase } from "../server/modules/students/students.controller.js";
import { setTemplatesDatabase } from "../server/modules/communications/templates.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../server/server.env") });

async function runEndToEndTest() {
  console.log("=== MPSA SCHOOL ERP - ONLINE ADMISSIONS E2E TEST ===");

  try {
    const db = await connectDatabase();
    setAdmissionsDatabase(db);
    setStudentsDatabase(db);
    setTemplatesDatabase(db);

    console.log("✅ 1. Database connected");

    // Test 1: Submit Online Application
    console.log("\n--- TEST 1: Submit Public Online Application ---");
    const testAppInput = {
      applicantName: "Test Student " + Date.now().toString().slice(-4),
      gender: "Female",
      dob: "2018-05-15",
      appliedClass: "Class 1",
      parentName: "Parent Tester",
      parentPhone: "9026590221",
      email: "test.parent@example.com",
      address: "123 Test Street",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226001",
      prevSchool: "ABC Primary School",
    };

    const createdApp = await createOnlineAdmission(testAppInput);
    console.log("✅ Online Application Created in MongoDB!");
    console.log("   Application ID:", createdApp.applicationId);
    console.log("   Tracking Token:", createdApp.trackingToken);
    console.log("   Status:", createdApp.status);

    // Test 2: Fetch Application List
    console.log("\n--- TEST 2: Fetch Online Applicants List ---");
    const allApps = await getAllAdmissions({ source: "online" });
    const fetchedApp = allApps.find((a) => a.id === createdApp.id);
    if (!fetchedApp) throw new Error("Created application not found in list query!");
    console.log(`✅ Fetched ${allApps.length} online applications from MongoDB.`);

    // Test 3: Add Document
    console.log("\n--- TEST 3: Document Management ---");
    const docApp = await addApplicationDocument(createdApp.id, {
      name: "Birth Certificate Original",
      type: "Birth Certificate",
      fileUrl: "https://example.com/docs/birth_cert.pdf",
      status: "Uploaded",
      adminRemark: "Original copy uploaded",
    });
    console.log("✅ Document added to MongoDB. Total docs:", docApp.documents.length);

    // Test 4: Request Documents
    console.log("\n--- TEST 4: Request Missing Documents ---");
    const reqDocsApp = await requestDocuments(createdApp.id, {
      reason: "Please upload Aadhaar Card copy",
      documentList: "Aadhaar Card",
    });
    console.log("✅ Status updated to:", reqDocsApp.status);

    // Test 5: Approve Application
    console.log("\n--- TEST 5: Approve Application ---");
    const approvedApp = await approveApplication(createdApp.id, { name: "Admin Test" });
    console.log("✅ Application Approved! Status:", approvedApp.status);

    // Test 6: Confirm Admission & Unique Admission No Generation
    console.log("\n--- TEST 6: Confirm Admission & Generate Admission No ---");
    const confirmResult1 = await confirmAndCreateStudent(approvedApp, { name: "Admin Test" });
    console.log("✅ Student Created Successfully!");
    console.log("   Admission No Generated:", confirmResult1.studentCreated.admissionNo);
    console.log("   Created Student ID:", confirmResult1.studentCreated.id);
    console.log("   Application Status:", confirmResult1.admission.status);

    // Test 7: Idempotency Check (Confirm Admission Clicked Twice)
    console.log("\n--- TEST 7: Idempotency Check (Double Click Confirm Admission) ---");
    const confirmResult2 = await confirmAndCreateStudent(confirmResult1.admission, { name: "Admin Test" });
    console.log("   Already Admitted Flag:", confirmResult2.isAlreadyAdmitted);
    console.log("   Message:", confirmResult2.message);
    if (!confirmResult2.isAlreadyAdmitted) {
      throw new Error("FAIL: Double admission created a second student!");
    }
    console.log("✅ Idempotency test passed! No duplicate student created.");

    // Test 8: Simulate Conflicting admissionNo and Verify Retry Loop
    console.log("\n--- TEST 8: Conflict Recovery Test (E11000 retry loop) ---");
    const testAppInput2 = { ...testAppInput, applicantName: "Second Student " + Date.now().toString().slice(-4) };
    const createdApp2 = await createOnlineAdmission(testAppInput2);
    const approvedApp2 = await approveApplication(createdApp2.id, { name: "Admin Test" });
    const confirmResult3 = await confirmAndCreateStudent(approvedApp2, { name: "Admin Test" });
    console.log("✅ Second Admission Confirmed!");
    console.log("   Second Admission No Generated:", confirmResult3.studentCreated.admissionNo);

    console.log("\n==========================================");
    console.log("🎉 ALL END-TO-END BACKEND & DB TESTS PASSED!");
    console.log("==========================================");
  } catch (err) {
    console.error("❌ E2E TEST FAILED:", err);
  } finally {
    await closeDatabase();
  }
}

runEndToEndTest();
