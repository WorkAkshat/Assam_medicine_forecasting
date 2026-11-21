/**
 * GRD Pharmaceuticals & Dhanuka Group Company Data
 * Single Source of Truth for corporate details, offices, awards, and verticals.
 */

export const COMPANY_INFO = {
  name: 'GRD Pharmaceuticals',
  tagline: 'A Unit of Dhanuka Group',
  foundedYear: '2006',
  groupFounded: 'Over 100 Years of Heritage',
  headquarters: 'Guwahati, Assam, India',
  phonePrimary: '+91-9706001000',
  phoneSecondary: '+91-7099071000',
  phoneFactory: '+91-9435732217',
  landline: '0361-2473924',
  email: 'mail@grdpharma.in',
  website: 'https://grdpharma.in',
  workingHours: 'Mon – Sat: 9:30 AM – 6:30 PM (IST)',
  certifications: ['cGMP Certified Unit', 'ISO 9001:2015 QMS', 'NABL Tested Batches']
};

export const OFFICE_LOCATIONS = [
  {
    id: 'head-office',
    type: 'Head Office',
    city: 'Guwahati',
    badge: 'Corporate HQ',
    address: 'Dhanuka Complex, Block-B, Sati Joymati Road, Athgaon, Guwahati, Kamrup (M), Assam',
    pin: '781001',
    mobiles: ['+91-97060 01000', '+91-70990 71000'],
    landline: '0361-2473924',
    email: 'mail@grdpharma.in',
    lat: 26.1775,
    lng: 91.7397
  },
  {
    id: 'branch-office',
    type: 'Branch Office',
    city: 'New Delhi',
    badge: 'National Liaison',
    address: 'R-193, Greater Kailash Part 1, New Delhi',
    pin: '110048',
    mobiles: ['+91-70990 01000', '+91-98641 01000'],
    email: 'delhi@grdpharma.in',
    lat: 28.5535,
    lng: 77.2345
  },
  {
    id: 'factory',
    type: 'Factory Address',
    city: 'Rani, Assam',
    badge: 'cGMP Manufacturing',
    address: 'GRD Pharmaceuticals, D-15, Rani Industrial Area, Rani, Kamrup, Assam',
    pin: '781131',
    mobiles: ['+91-94357 32217', '+91-94354 01000'],
    email: 'factory@grdpharma.in',
    lat: 26.0645,
    lng: 91.5622
  }
];

export const LEADERSHIP_AWARD = {
  year: '2020',
  awardName: 'TIMES STELLAR BRANDS AND ICONS (ASSAM AND NORTHEAST)',
  title: '“Visionary Leader in Assam and North East”',
  recipient: 'Mr. Ghanshyam Das Dhanuka',
  designation: 'Founding Partner, GRD Pharmaceuticals',
  conferredBy: 'The Times Group',
  summary: 'Conferred in recognition of transformative industrial leadership, advancing regional healthcare self-reliance, and setting pioneering pharmaceutical manufacturing benchmarks across Assam and the North-Eastern States of India.'
};

export const PARTNER_AWARDS = [
  {
    year: '2018–2019',
    awardName: 'BEST PERFORMANCE CERTIFICATE',
    title: 'Flawless Supply to 38 AMRIT Pharmacy Stores',
    recipient: 'GRD Pharmaceuticals',
    designation: 'All 38 Amrit Stores in the North-Eastern States',
    conferredBy: 'HLL LIFECARE LTD. (Govt. of India Enterprise)',
    summary: 'Awarded for exemplary timely supply of affordable life-saving medicines and healthcare formulations across all 38 AMRIT pharmacy stores situated in the North-Eastern States of India.',
    badge: 'Govt. Public Health'
  },
  {
    year: '2019',
    awardName: 'BUSINESS EXCELLENCE AWARD & CERTIFICATE OF APPRECIATION',
    title: 'Consistent SAHYOG Award (2019)',
    recipient: 'GRD Pharmaceuticals',
    designation: 'Strategic Healthcare Supply & Channel Partner',
    conferredBy: "Dr. Reddy's Laboratories",
    summary: 'Presented in recognition of the consistent "SAHYOG" (collaboration) to walk the path of shared commercial excellence, supply dependability, and healthcare reach.',
    badge: 'Pharma Excellence'
  },
  {
    year: '2018',
    awardName: 'BUSINESS EXCELLENCE AWARD & CERTIFICATE OF APPRECIATION',
    title: 'Consistent SAHYOG Award (2018)',
    recipient: 'GRD Pharmaceuticals',
    designation: 'Regional Channel Leadership',
    conferredBy: "Dr. Reddy's Laboratories",
    summary: 'Honored for dependable institutional supply execution, operational discipline, and sustained healthcare collaboration with Dr. Reddy’s.',
    badge: 'Pharma Excellence'
  },
  {
    year: '2018',
    awardName: 'CERTIFICATE OF APPRECIATION',
    title: 'Abbott Institution Business Contribution (2018)',
    recipient: 'GRD Pharmaceuticals',
    designation: 'Institutional Supply Chain Partner',
    conferredBy: 'Abbott Healthcare',
    summary: 'Conferred in recognition of significant contributions to Abbott’s Institutional healthcare operations and dedicated hospital supplies in Northeast India.',
    badge: 'Institutional Growth'
  },
  {
    year: '2016',
    awardName: 'CERTIFICATE OF EXCELLENCE',
    title: 'EPD Institution Business Excellence (2016)',
    recipient: 'GRD Pharmaceuticals',
    designation: 'Established Pharmaceuticals Division (EPD)',
    conferredBy: 'Abbott Healthcare',
    summary: 'Awarded for outstanding contribution, supply-chain reliability, and hospital fulfillment for Abbott’s Established Pharmaceuticals Division.',
    badge: 'EPD Excellence'
  },
  {
    year: '2015',
    awardName: 'ROLL OF HONOUR',
    title: 'Guwahati JJMI Channel Partner Forum (July 2015)',
    recipient: 'GRD Pharmaceuticals',
    designation: 'Channel Partner Excellence',
    conferredBy: 'Johnson & Johnson',
    summary: 'Conferred at the Guwahati JJMI Channel Partner Forum honoring exceptional regional partnership, clinical distribution, and product stewardship.',
    badge: 'Channel Leadership'
  }
];
