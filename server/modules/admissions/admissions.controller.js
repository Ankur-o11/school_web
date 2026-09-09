import {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateChecklist,
  updateAdmissionStatus,
  confirmAndCreateStudent,
} from "./admissions.service.js";

// GET /api/admissions
export async function listAdmissions(req, res) {
  try {
    const data = await getAllAdmissions(req.query);
    res.json({
      success: true,
      admissions: data,
    });
  } catch (error) {
    console.error("listAdmissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admissions",
      error: error.message,
    });
  }
}

// GET /api/admissions/public/:id
export async function getPublicAdmission(req, res) {
  try {
    const admission = await getAdmissionById(req.params.id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission application not found",
      });
    }

    res.json({
      success: true,
      admission,
    });
  } catch (error) {
    console.error("getPublicAdmission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admission details",
      error: error.message,
    });
  }
}

// GET /api/admissions/:id
export async function getAdmission(req, res) {
  try {
    const admission = await getAdmissionById(req.params.id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission application not found",
      });
    }

    res.json({
      success: true,
      admission,
    });
  } catch (error) {
    console.error("getAdmission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admission details",
      error: error.message,
    });
  }
}

// POST /api/admissions
export async function addAdmission(req, res) {
  try {
    const admission = await createAdmission(req.body);
    const host = req.headers.host || "school-web-rouge-nine.vercel.app";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const parentTrackingLink = `${protocol}://${host}/admission-status/${admission.applicationNo}`;

    res.status(201).json({
      success: true,
      message: "Admission application registered successfully",
      admission,
      parentTrackingLink,
    });
  } catch (error) {
    console.error("addAdmission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register admission",
      error: error.message,
    });
  }
}

// PUT /api/admissions/:id/checklist
export async function updateAdmissionChecklist(req, res) {
  try {
    const admission = await updateChecklist(req.params.id, req.body);
    res.json({
      success: true,
      message: "Admission checklist updated",
      admission,
    });
  } catch (error) {
    console.error("updateAdmissionChecklist:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update checklist",
    });
  }
}

// PUT /api/admissions/:id/status
export async function changeAdmissionStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await updateAdmissionStatus(req.params.id, status);
    res.json({
      success: true,
      message: "Admission status updated",
      result,
    });
  } catch (error) {
    console.error("changeAdmissionStatus:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update status",
    });
  }
}

// POST /api/admissions/:id/confirm
export async function confirmAdmission(req, res) {
  try {
    const admission = await getAdmissionById(req.params.id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission record not found",
      });
    }

    const result = await confirmAndCreateStudent(admission);
    res.json({
      success: true,
      message: "Admission confirmed and Student automatically created!",
      ...result,
    });
  } catch (error) {
    console.error("confirmAdmission:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm admission and create student",
    });
  }
}

// POST /api/admissions/:id/whatsapp-reminder
export async function sendWhatsAppReminder(req, res) {
  try {
    const admission = await getAdmissionById(req.params.id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission record not found",
      });
    }

    const pendingList = admission.pendingItems.length > 0
      ? admission.pendingItems.join(", ")
      : "None";

    const host = req.headers.host || "school-web-rouge-nine.vercel.app";
    const trackingLink = `https://${host}/admission-status/${admission.applicationNo}`;

    const message = `Dear ${admission.parentName}, greetings from MPSA School! 🎓\n\nRegarding ${admission.applicantName}'s Admission (${admission.applicationNo}):\n\n📌 Pending Items: ${pendingList}\n\nPlease submit pending documents/fees to complete the admission.\n\n🔗 View Admission Status & Upload: ${trackingLink}\n\nThank you!\nMPSA School Admissions`;

    const normalizedPhone = (admission.parentPhone || "").replace(/\D/g, "");
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${normalizedPhone}&text=${encodeURIComponent(message)}`;

    res.json({
      success: true,
      message: "WhatsApp reminder link generated",
      whatsappUrl,
      reminderMessage: message,
      trackingLink,
    });
  } catch (error) {
    console.error("sendWhatsAppReminder:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate reminder",
    });
  }
}
