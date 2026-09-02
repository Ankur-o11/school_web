// =====================================================
// MPSA SCHOOL
// FEES SERVICE
// =====================================================

import { ObjectId } from "mongodb";
import {
  FEES_COLLECTION,
  createFeeDocument,
} from "./fees.model.js";

const STUDENTS_COLLECTION = "students";

function toObjectId(id) {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error("Invalid student ID");
  }

  return new ObjectId(id);
}

function getAcademicYear() {
  return (
    process.env.ACADEMIC_YEAR ||
    `${new Date().getFullYear()}-${String(
      new Date().getFullYear() + 1
    ).slice(-2)}`
  );
}

// =====================================================
// GET STUDENTS WITH FEES
// =====================================================

export async function getStudentsWithFees(db, filters = {}) {
  const studentsCollection = db.collection(STUDENTS_COLLECTION);
  const feesCollection = db.collection(FEES_COLLECTION);

  const students = await studentsCollection
    .find({})
    .sort({ name: 1 })
    .toArray();

  const academicYear =
    filters.academicYear || getAcademicYear();

  const result = [];

  for (const student of students) {
    const fee = await feesCollection.findOne({
      studentId: student._id,
      academicYear,
    });

    const feeData =
      fee ||
      createFeeDocument({
        studentId: student._id,
        academicYear,
        totalFees: 0,
        discount: 0,
      });

    const payments = feeData.payments || [];

    const paid = payments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );

    const totalFees = Number(
      feeData.totalFees || 0
    );

    const discount = Number(
      feeData.discount || 0
    );

    const netFees = totalFees - discount;

    const pending = Math.max(
      netFees - paid,
      0
    );

    result.push({
      id: student._id.toString(),

      name:
        student.name ||
        student.studentName ||
        "",

      fatherName:
        student.fatherName ||
        student.father ||
        "",

      className:
        student.className ||
        student.class ||
        "",

      section:
        student.section || "",

      roll:
        student.roll ||
        student.rollNo ||
        "",

      address:
        student.address || "",

      totalFees,
      discount,
      netFees,
      paid,
      pending,

      payments,

      academicYear,
    });
  }

  return result;
}

// =====================================================
// GET SINGLE STUDENT FEE
// =====================================================

export async function getStudentFees(
  db,
  studentId,
  academicYear = getAcademicYear()
) {
  const studentsCollection =
    db.collection(STUDENTS_COLLECTION);

  const feesCollection =
    db.collection(FEES_COLLECTION);

  const objectId = toObjectId(studentId);

  const student =
    await studentsCollection.findOne({
      _id: objectId,
    });

  if (!student) {
    throw new Error("Student not found");
  }

  const fee =
    await feesCollection.findOne({
      studentId: objectId,
      academicYear,
    });

  const feeData =
    fee ||
    createFeeDocument({
      studentId: objectId,
      academicYear,
      totalFees: 0,
      discount: 0,
    });

  const payments =
    feeData.payments || [];

  const paid = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const totalFees =
    Number(feeData.totalFees) || 0;

  const discount =
    Number(feeData.discount) || 0;

  const netFees =
    totalFees - discount;

  const pending = Math.max(
    netFees - paid,
    0
  );

  return {
    id: student._id.toString(),

    name:
      student.name ||
      student.studentName ||
      "",

    fatherName:
      student.fatherName ||
      student.father ||
      "",

    className:
      student.className ||
      student.class ||
      "",

    section:
      student.section || "",

    roll:
      student.roll ||
      student.rollNo ||
      "",

    address:
      student.address || "",

    totalFees,
    discount,
    netFees,
    paid,
    pending,

    payments,

    academicYear,
  };
}

// =====================================================
// CREATE / UPDATE FEE STRUCTURE
// =====================================================

export async function updateStudentFees(
  db,
  studentId,
  data
) {
  const feesCollection =
    db.collection(FEES_COLLECTION);

  const objectId = toObjectId(studentId);

  const academicYear =
    data.academicYear || getAcademicYear();

  const update = {
    updatedAt: new Date(),
  };

  if (data.totalFees !== undefined) {
    update.totalFees =
      Number(data.totalFees) || 0;
  }

  if (data.discount !== undefined) {
    update.discount =
      Number(data.discount) || 0;
  }

  const result =
    await feesCollection.findOneAndUpdate(
      {
        studentId: objectId,
        academicYear,
      },
      {
        $set: update,

        $setOnInsert: {
          studentId: objectId,
          academicYear,
          payments: [],
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

  return result;
}

// =====================================================
// ADD PAYMENT
// =====================================================

export async function addPayment(
  db,
  studentId,
  data
) {
  const feesCollection =
    db.collection(FEES_COLLECTION);

  const objectId = toObjectId(studentId);

  const academicYear =
    data.academicYear || getAcademicYear();

  const amount = Number(data.amount);

  if (!amount || amount <= 0) {
    throw new Error(
      "Payment amount must be greater than 0"
    );
  }

  // ---------------------------------------------
  // Get current fee record
  // ---------------------------------------------

  let fee =
    await feesCollection.findOne({
      studentId: objectId,
      academicYear,
    });

  if (!fee) {
    await feesCollection.insertOne(
      createFeeDocument({
        studentId: objectId,
        academicYear,
        totalFees:
          Number(data.totalFees) || 0,
        discount:
          Number(data.discount) || 0,
      })
    );

    fee =
      await feesCollection.findOne({
        studentId: objectId,
        academicYear,
      });
  }

  const totalFees =
    Number(fee.totalFees) || 0;

  const discount =
    data.discount !== undefined
      ? Number(data.discount) || 0
      : Number(fee.discount) || 0;

  const payments =
    fee.payments || [];

  const paid = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const pending =
    totalFees - discount - paid;

  if (amount > pending) {
    throw new Error(
      `Maximum pending amount is ₹${pending.toLocaleString(
        "en-IN"
      )}`
    );
  }

  // ---------------------------------------------
  // Receipt number
  // ---------------------------------------------

  const receiptNo =
    "MPSA-" +
    Date.now().toString().slice(-8);

  const now = new Date();

  const payment = {
    paymentId:
      new ObjectId().toString(),

    receiptNo,

    amount,

    mode:
      data.mode || "Cash",

    date: now.toISOString(),

    createdAt: now,
  };

  // ---------------------------------------------
  // Save payment
  // ---------------------------------------------

  await feesCollection.updateOne(
    {
      studentId: objectId,
      academicYear,
    },
    {
      $set: {
        discount,
        updatedAt: new Date(),
      },

      $push: {
        payments: payment,
      },
    }
  );

  return payment;
}

// =====================================================
// STATS
// =====================================================

export async function getFeesStats(
  db,
  academicYear = getAcademicYear()
) {
  const students =
    await getStudentsWithFees(
      db,
      { academicYear }
    );

  return {
    totalStudents:
      students.length,

    totalFees:
      students.reduce(
        (sum, student) =>
          sum + student.totalFees,
        0
      ),

    totalDiscount:
      students.reduce(
        (sum, student) =>
          sum + student.discount,
        0
      ),

    totalCollected:
      students.reduce(
        (sum, student) =>
          sum + student.paid,
        0
      ),

    totalPending:
      students.reduce(
        (sum, student) =>
          sum + student.pending,
        0
      ),
  };
}