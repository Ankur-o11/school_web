// Client-side WhatsApp helper service

export function normalizePhoneNumber(phone) {
  if (!phone) return null;

  // Convert to string and strip all non-digit characters
  let digits = String(phone).trim().replace(/\D/g, "");

  if (!digits) return null;

  // Case A: Leading '0' (e.g. 09876543210 -> 11 digits starting with 0)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.substring(1);
  }

  // Case B: 10 digits starting with valid Indian mobile prefix (6, 7, 8, 9)
  if (digits.length === 10 && /^[6789]\d{9}$/.test(digits)) {
    return `91${digits}`;
  }

  // Case C: 12 digits starting with '91' and valid 10-digit Indian mobile (6, 7, 8, 9)
  if (digits.length === 12 && digits.startsWith("91") && /^91[6789]\d{9}$/.test(digits)) {
    return digits;
  }

  // Case D: General 10-digit fallback
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // Case E: International numbers (11 to 15 digits)
  if (digits.length >= 11 && digits.length <= 15) {
    return digits;
  }

  return null;
}

export function isValidWhatsAppNumber(phone) {
  return !!normalizePhoneNumber(phone);
}

export function generateWhatsAppLink(phone, message) {
  const normalized = normalizePhoneNumber(phone);
  const encodedMsg = encodeURIComponent(message || "");
  if (normalized) {
    return `https://wa.me/${normalized}?text=${encodedMsg}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedMsg}`;
}

export function compileTemplate(templateStr, variables = {}) {
  if (!templateStr) return "";
  return templateStr.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined && variables[key] !== null
      ? String(variables[key])
      : match;
  });
}
