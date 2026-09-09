// Client-side WhatsApp helper service

export function normalizePhoneNumber(phone) {
  if (!phone) return null;
  let cleaned = String(phone).trim().replace(/[^\d+]/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = `91${cleaned}`;
  }
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null;
  }
  return cleaned;
}

export function isValidWhatsAppNumber(phone) {
  return !!normalizePhoneNumber(phone);
}

export function generateWhatsAppLink(phone, message) {
  const encodedMsg = encodeURIComponent(message || "");
  if (phone) {
    const normalized = normalizePhoneNumber(phone);
    if (normalized) {
      return `https://wa.me/${normalized}?text=${encodedMsg}`;
    }
  }
  // If no specific phone number, use universal WhatsApp share URL
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
