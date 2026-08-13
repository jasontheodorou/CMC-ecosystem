export type Dept = 'dwp' | 'hmrc' | 'hmpo' | 'driving' | 'civic'

export const DEPTS: Record<Dept, { label: string; color: string; soft: string }> = {
  dwp: { label: 'DWP', color: '#3b82f6', soft: '#dbeafe' },
  hmrc: { label: 'HMRC', color: '#14b8a6', soft: '#ccfbf1' },
  hmpo: { label: 'Passport Office', color: '#8b5cf6', soft: '#ede9fe' },
  driving: { label: 'DVLA / DVSA', color: '#f59e0b', soft: '#fef3c7' },
  civic: { label: 'Civic', color: '#f43f5e', soft: '#ffe4e6' },
}

export const ORGANISATIONS = ['GDS', 'HMCTS'] as const
export type Organisation = (typeof ORGANISATIONS)[number]

export const PARTIES = ['Claimant', 'Defendant'] as const
export type Party = (typeof PARTIES)[number]

export interface Service {
  id: string
  name: string
  dept: Dept
  url: string
  summary: string
  position: { x: number; y: number }
  organisation?: Organisation
  party?: Party
}

// World layout composed at 16:9 aspect (x span ~1600, y span ~900) so it feels right
// both on desktop and inside a 16:9 Miro embed. Spread lengthways, tighter vertically.
export const SERVICES: Service[] = [
  { id: 'uc',            name: 'Universal Credit',         dept: 'dwp',     url: 'https://www.gov.uk/universal-credit',                    summary: 'Monthly support for living costs if you’re on a low income or out of work.', position: { x: 250,  y: 230 } },
  { id: 'state-pension', name: 'Check your State Pension', dept: 'dwp',     url: 'https://www.gov.uk/check-state-pension',                summary: 'See how much State Pension you could get, when, and how to increase it.',    position: { x: 120,  y: 505 } },
  { id: 'find-a-job',    name: 'Find a job',               dept: 'dwp',     url: 'https://www.gov.uk/find-a-job',                          summary: 'Search and apply for jobs across the UK.',                                    position: { x: 300,  y: 800 } },

  { id: 'ptax',          name: 'Personal tax account',     dept: 'hmrc',    url: 'https://www.gov.uk/personal-tax-account',               summary: 'Manage your tax records, check your Income Tax, and update HMRC.',            position: { x: 780,  y: 195 } },
  { id: 'marriage',      name: 'Marriage Allowance',       dept: 'hmrc',    url: 'https://www.gov.uk/marriage-allowance',                 summary: 'Transfer part of your Personal Allowance to your spouse or civil partner.',   position: { x: 1020, y: 490 } },
  { id: 'childcare',     name: 'Childcare account',        dept: 'hmrc',    url: 'https://www.gov.uk/sign-in-childcare-account',          summary: 'Manage Tax-Free Childcare and 30 hours free childcare.',                      position: { x: 760,  y: 785 } },

  { id: 'passport',      name: 'Renew adult passport',     dept: 'hmpo',    url: 'https://www.gov.uk/renew-adult-passport',               summary: 'Renew a UK adult passport online or by post.',                                position: { x: 1440, y: 160 } },
  { id: 'lost-passport', name: 'Report a lost passport',   dept: 'hmpo',    url: 'https://www.gov.uk/report-a-lost-or-stolen-passport',   summary: 'Cancel a lost or stolen passport so it can’t be used.',                       position: { x: 1690, y: 435 } },

  { id: 'driving-test',  name: 'Book a driving test',      dept: 'driving', url: 'https://www.gov.uk/book-driving-test',                  summary: 'Book a practical driving test for a car.',                                    position: { x: 1480, y: 645 } },
  { id: 'mot',           name: 'Check MOT status',         dept: 'driving', url: 'https://www.gov.uk/check-mot-status',                   summary: 'Check the MOT status and history of a vehicle.',                              position: { x: 1720, y: 940 } },

  { id: 'vote',          name: 'Register to vote',         dept: 'civic',   url: 'https://www.gov.uk/register-to-vote',                   summary: 'Register to vote in UK elections and referendums.',                           position: { x: 1140, y: 905 } },
  { id: 'council-tax',   name: 'Council tax',              dept: 'civic',   url: 'https://www.gov.uk/council-tax',                        summary: 'Find your local council and pay your Council Tax.',                           position: { x: 640,  y: 1060 } },
]

// WordPress mShots screenshot proxy — free, cached server-side, no key required.
// Returns a placeholder for a few seconds on first hit for an unseen URL, then the real capture.
export function previewSrc(url: string, width = 480): string {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${width}`
}

export interface Relationship {
  source: string
  target: string
  label?: string
}

export const RELATIONSHIPS: Relationship[] = [
  { source: 'uc',            target: 'find-a-job',    label: 'work coach' },
  { source: 'uc',            target: 'council-tax',   label: 'support scheme' },
  { source: 'state-pension', target: 'uc',            label: 'income' },
  { source: 'ptax',          target: 'state-pension', label: 'NI record' },
  { source: 'ptax',          target: 'marriage',      label: 'tax code' },
  { source: 'ptax',          target: 'childcare',     label: 'HMRC sign-in' },
  { source: 'passport',      target: 'lost-passport' },
  { source: 'passport',      target: 'vote',          label: 'proof of ID' },
  { source: 'driving-test',  target: 'mot' },
  { source: 'vote',          target: 'council-tax',   label: 'address' },
  { source: 'ptax',          target: 'passport',      label: 'ID checks' },
]
