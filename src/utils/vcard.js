export function generateVCard(contact = {}) {
  const first = contact['Firstname'] || ''
  const last = contact['Lastname'] || ''
  const org = contact['Organization'] || ''
  const title = contact['Position (Work)'] || ''
  const telWork = contact['Phone (Work)'] || ''
  const telMobile = contact['Phone (Mobile)'] || ''
  const email = contact['Email'] || ''
  const street = contact['Street'] || ''
  const zipcode = contact['Zipcode'] || ''
  const city = contact['City'] || ''

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${last};${first};;;`,
    `FN:${first} ${last}`.trim(),
  ]

  if (org) lines.push(`ORG:${org}`)
  if (title) lines.push(`TITLE:${title}`)
  if (telWork) lines.push(`TEL;TYPE=WORK,VOICE:${telWork}`)
  if (telMobile) lines.push(`TEL;TYPE=CELL,VOICE:${telMobile}`)
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`)
  if (street || city || zipcode) {
    lines.push(`ADR;TYPE=WORK:;;${street};${city};;${zipcode};`)
  }

  lines.push('END:VCARD')
  return lines.join('\n')
}
