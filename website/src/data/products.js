/**
 * GRD Pharmaceuticals Products & Capabilities Data
 * Derived directly and exclusively from the official website https://grdpharma.in/
 * and official authentic packaging assets.
 */

// Core Pharmaceutical Dosage Form Capabilities (Official categories from grdpharma.in)
export const PHARMA_CATEGORIES = [
  {
    id: 'tablets',
    name: 'Tablets',
    slug: 'tablets',
    tagline: 'Tablets of various combinations',
    description: 'Actively manufacturing and marketing pharmaceutical tablets of various combinations, including film-coated, uncoated, and enteric-coated formulations from our GMP certified plant at Rani, Assam.',
    image: '/images/pharma-tablets.webp',
    fallbackImage: '/images/product-tablets.png',
    bgTint: 'bg-[#EBF2EC]',
    icon: 'Pill',
    highlights: ['Film-coated & uncoated', 'Various therapeutic combinations', 'Tested at NABL accredited labs'],
    storage: 'Store below 25°C-30°C in a dry place. Protect from moisture and direct light.',
    safetyWarning: 'Schedule H Prescription Drug: To be sold by retail on the prescription of a Registered Medical Practitioner only.',
    qualityStandard: 'cGMP Certified & Dual-Tested at NABL Accredited Laboratories'
  },
  {
    id: 'capsules',
    name: 'Capsules',
    slug: 'capsules',
    tagline: 'Hard gelatin capsules of various combinations',
    description: 'Manufacturing pharmaceutical capsules of various combinations under strictly controlled cleanroom humidity and temperature parameters to ensure stability and bioavailability.',
    image: '/images/pharma-capsules.webp',
    fallbackImage: '/images/product-capsules.png',
    bgTint: 'bg-[#E2EDF4]',
    icon: 'Capsule',
    highlights: ['Hard gelatin capsules', 'Various therapeutic combinations', 'cGMP compliant manufacturing'],
    storage: 'Store below 25°C-30°C in a dry place. Protect from heat and moisture.',
    safetyWarning: 'Schedule H Prescription Drug: To be dispensed against a valid medical prescription only.',
    qualityStandard: 'cGMP Certified Cleanrooms with NABL Batch Release Testing'
  },
  {
    id: 'syrups',
    name: 'Syrups & Liquids',
    slug: 'syrups',
    tagline: 'Oral syrups and liquids of various combinations',
    description: 'Automated processing and bottling lines for palatable pharmaceutical syrups and oral liquids of various combinations for pediatric and adult healthcare.',
    image: '/images/pharma-syrups.webp',
    fallbackImage: '/images/product-syrups.png',
    bgTint: 'bg-[#F6ECE6]',
    icon: 'Wine',
    highlights: ['Automated liquid line', 'Palatable oral formulations', 'Consistent batch testing'],
    storage: 'Store in a cool, dry place below 25°C. Keep bottle tightly closed and protect from light.',
    safetyWarning: 'Shake well before use. Use the measuring cup provided. Keep out of reach of children.',
    qualityStandard: 'cGMP Automated Liquid Bottling & NABL Accredited Batch Testing'
  },
  {
    id: 'suspensions',
    name: 'Suspensions',
    slug: 'suspensions',
    tagline: 'Oral suspensions of various combinations',
    description: 'Precision-formulated suspensions with homogeneous particle dispersion for optimal absorption, stability, and therapeutic consistency.',
    image: '/images/pharma-suspensions.webp',
    fallbackImage: '/images/product-suspensions.png',
    bgTint: 'bg-[#F7EAEF]',
    icon: 'FlaskConical',
    highlights: ['Homogeneous dispersion', 'Pediatric & general suspensions', 'Batch tested at NABL labs'],
    storage: 'Store below 25°C in a dry place. Protect from freezing and direct sunlight.',
    safetyWarning: 'Shake well before use to ensure homogeneous suspension. Schedule H Prescription Drug.',
    qualityStandard: 'cGMP Precision Homogenization with Dual-Testing Quality Release'
  }
];

// Additional Dosage Forms from live site portfolio
export const EXTENDED_PHARMA_PORTFOLIO = [
  {
    id: 'dry-syrup',
    name: 'Dry Syrup',
    slug: 'dry-syrup',
    description: 'Formulation of reconstitutable oral dry syrups for specialized pediatric therapy.',
    icon: 'Pill'
  },
  {
    id: 'injectables',
    name: 'Injectables',
    slug: 'injectables',
    description: 'Sterile institutional injectables produced under stringent aseptic quality controls.',
    icon: 'ShieldCheck'
  },
  {
    id: 'contract-manufacturing',
    name: 'Contract Manufacturing',
    slug: 'contract-manufacturing',
    description: 'Our manufacturing facility is geared to undertake contract manufacturing for our clients with cGMP standards and custom batch fulfillment.',
    icon: 'Factory'
  },
  {
    id: 'cf-services',
    name: 'C&F Services',
    slug: 'cf-services',
    description: 'Our marketing team can also provide Carrying & Forwarding (C&F) services for our clients across Northeast India.',
    icon: 'Truck'
  }
];

// Authentic Promotional Banners from live website (Provided images P1, P2, P3, P4)
export const HYGIENE_BANNERS = {
  completeRange: {
    id: 'complete-range',
    title: 'Complete Range of Sanitization Products',
    tagline: 'Serving Northeast India Since 2006 | Safe Hands | Safe Surfaces | Safe Environment',
    image: '/images/products/p1-complete-range.webp',
    fallbackImage: '/images/products/p1-complete-range.png',
    alt: 'GRD Complete Range of Sanitization Products'
  },
  envoUser: {
    id: 'envouser-5',
    title: 'EnvoUser-5™ Environment Sanitizer',
    tagline: 'Unlock to Safe, Sanitized Surroundings',
    image: '/images/products/p2-envouser-banner.webp',
    fallbackImage: '/images/products/p2-envouser-banner.png',
    alt: 'EnvoUser-5 Environment Sanitizer'
  },
  handuserC: {
    id: 'handuser-c-banner',
    title: 'Handuser-C® - The Ultimate Hand Sanitizer',
    tagline: 'WHO Recommended Handrub | Kills 99.99% Germs | Less Skin Dryness | Sold at Govt Approved Rates',
    image: '/images/products/p3-handuser-banner.webp',
    fallbackImage: '/images/products/p3-handuser-banner.png',
    alt: 'Handuser-C The Ultimate Hand Sanitizer'
  },
  surfoUser: {
    id: 'surfouser-a',
    title: 'SurfoUser-A™ - Surface Sanitizer',
    tagline: 'Kills 99.99% Germs | Long Lasting Effect | Not Necessary to Wipe | Safe for Gadgets & Vehicle',
    image: '/images/products/p4-surfouser-banner.webp',
    fallbackImage: '/images/products/p4-surfouser-banner.png',
    alt: 'SurfoUser-A Surface Sanitizer'
  }
};

// Authentic Hygiene Products directly from https://grdpharma.in/ and provided packaging assets
export const HYGIENE_PRODUCTS = [
  {
    id: 'handuser-c',
    slug: 'handuser-c',
    altSlug: 'hand-sanitizer',
    name: 'Handuser-C®',
    brandName: 'Handuser-C',
    category: 'Alcohol-Based Handrub (ABHR)',
    categoryName: 'Hand Sanitizer',
    subtitle: 'Northeast India’s First ABHR (Since 2012) — The Ultimate Hand Sanitizer',
    officialUrl: 'https://grdpharma.in/HANDUSER-C.html',
    description: 'Handuser-C is the first Alcohol Based Handrub to be manufactured in the entire North East way back in 2012. Since that time, Handuser-C is based on a WHO recommended Alcohol and Chlorhexidine formula that acts to protect the hands longer than a Standard Alcohol based hand rub while providing the fast and effective germ killing efficiency of an alcohol handrub. Handuser-C is widely prevalent in all trade markets and at Government approved prices. That is why we believe Handuser-C is the “Ultimate Hand Sanitzer”.',
    shortDesc: 'Northeast India’s first manufactured Alcohol-Based Handrub (since 2012). WHO recommended Alcohol & Chlorhexidine formula that protects hands longer at Government approved rates.',
    mainChemical: 'Ethyl Alcohol, Chlorhexidine',
    composition: 'Ethyl Alcohol IP 70% v/v, Chlorhexidine Gluconate Solution IP 2.5% v/v (equivalent to 0.5% w/v Chlorhexidine Gluconate), with Emollient and Moisturizer.',
    packaging: '100 ml, 200 ml, 250 ml, 500 ml, 5000 ml (5 Litres), 35000 ml (35 Litres)',
    packSizes: ['100 ml Pocket Pack', '200 ml Dispenser', '250 ml Dispenser', '500 ml Pump Bottle', '5 Litres (5000 ml) Canister', '35 Litres (35000 ml) Institutional Drum'],
    application: 'Hands & skin antisepsis',
    usageInstructions: 'Apply 3 ml to 5 ml onto clean, dry hands. Rub hands palm to palm, over backs of hands with fingers interlaced, and around fingertips and thumbs until completely dry (minimum 20–30 seconds). No water rinse or towel drying needed.',
    safetyWarnings: 'Highly Flammable Liquid and Vapour. Keep away from heat, sparks, open flames, and hot surfaces. For external topical use only. Do not swallow. Avoid contact with eyes; in case of eye contact, rinse thoroughly with fresh water. Keep out of reach of children.',
    storageConditions: 'Store in a cool, ventilated area below 30°C. Protect from direct heat and sunlight. Keep container tightly closed.',
    certifications: ['WHO Recommended Handrub Formula', 'cGMP Certified Facility', 'ISO 9001:2015 QMS', 'Batch Tested at NABL Accredited Labs', 'Approved Govt. Supply Rates'],
    additionalComponents: 'Automatic Dispenser',
    image: '/images/products/p5-handuser-c.webp',
    fallbackImage: '/images/products/p5-handuser-c.png',
    banner: '/images/products/p3-handuser-banner.webp',
    bgTint: 'bg-[#EBF2EC]',
    icon: 'Package',
    features: [
      'First Alcohol Based Handrub manufactured in the entire North East (since 2012)',
      'WHO recommended Alcohol and Chlorhexidine formula',
      'Acts to protect hands longer than standard alcohol handrubs',
      'Fast and effective 99.99% germ killing efficiency',
      'Widely prevalent in trade markets and supplied at Government approved prices',
      'Less skin dryness and irritation'
    ]
  },
  {
    id: 'surface-sanitizer',
    slug: 'surface-sanitizer',
    altSlug: 'surfouser-a',
    name: 'SurfoUser-A™',
    brandName: 'SurfoUser-A',
    category: 'Multi-Surface Disinfectant',
    categoryName: 'Surface Sanitizer',
    subtitle: 'Multipurpose High Quality All Surface Sanitizer for Indoor Use',
    officialUrl: 'https://grdpharma.in/SURFOUSER-A.html',
    description: 'Surfouser-A is our multipurpose, high quality all surface sanitizer intended for indoor use. It is safe for use on almost all surfaces with a maximum efficiency towards killing germs. Most everyday objects such as keys, mobile phones, wallets, door handles, work spaces, etc. come into a high exposure to germs and other microbes due to the frequency of use. Surfouser-A can be used to disinfect these surfaces instantly. Surfouser-A is safe to be used inside a home or office environment as well and has an exceptionally long shelf life.',
    shortDesc: 'Multipurpose high quality all surface sanitizer for indoor use. Safe for mobile phones, keys, desks, and door handles with instant germ killing and long shelf life.',
    mainChemical: 'Ethyl Alcohol (Contains Ethanol 70% v/v, Surfactants and Stabilizers)',
    composition: 'Contains Ethanol (70% v/v), Surfactants and Stabilizers.',
    packaging: '750 ml, 5000 ml (5 Litres)',
    packSizes: ['750 ml Trigger Spray Bottle', '5 Litres (5000 ml) Bulk Refill Canister'],
    application: 'Mobile phones, keys, desks, working spaces, door handles, packages, steering wheels',
    usageInstructions: 'Hold container 6 to 8 inches away from target surface and spray evenly until surface is moist. Allow to air dry; wiping is not mandatory as it evaporates cleanly without residue. For sensitive electronics, spray onto a clean microfiber cloth before wiping.',
    safetyWarnings: 'Highly Flammable. Keep away from sources of ignition, electrical sparks, and flames. Do not spray directly into eyes, face, or open wounds. Use in well-ventilated indoor spaces. For external surface disinfection only.',
    storageConditions: 'Store in a cool, dry place away from flame and direct heat. Keep tightly sealed.',
    certifications: ['Kills 99.99% Germs', 'cGMP Manufactured', 'ISO 9001:2015 QMS', 'Batch Validated at NABL Labs'],
    additionalComponents: 'N/A',
    image: '/images/products/p6-surfouser-a.webp',
    fallbackImage: '/images/products/p6-surfouser-a.png',
    banner: '/images/products/p4-surfouser-banner.webp',
    bgTint: 'bg-[#EBF2EC]',
    icon: 'SprayCan',
    features: [
      'Kills 99.99% germs instantly on contact',
      'Long lasting residual antimicrobial effect',
      'Not necessary to wipe – evaporates cleanly',
      'Safe for gadgets, mobile phones, keys, vehicle steering and interiors',
      'Ideal for homes, offices, clinic reception desks, and workspace touchpoints'
    ]
  },
  {
    id: 'environment-sanitizer',
    slug: 'environment-sanitizer',
    altSlug: 'envouser-5',
    name: 'EnvoUser-5™',
    brandName: 'EnvoUser-5',
    category: 'Area & Exterior Disinfectant',
    categoryName: 'Environment Sanitizer',
    subtitle: 'Chlorine-Based External Sanitizer with ICMR / MoHFW (GoI) Approved Formulation',
    officialUrl: 'https://grdpharma.in/ENVOUSER-5.html',
    description: 'Envouser-5 is our Chlorine based disinfectant meant for external areas or areas with sufficient ventilation. Envouser-5 is an ICMR/ MoHFW (GoI) approved formulation for disinfection of public spaces and exteriors. The special Slow Release formula of Envouser-5, our speciality, prevents irritation to humans/ pets while ensuring maximum protection. Therefore, you can have all the safety and none of the side effects. Due to its chemical nature, we highly recommend not to use Envouser-5 in areas with insufficient ventilation.',
    shortDesc: 'Chlorine-based external disinfectant with ICMR/MoHFW (GoI) approved slow-release formula for public spaces, bus stops, parking areas, and exteriors.',
    mainChemical: 'Sodium Hypochlorite',
    composition: 'Sodium Hypochlorite 5%, Stabilizers, Emulsifiers, and Balance Water (Stabilized & Slow Release Hypochlorite Formula).',
    packaging: '5000 ml (5 Litres), 35000 ml (35 Litres)',
    packSizes: ['5 Litres (5000 ml) Heavy-Duty Canister', '35 Litres (35000 ml) Institutional Drum'],
    application: 'Neighbourhood, bus stops, parking lot, standing vehicles, homes and apartments, factories and warehouses, offices and shops, garages, etc.',
    usageInstructions: 'Designed for exterior and large area decontamination using automated spraying equipment or cold/thermal fogging machines. Apply evenly over external walkways, bus shelters, building perimeters, and vehicle exteriors. Allow adequate contact time.',
    safetyWarnings: 'Corrosive in concentrate. Highly recommended NOT to be used in enclosed areas with insufficient ventilation. Wear protective gloves and eye protection during bulk preparation and spraying. Do not inhale spray mist. In case of skin or eye contact, flush with copious water immediately.',
    storageConditions: 'Store in a cool, dark, well-ventilated store room. Keep canister tightly capped and away from acidic chemicals.',
    certifications: ['ICMR / MoHFW (Govt. of India) Approved Formulation', 'Stabilized Slow-Release Technology', 'cGMP Certified Manufacturing'],
    additionalComponents: 'Fogging / Spraying Machine',
    image: '/images/products/p7-envouser-5.webp',
    fallbackImage: '/images/products/p7-envouser-5.png',
    banner: '/images/products/p2-envouser-banner.webp',
    bgTint: 'bg-[#EBF2EC]',
    icon: 'Sparkles',
    features: [
      'ICMR / MoHFW (Govt. of India) approved formulation for external disinfection',
      'Specialized Slow Release formula prevents irritation to humans and pets',
      'Suitable for spraying in exteriors of homes, apartments, factories, warehouses, and shops',
      'Ideal for neighbourhood disinfection, bus stops, parking lots, and standing vehicles',
      'Designed for use with fogging and spraying machines'
    ]
  },
  {
    id: 'liquid-hand-wash',
    slug: 'liquid-hand-wash',
    altSlug: 'handuser-g',
    name: 'Handuser-G® Liquid Handwash',
    brandName: 'Handuser-G',
    category: 'Skin Cleansing & Protection',
    categoryName: 'Liquid Handwash',
    subtitle: 'Total Germ Removal and Skin Protection — Clean Hands, Save Lives',
    officialUrl: 'https://grdpharma.in/',
    description: 'Handuser-G Liquid Handwash is GRD Pharmaceuticals’ specialized hand cleansing solution formulated for total germ removal and skin protection. Part of our core hygiene vertical, it delivers trusted everyday hand antisepsis supporting the mission of “Clean Hands, Save Lives”.',
    shortDesc: 'Total germ removal and skin protection. Gentle daily cleansing for healthcare, commercial, and residential hand hygiene.',
    mainChemical: 'Antimicrobial Cleansing Soap Formulation',
    composition: 'Surfactant cleansing complex with skin moisturizers and antimicrobial defense.',
    packaging: 'Pump Bottles & Bulk Refill Cans',
    packSizes: ['250 ml Pump Dispenser', '500 ml Pump Dispenser', '5 Litres Refill Canister'],
    application: 'Handwashing and skin decontamination',
    usageInstructions: 'Wet hands with clean potable water. Dispense adequate handwash into palm. Work up a rich lather, scrubbing palms, backs of hands, between fingers, and under fingernails for at least 20 seconds. Rinse thoroughly with water and dry.',
    safetyWarnings: 'For external dermatological use only. Avoid contact with eyes; if contact occurs, rinse immediately with clean water. Discontinue use if skin irritation or rash develops.',
    storageConditions: 'Store at room temperature protected from direct heat and freezing.',
    certifications: ['cGMP Formulated', 'Skin Cleansing Defense Standard', 'ISO 9001:2015 Certified'],
    additionalComponents: 'Hand Soap Dispenser',
    image: '/images/products/p8-handuser-g.webp',
    fallbackImage: '/images/products/p8-handuser-g.png',
    bgTint: 'bg-[#EBF2EC]',
    icon: 'Droplets',
    features: [
      'Total germ removal while protecting skin texture',
      'Clean Hands, Save Lives — promotes personal and societal hygiene',
      'Rich lather that rinses cleanly without dryness',
      'Manufactured by GRD Pharmaceuticals since 2006'
    ]
  }
];

// Authentic Educational Articles & WHO Guidelines from https://grdpharma.in/
export const HYGIENE_ARTICLES = [
  {
    id: 'personal-and-societal-hygiene',
    title: 'Personal and Societal Hygiene',
    sourceUrl: 'https://grdpharma.in/Personal-and-Societal-Hygiene.html',
    tagline: 'The Art of Health',
    summary: 'Referred to in Ancient Greece as “the art of health”, Hygiene is not a singular concept but rather a series of habits and practices adapted by humans. There is no universal RULE to Hygiene and the WHO terms it as “conditions and practices that help to maintain health and prevent the spread of diseases.”',
    content: [
      'Referred to in Ancient Greece as “the art of health”, Hygiene is not a singular concept but rather a series of habits and practices adapted by humans. There is no universal RULE to Hygiene and the WHO terms it as “conditions and practices that help to maintain health and prevent the spread of diseases.” As such the concept of hygiene may vary with time and place.',
      'Sanitization is one of the tools that help us reach our goal of personal and societal hygiene. We at GRD Pharmaceuticals strive each day to be an ambassador of hygiene and sanitization. We aim to foster the concept of effective sanitization and help achieve the goals of hygiene that lead to a wholesome health of society.',
      'SMS SAFETY: “SMS Safety” (Sanitization, Mask, Social distance) is a concept promoted by experts all across the world to maintain strict hygiene and keep society safe.',
      'MASK PRACTICES: Wearing a mask in public has become standard practice urged by the Ministry of Health and Family Welfare, Government of India.',
      'HOW TO HANDRUB: While using an alcohol-based hand-rub ensures complete sanitization of your hands, there is a specific practice to the use of Handrubs according to WHO clear guidelines.'
    ]
  },
  {
    id: 'who-guidelines',
    title: 'WHO Guidelines on Hand Hygiene in Health Care',
    sourceUrl: 'https://grdpharma.in/WHO-Guidelines.html',
    tagline: 'Official WHO Formulations & Definitions',
    summary: 'Hand Hygiene is a general term used to describe any action that results in cleansing of hands and the removal of microorganisms from the hands.',
    content: [
      'Antiseptic handwashing: Washing hands with soap and water, or other detergents containing an antiseptic agent.',
      'Antiseptic hand-rubbing (or hand-rubbing): Applying an antiseptic hand-rub to reduce or inhibit the growth of microorganisms without the need for an exogenous source of water and requiring no rinsing or drying with towels or other devices.',
      'Hand antisepsis / decontamination / degerming: Reducing or inhibiting the growth of microorganisms by the application of an antiseptic hand-rub or by performing an antiseptic handwash.',
      'Hand care: Actions to reduce the risk of skin damage or irritation.',
      'Handwashing: Washing hands with plain or antimicrobial soap and water.',
      'Hand cleansing: Action of performing hand hygiene for the purpose of physically or mechanically removing dirt, organic material, and/or microorganisms.',
      'Surgical hand antisepsis: Antiseptic handwash or antiseptic hand-rub performed preoperatively by the surgical team to eliminate transient flora and reduce resident skin flora.'
    ]
  },
  {
    id: 'who-product-definitions',
    title: 'WHO Definition of Hand Hygiene Products',
    sourceUrl: 'https://grdpharma.in/Kinds-of-Handwashes.html',
    tagline: 'Alcohol-based handrubs vs Medicated Soaps',
    summary: 'Definitions of alcohol-based handrubs, antimicrobial soaps, and antiseptic agents under WHO healthcare standards.',
    content: [
      'Alcohol-based (hand) rub: An alcohol-containing preparation (liquid, gel, or foam) designed for application to the hands to inactivate microorganisms and/or temporarily suppress their growth. Such preparations may contain one or more types of alcohol.',
      'Antimicrobial (medicated) soap: Soap (detergent) containing an antiseptic agent at a concentration sufficient to inactivate microorganisms.',
      'Antiseptic agent: An antimicrobial substance that inactivates microorganisms or inhibits their growth on living tissues.',
      'Plain soap: Detergents that contain no added antimicrobial agents, or may contain these solely for preservative purposes.'
    ]
  },
  {
    id: 'historical-perspective',
    title: 'Historical Perspective on Hand Hygiene in Health Care',
    sourceUrl: 'https://grdpharma.in/Historical-perspective-on-hand-hygiene-in-health-care.html',
    tagline: 'From Semmelweis to Modern Alcohol-Based Handrubs',
    summary: 'Source: Chapter 4, WHO Guidelines on Hand Hygiene. In 1847, Ignaz Semmelweis in Vienna demonstrated that chlorinated lime hand cleansing reduced maternal mortality from 16% to 3%.',
    content: [
      'In 1847, Ignaz Semmelweis at the University of Vienna General Hospital observed that maternal mortality was significantly higher in clinics where doctors came directly from autopsy rooms. He recommended hands be scrubbed in a chlorinated lime solution before every patient contact, reducing mortality from 16% to 3%.',
      'The 1980s represented a landmark in the evolution of hand hygiene guidelines. In 2002, CDC/HICPAC guidelines defined alcohol-based hand rubbing as the standard of care for healthcare settings.',
      'WHO Hand Hygiene Improvement Strategy adopted this evidence-base to promote alcohol-based hand rubs globally.'
    ]
  }
];

// Authentic Company Highlights (Directly derived from official About Us text)
export const COMPANY_HIGHLIGHTS = [
  {
    id: 'exp',
    stat: '2006',
    unit: 'Est.',
    title: 'Established in 2006',
    description: 'Actively manufacturing and marketing pharmaceutical tablets, capsules, syrups and suspensions in Northeast India.',
    icon: 'Award'
  },
  {
    id: 'facility',
    stat: 'GMP',
    unit: 'Certified',
    title: 'Rani Industrial Plant',
    description: 'State-of-the-art pharmaceutical manufacturing facility at D-15, Rani Industrial Area, Kamrup, Assam.',
    icon: 'Factory'
  },
  {
    id: 'quality',
    stat: 'ISO',
    unit: '9001:2015',
    title: 'Quality & NABL Testing',
    description: 'ISO 9001:2015 certified QMS with samples from each production batch tested at NABL accredited laboratories.',
    icon: 'ShieldCheck'
  },
  {
    id: 'partner',
    stat: '100+',
    unit: 'Yr Heritage',
    title: 'Part of Dhanuka Group',
    description: 'Dhanuka Group has been a business house in Guwahati for over 100 years, employing over 750 people.',
    icon: 'Handshake'
  }
];

// Preserved forward-compatibility export
export const PRODUCTS_CATALOG = HYGIENE_PRODUCTS;
