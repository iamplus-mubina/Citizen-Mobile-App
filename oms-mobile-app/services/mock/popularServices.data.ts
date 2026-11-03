export type ServiceCategoryKey = 'citizen' | 'schemes' | 'certificates' | 'permissions' | 'other';

export interface ServiceCategory {
  id: ServiceCategoryKey;
  title: string;
  iconName: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
}

export interface PopularService {
  id: string;
  categoryId: ServiceCategoryKey;
  title: string;
  description: string;
  subNotice?: string;
  requiredDocuments: RequiredDocument[];
}

export const POPULAR_SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'citizen',
    title: 'Citizen Services',
    iconName: 'BuildingOffice2Icon',
  },
  {
    id: 'schemes',
    title: 'Schemes',
    iconName: 'HeartIcon',
  },
  {
    id: 'certificates',
    title: 'Certificates',
    iconName: 'IdentificationIcon',
  },
  {
    id: 'permissions',
    title: 'Permissions / NOC',
    iconName: 'DocumentTextIcon',
  },
  {
    id: 'other',
    title: 'Other',
    iconName: 'Squares2X2Icon',
  },
];

export const POPULAR_SERVICES_LIST: PopularService[] = [
  // ─── Citizen Services ───
  {
    id: 'new-water-connection',
    categoryId: 'citizen',
    title: 'New Water Connection',
    description: 'Apply for a new water connection; a site visit may be scheduled.',
    requiredDocuments: [
      { id: 'doc-1', name: 'Site photograph' },
    ],
  },
  {
    id: 'drainage-sewer-connection',
    categoryId: 'citizen',
    title: 'Drainage / Sewer Connection',
    description: 'Apply to connect to the municipal drainage or sewer.',
    requiredDocuments: [
      { id: 'doc-2', name: 'Site photograph' },
    ],
  },

  // ─── Schemes ───
  {
    id: 'day-nulm',
    categoryId: 'schemes',
    title: 'DAY-NULM – Urban Livelihoods Mission',
    description: 'Ask about this scheme at the Municipal Council office.',
    subNotice: 'Open until further notice',
    requiredDocuments: [
      { id: 'doc-s1', name: 'Identity Proof (Aadhar Card)' },
      { id: 'doc-s2', name: 'Ration Card / Income Certificate' },
    ],
  },
  {
    id: 'divyang-welfare',
    categoryId: 'schemes',
    title: 'Divyang Welfare Scheme',
    description: 'Ask about this scheme at the Municipal Council office.',
    subNotice: 'Open until further notice',
    requiredDocuments: [
      { id: 'doc-s3', name: 'Disability Certificate (minimum 40%)' },
      { id: 'doc-s4', name: 'Aadhar Card & Municipal Residence Proof' },
    ],
  },
  {
    id: 'education-support',
    categoryId: 'schemes',
    title: 'Education Support Scheme',
    description: 'Education Support Scheme',
    subNotice: 'Open until further notice',
    requiredDocuments: [
      { id: 'doc-s5', name: 'Student School / College Bonafide' },
      { id: 'doc-s6', name: 'Previous Year Marksheet' },
    ],
  },
  {
    id: 'municipal-education-facilities',
    categoryId: 'schemes',
    title: 'Municipal Council Education Facilities',
    description: 'Ask about this scheme at the Municipal Council office.',
    subNotice: 'Open until further notice',
    requiredDocuments: [
      { id: 'doc-s7', name: 'Admission Record / Parent Identity Proof' },
    ],
  },
  {
    id: 'pmay-u',
    categoryId: 'schemes',
    title: 'Pradhan Mantri Awas Yojana – Urban (PMAY-U)',
    description: 'Ask about this scheme at the Municipal Council office.',
    subNotice: 'Open until further notice',
    requiredDocuments: [
      { id: 'doc-s8', name: 'Income Certificate (EWS category)' },
      { id: 'doc-s9', name: 'Land Title Proof / Property Document' },
    ],
  },
  {
    id: 'swachh-bharat-urban',
    categoryId: 'schemes',
    title: 'Swachh Bharat Mission – Urban',
    description: 'Ask about this scheme at the Municipal Council office. Documents usually needed for an individual toilet.',
    subNotice: 'Open until further notice',
    requiredDocuments: [
      { id: 'doc-s10', name: 'Aadhar Card' },
      { id: 'doc-s11', name: 'Bank Account Passbook' },
    ],
  },
  {
    id: 'urban-health-scheme',
    categoryId: 'schemes',
    title: 'Urban Health Scheme',
    description: 'Ask about this scheme at the Municipal Council office.',
    subNotice: 'Open until further notice',
    requiredDocuments: [
      { id: 'doc-s12', name: 'BPL Card / Aadhar Card' },
    ],
  },

  // ─── Certificates ───
  {
    id: 'birth-certificate',
    categoryId: 'certificates',
    title: 'Birth Certificate',
    description: 'Request a municipal birth certificate for a registered birth.',
    requiredDocuments: [
      { id: 'doc-c1', name: 'Hospital birth report' },
      { id: 'doc-c2', name: 'Hospital discharge summary / birth document' },
    ],
  },
  {
    id: 'death-certificate',
    categoryId: 'certificates',
    title: 'Death Certificate',
    description: 'Request a municipal death certificate.',
    requiredDocuments: [
      { id: 'doc-c3', name: 'Hospital death summary / Cremation ground receipt' },
    ],
  },
  {
    id: 'trade-licence-copy',
    categoryId: 'certificates',
    title: 'Municipal Trade Licence Copy',
    description: 'Get a copy of an existing municipal trade licence.',
    requiredDocuments: [
      { id: 'doc-c4', name: 'Existing trade licence number / proof' },
    ],
  },

  // ─── Permissions / NOC ───
  {
    id: 'tree-cutting-permission',
    categoryId: 'permissions',
    title: 'Tree Cutting Permission',
    description: 'Ask permission to cut a tree; an inspection may be needed.',
    requiredDocuments: [
      { id: 'doc-p1', name: 'Tree photograph' },
    ],
  },
  {
    id: 'tree-pruning-permission',
    categoryId: 'permissions',
    title: 'Tree Pruning Permission',
    description: 'Ask permission to prune branches; an inspection may be needed.',
    requiredDocuments: [
      { id: 'doc-p2', name: 'Tree photograph' },
    ],
  },
  {
    id: 'municipal-trade-licence',
    categoryId: 'permissions',
    title: 'Municipal Trade Licence',
    description: 'Apply for a municipal trade licence; an inspection may be needed.',
    requiredDocuments: [
      { id: 'doc-p3', name: 'Premises photograph' },
      { id: 'doc-p4', name: 'Ownership or Rent agreement' },
    ],
  },
  {
    id: 'municipal-trade-licence-renewal',
    categoryId: 'permissions',
    title: 'Municipal Trade Licence Renewal',
    description: 'Renew an existing licence, including one that has expired.',
    requiredDocuments: [
      { id: 'doc-p5', name: 'Previous Trade Licence copy' },
    ],
  },

  // ─── Other ───
];

export const getServicesByCategory = (categoryId: ServiceCategoryKey): PopularService[] => {
  return POPULAR_SERVICES_LIST.filter((s) => s.categoryId === categoryId);
};

export const getServiceById = (serviceId: string): PopularService | undefined => {
  return POPULAR_SERVICES_LIST.find((s) => s.id === serviceId);
};

export const getCategoryById = (categoryId: ServiceCategoryKey): ServiceCategory | undefined => {
  return POPULAR_SERVICE_CATEGORIES.find((c) => c.id === categoryId);
};

export const getCategoryTitle = (categoryId: ServiceCategoryKey): string => {
  switch (categoryId) {
    case 'citizen':
      return 'Citizen Services';
    case 'schemes':
      return 'Schemes';
    case 'certificates':
      return 'Certificates';
    case 'permissions':
      return 'Permissions / NOC';
    case 'other':
      return 'Other';
    default:
      return 'Services';
  }
};
