/**
 * Generates a VCard 3.0 string from a contact object.
 * @param {Object} contact
 * @param {string} contact.firstName
 * @param {string} contact.lastName
 * @param {string} contact.organization
 * @param {string} contact.position
 * @param {string} contact.phoneWork
 * @param {string} contact.phoneMobile
 * @param {string} contact.email
 * @param {string} contact.website
 * @param {string} contact.street
 * @param {string} contact.city
 * @param {string} contact.zip
 * @param {string} contact.country
 * @returns {string} VCard string
 */
export const generateVCard = (contact) => {
    const {
        firstName = '',
        lastName = '',
        organization = '',
        position = '',
        phoneWork = '',
        phoneMobile = '',
        email = '',
        website = '',
        street = '',
        city = '',
        zip = '',
        country = ''
    } = contact;

    // Basic VCard 3.0 structure
    const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName};${firstName};;;`,
        `FN:${firstName} ${lastName}`,
        organization ? `ORG:${organization}` : '',
        position ? `TITLE:${position}` : '',
        phoneWork ? `TEL;TYPE=WORK,VOICE:${phoneWork}` : '',
        phoneMobile ? `TEL;TYPE=CELL,VOICE:${phoneMobile}` : '',
        email ? `EMAIL;TYPE=PREF,INTERNET:${email}` : '',
        website ? `URL:${website}` : '',
        (street || city || zip || country)
            ? `ADR;TYPE=WORK:;;${street};${city};;${zip};${country}`
            : '',
        'END:VCARD'
    ].filter(Boolean).join('\n');

    return vcard;
};
