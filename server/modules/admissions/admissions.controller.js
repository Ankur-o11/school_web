import {
  getAllAdmissions,
  getAdmissionById,
  getAdmissionByTrackingToken,
  createAdmission,
  createOnlineAdmission,
  updateOnlineApplicationByToken,
  requestCorrection,
  updateChecklist,
  updateAdmissionStatus,
  confirmAndCreateStudent,
  setAdmissionsDatabase,
} from "./admissions.service.js";

export { setAdmissionsDatabase };

// GET /api/admissions
export async function listAdmissions(req, res) {
  try {
    const list = await getAllAdmissions(req.query);
    res.json({
      success: true,
      data: list,
      admissions: list,
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
      data: admission,
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

// GET /api/admissions/track/:token
export async function getPublicAdmissionByToken(req, res) {
  try {
    const { token } = req.params;
    let admission = await getAdmissionByTrackingToken(token);
    if (!admission) {
      admission = await getAdmissionById(token);
    }

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Application record not found for the provided token",
      });
    }

    // Mask sensitive details for public parent view
    const publicView = {
      applicationId: admission.applicationId,
      applicationNo: admission.applicationNo,
      trackingToken: admission.trackingToken,
      applicantName: admission.applicantName,
      appliedClass: admission.appliedClass,
      academicSession: admission.academicSession,
      parentName: admission.parentName,
      appliedDate: admission.appliedDate,
      status: admission.status,
      checklist: admission.checklist,
      pendingItems: admission.pendingItems,
      correctionRequired: admission.correctionRequired,
      correctionNotes: admission.correctionNotes,
      createdStudentId: admission.createdStudentId,
      createdAdmissionNo: admission.createdAdmissionNo,
      // Allowed correction fields
      gender: admission.gender,
      dob: admission.dob,
      parentPhone: admission.parentPhone,
      email: admission.email,
      address: admission.address,
      city: admission.city,
      state: admission.state,
      pincode: admission.pincode,
      prevSchool: admission.prevSchool,
    };

    res.json({
      success: true,
      data: publicView,
      admission: publicView,
    });
  } catch (error) {
    console.error("getPublicAdmissionByToken:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load application details",
      error: error.message,
    });
  }
}

// POST /api/admissions/online (Public Self-Registration)
export async function registerOnlineAdmission(req, res) {
  try {
    const admission = await createOnlineAdmission(req.body);
    const host = req.headers.host || "school-web-rouge-nine.vercel.app";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const trackingLink = `${protocol}://${host}/admission-status/${admission.trackingToken}`;

    res.status(201).json({
      success: true,
      message: "Online admission application submitted successfully!",
      data: admission,
      admission,
      trackingLink,
    });
  } catch (error) {
    console.error("registerOnlineAdmission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit online admission application",
      error: error.message,
    });
  }
}

// PATCH /api/admissions/track/:token (Public parent correction submission)
export async function updateOnlineAdmission(req, res) {
  try {
    const { token } = req.params;
    const admission = await updateOnlineApplicationByToken(token, req.body);
    res.json({
      success: true,
      message: "Application details updated successfully!",
      data: admission,
      admission,
    });
  } catch (error) {
    console.error("updateOnlineAdmission:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update application",
    });
  }
}

// PATCH /api/admissions/:id/request-correction (Admin action)
export async function handleRequestCorrection(req, res) {
  try {
    const { notes } = req.body;
    const admission = await requestCorrection(req.params.id, notes);
    res.json({
      success: true,
      message: "Correction request sent to applicant",
      data: admission,
      admission,
    });
  } catch (error) {
    console.error("handleRequestCorrection:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to request correction",
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
      data: admission,
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
    const parentTrackingLink = `${protocol}://${host}/admission-status/${admission.trackingToken || admission.applicationNo}`;

    res.status(201).json({
      success: true,
      message: "Admission application registered successfully",
      data: admission,
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

// PUT/PATCH /api/admissions/:id/checklist
export async function updateAdmissionChecklist(req, res) {
  try {
    const admission = await updateChecklist(req.params.id, req.body.checklist || req.body);
    res.json({
      success: true,
      message: "Admission checklist updated",
      data: admission,
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

// PUT/PATCH /api/admissions/:id/status
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
      data: result,
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
      data: result.admission,
    });
  } catch (error) {
    console.error("confirmAdmission:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm admission and create student",
    });
  }
}

// POST/GET /api/admissions/:id/whatsapp-reminder
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
    const trackingLink = `https://${host}/admission-status/${admission.trackingToken || admission.applicationNo}`;

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
