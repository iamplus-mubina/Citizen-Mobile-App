// ─── Master Data Dropdown Item ───
export interface MasterDropdownItem {
  id: number;
  name: string;
  [key: string]: any;
}

// ─── Complaint Category & Type ───
export interface ComplainType {
  id: number;
  name: string;
}

export interface ComplainCategory {
  id: number;
  name: string;
  prefix?: string;
  types: ComplainType[];
}

// ─── Auth ───
export interface RequestOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otpCode: string;
}

export interface AuthLoginResponse {
  success: boolean;
  accessToken: string;
  visitor: CitizenProfile;
}

// ─── Citizen Profile ───
export interface CitizenProfile {
  id: number;
  uniqueId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  fullName: string;
  phone: string;
  alternatePhone?: string | null;
  phone3?: string | null;
  phone4?: string | null;
  email?: string | null;
  gender?: string | null;
  dob?: string | null;
  doe?: string | null;
  age?: string | null;
  bloodGroup?: string | null;
  address?: string | null;
  city?: string | null;
  cityType?: string | null;
  pincode?: string | null;
  education?: string | null;
  occupation?: string | null;
  rationCard?: string | null;
  pancard?: string | null;
  aadhar?: string | null;
  voterID?: string | null;
  drivingLicence?: string | null;
  ProfileImage?: string | null;
  note?: string | null;
  role: string;
  isVoter?: boolean;
  acNumber?: string | null;
  partNumber?: string | null;
  sectionNumber?: string | null;
  boothNumber?: string | null;
  boothName?: string | null;
  // Relation objects (may come as objects or IDs)
  district?: MasterDropdownItem | null;
  assembly?: MasterDropdownItem | null;
  gaon?: MasterDropdownItem | null;
  gan_number?: MasterDropdownItem | null;
  gat_number?: MasterDropdownItem | null;
  prabhag?: MasterDropdownItem | null;
  prabhagArea?: MasterDropdownItem | null;
  cast?: MasterDropdownItem | null;
  subcast?: MasterDropdownItem | null;
  religion?: MasterDropdownItem | null;
}

// ─── Onboarding ───
export interface CitizenOnboardingPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email?: string;
  gender?: string;
  dob?: string;
  address?: string;
  profileImage?: string;
  otpCode?: string;
}

// ─── Profile Update ───
export interface UpdateProfilePayload {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  pincode?: string;
  gender?: string;
  dob?: string;
  age?: string;
  bloodGroup?: string;
  education?: string;
  occupation?: string;
  city?: string;
  cityType?: string;
  alternatePhone?: string;
  phone3?: string;
  phone4?: string;
  pancard?: string;
  aadhar?: string;
  voterID?: string;
  drivingLicence?: string;
  rationCard?: string;
  isVoter?: boolean;
  acNumber?: string;
  partNumber?: string;
  sectionNumber?: string;
  boothNumber?: string;
  boothName?: string;
  ProfileImage?: string;
  note?: string;
  // Relation IDs
  district_id?: number | null;
  assembly_id?: number | null;
  gaon_id?: number | null;
  gan_number_id?: number | null;
  gat_number_id?: number | null;
  prabhag_id?: number | null;
  prabhagAreaId?: number | null;
  cast?: number | null;
  subcast?: number | null;
  religion?: number | null;
}

export interface SubmitComplaintPayload {
  categoryId?: number;
  typeId?: number;
  description: string;
  address?: string | { line1?: string; pincode?: string; address?: string };
  documents?: string;
  complainerImage?: string;
}

// ─── My Complaints ───
export interface MyComplaintItem {
  id: number;
  requestId: number;
  complainId?: number | null;
  tokenNumber?: string | null;
  requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  liveStatus: string;
  description: string;
  rejectionReason?: string | null;
  category?: { id: number; name: string } | null;
  type?: { id: number; name: string } | null;
  documents: string[];
  createdDate: string;
  updatedDate: string;
}

// ─── Updates ───
export interface UpdateItem {
  id: number;
  title: string;
  description?: string;
  place?: string;
  location?: string;
  images?: string | string[];
  createdDate?: string;
  read?: boolean;
}

// ─── System Config ───
export interface SystemConfig {
  id: number;
  visitorPrefix?: string;
  sendSMS?: boolean;
  dateFormat?: string;
  BRANDING_PAGE_TITLE?: string;
  BRANDING_PHOTO_L?: string;
  BRANDING_PHOTO_M?: string;
  BRANDING_PHOTO_S?: string;
  BRANDING_TITLE?: string;
  BRANDING_SUB_TITLE?: string;
  BRANDING_TOPBAR_TITLE?: string;
  storage?: 'LOCAL' | 'S3';
  createdDate?: string;
  updatedDate?: string;
  createdBy?: number;
  updatedBy?: number;
}
