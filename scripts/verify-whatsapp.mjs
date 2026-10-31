/* Verifies the WhatsApp deep link for every service + phone-format edge cases. */
import { buildEnquiryMessage, buildEnquiryUrl, normalisePhone, formatPhone } from '../src/lib/whatsapp.js'
import { serviceOptions } from '../src/data/services.js'

// serviceOptions are {value,label,icon} objects so the dropdown can show icons
const serviceNames = serviceOptions.map((o) => o.value)

let fail = 0
const expectBase = 'https://wa.me/919047950974?text='

console.log('--- phone normalisation ---')
const cases = [
  ['9047950974', '9047950974'],
  ['90479 50974', '9047950974'],
  ['+91 90479-50974', '9047950974'],
  ['919047950974', '9047950974'],
  ['09047950974', '9047950974'],
  ['+91 (90479) 50974', '9047950974'],
  ['1234567890', null],
  ['904795097', null],
  ['abcd', null],
]
for (const [input, expected] of cases) {
  const got = normalisePhone(input)
  const ok = got === expected
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${JSON.stringify(input).padEnd(22)} -> ${got}`)
}

console.log('\n--- one URL per service ---')
for (const service of serviceNames) {
  const url = buildEnquiryUrl({
    name: 'Ravi Kumar',
    phone: formatPhone(normalisePhone('+91 90479 50974')),
    service,
    message: '',
  })
  const ok = url.startsWith(expectBase) && decodeURIComponent(url.split('text=')[1]).includes('Service: ' + service)
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${service}`)
}

console.log('\n--- message template (empty message) ---')
console.log(buildEnquiryMessage({ name: 'Ravi Kumar', phone: '+91 90479 50974', service: 'SEO', message: '' }))
console.log('\n--- message template (with message) ---')
console.log(buildEnquiryMessage({ name: 'Ravi Kumar', phone: '+91 90479 50974', service: 'E-commerce', message: 'Need a store for my shop.' }))
console.log('\n--- sample full URL ---')
console.log(buildEnquiryUrl({ name: 'Ravi Kumar', phone: '+91 90479 50974', service: 'Website Development', message: 'Need it before Diwali' }))

console.log(fail === 0 ? '\nALL CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`)
process.exit(fail === 0 ? 0 : 1)
