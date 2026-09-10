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
  approveApplication,
  rejectApplication,
  requestDocuments,
  addApplicationDocument,
  updateApplicationDocumentStatus,
  deleteApplicationDocument,
  triggerApplicationNotification,
  setAdmissionsDatabase,
} from "./admissions.service.js";

export { setAdmissionsDatabase };

/**
 * Friendly Error Handler Helper
 */
function handleServerError(res, err, defaultMsg) {
  console.error(`[Admissions Error] ${defaultMsg}:`, err);

  if (err.code === 11000 || (err.message && err.message.includes("E11000"))) {
    return res.status(400).json({
      success: false,
      message: "A record with this identifier or admission number already exists.",
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || defaultMsg,
  });
}

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
    handleServerError(res, error, "Failed to load admissions");
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
    handleServerError(res, error, "Failed to load admission details");
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
      documents: (admission.documents || []).map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        status: d.status,
        adminRemark: d.adminRemark,
        uploadedAt: d.uploadedAt,
      })),
      createdStudentId: admission.createdStudentId,
      createdAdmissionNo: admission.createdAdmissionNo,
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
    handleServerError(res, error, "Failed to load application details");
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
    handleServerError(res, error, "Failed to submit online admission application");
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
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update application",
    });
  }
}

// POST /api/admissions/:id/approve (Admin Approve)
export async function handleApproveApplication(req, res) {
  try {
    const admission = await approveApplication(req.params.id, req.user);
    res.json({
      success: true,
      message: `Application for ${admission.applicantName} has been Approved successfully!`,
      data: admission,
      admission,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to approve application");
  }
}

// POST /api/admissions/:id/reject (Admin Reject)
export async function handleRejectApplication(req, res) {
  try {
    const { reason } = req.body;
    const admission = await rejectApplication(req.params.id, reason, req.user);
    res.json({
      success: true,
      message: "Application status updated to Rejected.",
      data: admission,
      admission,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to reject application",
    });
  }
}

// POST /api/admissions/:id/request-documents (Admin Request Documents)
export async function handleRequestDocuments(req, res) {
  try {
    const { reason, documentList } = req.body;
    const admission = await requestDocuments(req.params.id, { reason, documentList }, req.user);
    res.json({
      success: true,
      message: "Document request and notification dispatched to applicant.",
      data: admission,
      admission,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to request documents");
  }
}

// POST /api/admissions/:id/documents (Add Document)
export async function handleAddDocument(req, res) {
  try {
    const admission = await addApplicationDocument(req.params.id, req.body, req.user);
    res.status(201).json({
      success: true,
      message: "Document added successfully",
      data: admission,
      admission,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to add document");
  }
}

// PATCH /api/admissions/:id/documents/:docId (Update Document Status)
export async function handleUpdateDocumentStatus(req, res) {
  try {
    const { docId } = req.params;
    const { status, adminRemark } = req.body;
    const admission = await updateApplicationDocumentStatus(req.params.id, docId, { status, adminRemark }, req.user);
    res.json({
      success: true,
      message: "Document status updated",
      data: admission,
      admission,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to update document status");
  }
}

// DELETE /api/admissions/:id/documents/:docId (Delete Document)
export async function handleDeleteDocument(req, res) {
  try {
    const { docId } = req.params;
    const admission = await deleteApplicationDocument(req.params.id, docId);
    res.json({
      success: true,
      message: "Document deleted",
      data: admission,
      admission,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to delete document");
  }
}

// POST /api/admissions/:id/resend-notification (Manual Resend WhatsApp / Email)
export async function handleResendNotification(req, res) {
  try {
    const { triggerType } = req.body; // app_received, app_approved, app_rejected, docs_required, admission_confirmed
    const admission = await getAdmissionById(req.params.id);
    if (!admission) {
      return res.status(404).json({ success: false, message: "Application record not found" });
    }

    const type = triggerType || "app_received";
    const result = await triggerApplicationNotification(admission, type, req.user);

    res.json({
      success: true,
      message: "Notification re-dispatched successfully!",
      ...result,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to resend notification");
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
    handleServerError(res, error, "Failed to load admission details");
  }
}

// POST /api/admissions
export async function addAdmission(req, res) {
  try {
    const admission = await createAdmission(req.body, req.user);
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
    handleServerError(res, error, "Failed to register admission");
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
    handleServerError(res, error, "Failed to update checklist");
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

    const result = await updateAdmissionStatus(req.params.id, status, req.user);
    res.json({
      success: true,
      message: "Admission status updated",
      data: result,
      result,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to update status");
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

    const result = await confirmAndCreateStudent(admission, req.user);

    if (result.isAlreadyAdmitted) {
      return res.status(400).json({
        success: false,
        message: "This application has already been admitted.",
        data: result.admission,
        studentCreated: result.studentCreated,
      });
    }

    res.json({
      success: true,
      message: "Admission confirmed and Student officially created!",
      ...result,
      data: result.admission,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to confirm admission and create student");
  }
}

// Legacy endpoint wrapper
export async function handleRequestCorrection(req, res) {
  try {
    const { notes } = req.body;
    const admission = await requestCorrection(req.params.id, notes, req.user);
    res.json({
      success: true,
      message: "Correction request sent to applicant",
      data: admission,
      admission,
    });
  } catch (error) {
    handleServerError(res, error, "Failed to request correction");
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

    const pendingList = admission.pendingItems && admission.pendingItems.length > 0
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
    handleServerError(res, error, "Failed to generate reminder");
  }
}
