import site from '../data/site.js'

/**
 * Normalise an Indian mobile number typed in any of the usual ways:
 *   9047950974 · 90479 50974 · +91 90479-50974 · 0 9047950974 · 919047950974
 * Returns the bare 10 digits, or null when it is not a valid Indian mobile.
 */
export function normalisePhone(input) {
  const digits = String(input || '').replace(/\D/g, '')
  let local = digits

  if (local.length === 12 && local.startsWith('91')) local = local.slice(2)
  else if (local.length === 11 && local.startsWith('0')) local = local.slice(1)
  else if (local.length === 13 && local.startsWith('091')) local = local.slice(3)

  return /^[6-9]\d{9}$/.test(local) ? local : null
}

export function formatPhone(local) {
  return local ? '+91 ' + local.slice(0, 5) + ' ' + local.slice(5) : ''
}

/**
 * Build the enquiry message exactly as it should arrive in WhatsApp.
 * The Message line always appears; it shows "-" when left empty.
 */
export function buildEnquiryMessage({ name, phone, service, message }) {
  const lines = [
    'Hi Akash, I found your website and want to connect.',
    '',
    'Name: ' + String(name || '').trim(),
    'Phone: ' + String(phone || '').trim(),
    'Service: ' + String(service || '').trim(),
    'Message: ' + (String(message || '').trim() || '-'),
  ]
  return lines.join('\n')
}

/** Full wa.me deep link for an enquiry. Works on mobile app and WhatsApp Web. */
export function buildEnquiryUrl(values) {
  return 'https://wa.me/' + site.phoneIntl + '?text=' + encodeURIComponent(buildEnquiryMessage(values))
}
