/**
 * Single source of truth for company-level content.
 *
 * Everything that used to be hard-coded across pages (emails, taglines, legal
 * language) lives here so it changes in one place.
 */

export const siteConfig = {
  name: 'TOWSTER Corporation',
  shortName: 'TOWSTER',
  url: 'https://www.towstercorp.com',

  // POSITIONING NOTE: the previous site led with "Mobile Hyperbaric Solutions."
  // The current deck describes a normobaric, thermoregulated CASEVAC pod with
  // closed-loop life support, with an HBOT hood as one configuration. The copy
  // below follows the deck. See README-UPGRADE.md before reverting.
  tagline: 'Autonomous casualty evacuation and en route life support',
  description:
    'TOWSTER Corporation builds a platform-agnostic CASEVAC pod that keeps a critical casualty alive in transit — thermoregulation, life support, and continuous telemetry across sea, ground, and air.',
  founded: 2023,
} as const

/**
 * Public addresses. Note the lowercase domain: mail is case-insensitive, but
 * mixed case in a mailto: link reads as a typo and some clients mangle it.
 */
export const contactEmails = [
  {
    label: 'General',
    email: 'info@towstercorp.com',
    note: 'Reaches the full leadership team.',
  },
  {
    label: 'Government & defense',
    email: 'gov@towstercorp.com',
    note: 'Program offices, SBIR/STTR, contracting.',
  },
  {
    label: 'Investment & partnerships',
    email: 'partnerships@towstercorp.com',
    note: 'Platform integration, suppliers, capital.',
  },
  {
    label: 'Press',
    email: 'press@towstercorp.com',
    note: 'Interviews, imagery, media kit.',
  },
] as const

/**
 * Contact-form categories. The `id` picks a recipient list in the API route —
 * keep these in sync with the CONTACT_TO_* environment variables.
 */
export const inquiryTypes = [
  { id: 'general', label: 'General inquiry' },
  { id: 'government', label: 'Government or defense program' },
  { id: 'partnership', label: 'Platform integration or supplier' },
  { id: 'investment', label: 'Investment' },
  { id: 'clinical', label: 'Clinical or research collaboration' },
  { id: 'press', label: 'Press' },
  { id: 'careers', label: 'Careers' },
] as const

export type InquiryTypeId = (typeof inquiryTypes)[number]['id']
export const inquiryTypeIds = inquiryTypes.map((t) => t.id) as InquiryTypeId[]

/**
 * Regulatory and export-control language.
 *
 * REVIEW BEFORE LAUNCH: counsel should confirm both notices match your actual
 * posture. The investigational-device notice matters because the site
 * describes clinical capability for a device that is not cleared.
 */
export const legalNotices = {
  investigational:
    'The TOWSTER Pod is a developmental system. It is not cleared or approved by the U.S. Food and Drug Administration, is not available for sale, and is not for human occupancy in its current demonstration configuration. Descriptions on this site are design intent, not claims of safety or effectiveness.',
  exportControl:
    'This site publishes only material approved for public release. No export-controlled technical data (ITAR 22 CFR 120–130, EAR 15 CFR 730–774) appears here. Controlled technical discussion happens under an executed NDA and applicable export authorization.',
  patent: 'TOWSTER Pod technology is patent pending.',
} as const