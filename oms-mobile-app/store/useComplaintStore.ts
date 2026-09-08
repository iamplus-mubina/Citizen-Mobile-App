import { create } from 'zustand';

export interface SubmittedComplaint {
  ticketId: string;
  title: string;
  category: string;
  description: string;
  priority: string;
  address: string;
  area: string;
  ward: string;
  pincode: string;
  photoCount: number;
  documentCount: number;
  date: string;
  status: string;
}

interface ComplaintFormState {
  category: string;
  title: string;
  description: string;
  priority: string;
  address: string;
  area: string;
  ward: string;
  pincode: string;
  photoCount: number;
  documentCount: number;
  submittedComplaints: SubmittedComplaint[];
  profilePhoto: string | null;
  phoneNumber: string;
  profileName: string;
  profileEmail: string;
  profileAddress: string;
  profilePincode: string;
  dob: string;
  age: string;
  education: string;
  occupation: string;
  aadharCard: string;
  panCard: string;
  voterId: string;
  rationCard: string;
  caste: string;
  subCaste: string;
  voterAccountNumber: string;
  voterPartNumber: string;
  voterSectionNumber: string;
  voterSlnNumber: string;
  ourVoter: boolean;
  setCategory: (value: string) => void;
  setDetails: (title: string, description: string, priority: string) => void;
  setLocation: (address: string, area: string, ward: string, pincode: string) => void;
  setAttachments: (photoCount: number, documentCount: number) => void;
  submitComplaint: () => void;
  setComplaints: (complaints: any[]) => void;
  setProfilePhoto: (uri: string | null) => void;
  setPhoneNumber: (phone: string) => void;
  setProfile: (profileData: Partial<ComplaintFormState>) => void;
  resetForm: () => void;
}

const defaultState = {
  category: '',
  title: '',
  description: '',
  priority: 'Medium',
  address: '',
  area: '',
  ward: '',
  pincode: '',
  photoCount: 0,
  documentCount: 0,
};

const initialComplaints: SubmittedComplaint[] = [];

export const useComplaintStore = create<ComplaintFormState>((set) => ({
  ...defaultState,
  submittedComplaints: initialComplaints,
  profilePhoto: null,
  phoneNumber: '',
  profileName: 'Citizen User',
  profileEmail: '',
  profileAddress: '',
  profilePincode: '',
  dob: '',
  age: '',
  education: '',
  occupation: '',
  aadharCard: '',
  panCard: '',
  voterId: '',
  rationCard: '',
  caste: '',
  subCaste: '',
  voterAccountNumber: '',
  voterPartNumber: '',
  voterSectionNumber: '',
  voterSlnNumber: '',
  ourVoter: false,
  setCategory: (category) => set({ category }),
  setDetails: (title, description, priority) => set({ title, description, priority }),
  setLocation: (address, area, ward, pincode) => set({ address, area, ward, pincode }),
  setAttachments: (photoCount, documentCount) => set({ photoCount, documentCount }),
  setProfilePhoto: (profilePhoto) => set({ profilePhoto }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setProfile: (profileData) => set((state) => ({ ...state, ...profileData })),
  setComplaints: (complaints) => set({
    submittedComplaints: complaints.map((c: any) => ({
      ticketId: c.tokenNumber || `REQ-${c.requestId || c.id}`,
      title: c.description?.substring(0, 50) || 'Complaint',
      category: c.category?.name || '',
      description: c.description || '',
      priority: 'Medium',
      address: '',
      area: '',
      ward: '',
      pincode: '',
      photoCount: c.documents?.length || 0,
      documentCount: 0,
      date: c.createdDate ? new Date(c.createdDate).toLocaleDateString('en-IN') : '',
      status: c.liveStatus || c.requestStatus || 'PENDING',
    }))
  }),
  submitComplaint: () => set((state) => {
    const nextTicketNumber = state.submittedComplaints.length > 0
      ? Math.max(...state.submittedComplaints.map(c => parseInt(c.ticketId.replace('CMP-', '')))) + 1
      : 1025;

    const date = new Date();
    const day = date.getDate();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const formattedDate = `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;

    const newComplaint: SubmittedComplaint = {
      ticketId: `CMP-${nextTicketNumber}`,
      title: state.title || `${state.category || 'General'} Complaint`,
      category: state.category,
      description: state.description,
      priority: state.priority,
      address: state.address,
      area: state.area,
      ward: state.ward,
      pincode: state.pincode,
      photoCount: state.photoCount,
      documentCount: state.documentCount,
      date: formattedDate,
      status: 'Pending',
    };

    return {
      submittedComplaints: [newComplaint, ...state.submittedComplaints],
    };
  }),
  resetForm: () => set(defaultState),
}));
