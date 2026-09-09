// Helper utility for WhatsApp phone normalization, deep links, and template compilation

export function normalizePhoneNumber(phone) {
  if (!phone) return null;

  // Strip all non-digit characters except leading +
  let cleaned = String(phone).trim().replace(/[^\d+]/g, "");

  if (!cleaned) return null;

  // Handle + prefix
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // If 10 digits (Standard Indian mobile number), prepend country code 91
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = `91${cleaned}`;
  }

  // Basic length validation (10 to 15 digits)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null; // Invalid length
  }

  return cleaned;
}

export function generateWhatsAppLink(phone, message) {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return null;

  const encodedMsg = encodeURIComponent(message || "");
  return `https://wa.me/${normalized}?text=${encodedMsg}`;
}

export function compileTemplate(templateStr, variables = {}) {
  if (!templateStr) return "";

  return templateStr.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined && variables[key] !== null
      ? String(variables[key])
      : match;
  });
}
