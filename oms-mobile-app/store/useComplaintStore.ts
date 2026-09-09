import { create } from 'zustand';

// ─── Complaint Item (from API) ───
export interface SubmittedComplaint {
  id: number;
  requestId: number;
  complainId: number | null;
  ticketId: string;
  category: string;
  type: string;
  description: string;
  address: string;
  documents: string[];
  date: string;
  updatedDate: string;
  // Dual status
  requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  liveStatus: string;
  rejectionReason: string | null;
}

interface ComplaintFormState {
  // ── Complaint Form Fields ──
  selectedCategoryId: number | null;
  selectedCategoryName: string;
  selectedTypeId: number | null;
  selectedTypeName: string;
  description: string;
  address: string;
  pincode: string;
  photoCount: number;
  documentCount: number;
  uploadedPhotoUrls: string[];
  uploadedDocumentUrls: string[];

  // ── Complaints List ──
  submittedComplaints: SubmittedComplaint[];
  totalComplaintsCount: number;

  // ── Profile Fields (matching EN_Visitor entity) ──
  profilePhoto: string | null;
  phoneNumber: string;
  profileName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  profileEmail: string;
  profileAddress: string;
  profilePincode: string;
  gender: string;
  dob: string;
  age: string;
  bloodGroup: string;
  education: string;
  occupation: string;
  city: string;
  cityType: string;
  alternatePhone: string;
  phone3: string;
  phone4: string;
  // Identity
  aadharCard: string;
  panCard: string;
  voterId: string;
  drivingLicence: string;
  rationCard: string;
  // Location (IDs + names)
  districtId: number | null;
  districtName: string;
  assemblyId: number | null;
  assemblyName: string;
  gaonId: number | null;
  gaonName: string;
  ganId: number | null;
  ganName: string;
  gatId: number | null;
  gatName: string;
  prabhagId: number | null;
  prabhagName: string;
  prabhagAreaId: number | null;
  prabhagAreaName: string;
  // Caste & Religion
  castId: number | null;
  castName: string;
  subCastId: number | null;
  subCastName: string;
  religionId: number | null;
  religionName: string;
  // Voter
  isVoter: boolean;
  acNumber: string;
  voterAccountNumber: string;
  voterPartNumber: string;
  voterSectionNumber: string;
  voterSlnNumber: string;
  boothNumber: string;
  boothName: string;
  ourVoter: boolean;
  note: string;
  caste: string;
  subCaste: string;

  // ── Actions ──
  setComplaintForm: (data: Partial<ComplaintFormState>) => void;
  setComplaints: (complaints: any[], total?: number) => void;
  setProfilePhoto: (uri: string | null) => void;
  setPhoneNumber: (phone: string) => void;
  setProfile: (profileData: Partial<ComplaintFormState>) => void;
  setProfileFromApi: (data: any) => void;
  resetComplaintForm: () => void;
}

const defaultComplaintForm = {
  selectedCategoryId: null as number | null,
  selectedCategoryName: '',
  selectedTypeId: null as number | null,
  selectedTypeName: '',
  description: '',
  address: '',
  pincode: '',
  photoCount: 0,
  documentCount: 0,
  uploadedPhotoUrls: [] as string[],
  uploadedDocumentUrls: [] as string[],
};

export const useComplaintStore = create<ComplaintFormState>((set) => ({
  // Complaint form defaults
  ...defaultComplaintForm,

  // Complaints list
  submittedComplaints: [],
  totalComplaintsCount: 0,

  // Profile defaults
  profilePhoto: null,
  phoneNumber: '',
  profileName: '',
  firstName: '',
  middleName: '',
  lastName: '',
  profileEmail: '',
  profileAddress: '',
  profilePincode: '',
  gender: '',
  dob: '',
  age: '',
  bloodGroup: '',
  education: '',
  occupation: '',
  city: '',
  cityType: '',
  alternatePhone: '',
  phone3: '',
  phone4: '',
  aadharCard: '',
  panCard: '',
  voterId: '',
  drivingLicence: '',
  rationCard: '',
  districtId: null,
  districtName: '',
  assemblyId: null,
  assemblyName: '',
  gaonId: null,
  gaonName: '',
  ganId: null,
  ganName: '',
  gatId: null,
  gatName: '',
  prabhagId: null,
  prabhagName: '',
  prabhagAreaId: null,
  prabhagAreaName: '',
  castId: null,
  castName: '',
  subCastId: null,
  subCastName: '',
  religionId: null,
  religionName: '',
  isVoter: false,
  acNumber: '',
  voterAccountNumber: '',
  voterPartNumber: '',
  voterSectionNumber: '',
  voterSlnNumber: '',
  boothNumber: '',
  boothName: '',
  ourVoter: false,
  note: '',
  caste: '',
  subCaste: '',

  // ── Actions ──
  setComplaintForm: (data) => set((state) => ({ ...state, ...data })),

  setComplaints: (complaints, total) => set({
    submittedComplaints: complaints.map((c: any) => ({
      id: c.id,
      requestId: c.requestId || c.id,
      complainId: c.complainId || null,
      ticketId: c.tokenNumber || `REQ-${c.requestId || c.id}`,
      category: c.category?.name || '',
      type: c.type?.name || '',
      description: c.description || '',
      address: '',
      documents: Array.isArray(c.documents) ? c.documents : [],
      date: c.createdDate ? new Date(c.createdDate).toLocaleDateString('en-IN') : '',
      updatedDate: c.updatedDate ? new Date(c.updatedDate).toLocaleDateString('en-IN') : '',
      requestStatus: c.requestStatus || 'PENDING',
      liveStatus: c.liveStatus || 'PENDING APPROVAL',
      rejectionReason: c.rejectionReason || null,
    })),
    totalComplaintsCount: total ?? complaints.length,
  }),

  setProfilePhoto: (profilePhoto) => set({ profilePhoto }),

  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

  setProfile: (profileData) => set((state) => ({ ...state, ...profileData })),

  setProfileFromApi: (data) => set((state) => {
    const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');
    return {
      ...state,
      firstName: data.firstName || '',
      middleName: data.middleName || '',
      lastName: data.lastName || '',
      profileName: fullName || state.profileName,
      profileEmail: data.email || '',
      profileAddress: data.address || '',
      profilePincode: data.pincode || '',
      phoneNumber: data.phone ? `+91 ${data.phone}` : state.phoneNumber,
      gender: data.gender || '',
      dob: data.dob || '',
      age: data.age || '',
      bloodGroup: data.bloodGroup || '',
      education: data.education || '',
      occupation: data.occupation || '',
      city: data.city || '',
      cityType: data.cityType || '',
      alternatePhone: data.alternatePhone || '',
      phone3: data.phone3 || '',
      phone4: data.phone4 || '',
      aadharCard: data.aadhar || '',
      panCard: data.pancard || '',
      voterId: data.voterID || '',
      drivingLicence: data.drivingLicence || '',
      rationCard: data.rationCard || '',
      isVoter: data.isVoter || false,
      acNumber: data.acNumber || '',
      voterAccountNumber: data.acNumber || '',
      voterPartNumber: data.partNumber || '',
      voterSectionNumber: data.sectionNumber || '',
      boothNumber: data.boothNumber || '',
      boothName: data.boothName || '',
      note: data.note || '',
      // Relation fields
      districtId: data.district?.id || null,
      districtName: data.district?.name || '',
      assemblyId: data.assembly?.id || null,
      assemblyName: data.assembly?.name || '',
      gaonId: data.gaon?.id || null,
      gaonName: data.gaon?.name || '',
      ganId: data.gan_number?.id || null,
      ganName: data.gan_number?.name || '',
      gatId: data.gat_number?.id || null,
      gatName: data.gat_number?.name || '',
      prabhagId: data.prabhag?.id || null,
      prabhagName: data.prabhag?.name || '',
      prabhagAreaId: data.prabhagArea?.id || null,
      prabhagAreaName: data.prabhagArea?.name || '',
      castId: data.cast?.id || null,
      castName: data.cast?.name || '',
      caste: data.cast?.name || '',
      subCastId: data.subcast?.id || null,
      subCastName: data.subcast?.name || '',
      subCaste: data.subcast?.name || '',
      religionId: data.religion?.id || null,
      religionName: data.religion?.name || '',
      // Profile image
      profilePhoto: data.ProfileImage || data.profileImage || state.profilePhoto,
    };
  }),

  resetComplaintForm: () => set(defaultComplaintForm),
}));
