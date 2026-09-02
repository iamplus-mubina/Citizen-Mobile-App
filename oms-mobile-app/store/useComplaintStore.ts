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
  setCategory: (value: string) => void;
  setDetails: (title: string, description: string, priority: string) => void;
  setLocation: (address: string, area: string, ward: string, pincode: string) => void;
  setAttachments: (photoCount: number, documentCount: number) => void;
  submitComplaint: () => void;
  setProfilePhoto: (uri: string | null) => void;
  setPhoneNumber: (phone: string) => void;
  setProfile: (profileName: string, profileEmail: string, profileAddress: string, profilePincode: string) => void;
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

const initialComplaints: SubmittedComplaint[] = [
  {
    ticketId: 'CMP-1025',
    title: 'Pipeline Leakage',
    category: 'Water Supply',
    description: 'Pipeline leakage in main street causing water waste.',
    priority: 'High',
    address: 'Main Street',
    area: 'Shivajinagar',
    ward: 'Ward 2',
    pincode: '411005',
    photoCount: 1,
    documentCount: 0,
    date: '12 May 2024, 10:30 AM',
    status: 'Pending Verification',
  },
  {
    ticketId: 'CMP-1024',
    title: 'Road Repair',
    category: 'Roads & Potholes',
    description: 'Road Repair needed in Ward 1 due to large potholes.',
    priority: 'Medium',
    address: 'Main Road',
    area: 'Shivajinagar',
    ward: 'Ward 1',
    pincode: '411005',
    photoCount: 0,
    documentCount: 0,
    date: '12 May 2024, 02:15 PM',
    status: 'In Progress',
  },
  {
    ticketId: 'CMP-1023',
    title: 'Street Light Not Working',
    category: 'Street Lighting',
    description: 'Street light near the community park is completely broken.',
    priority: 'Medium',
    address: 'Park Avenue',
    area: 'Shivajinagar',
    ward: 'Ward 3',
    pincode: '411005',
    photoCount: 0,
    documentCount: 0,
    date: '10 May 2024, 06:45 PM',
    status: 'Resolved',
  },
  {
    ticketId: 'CMP-1022',
    title: 'Garbage Collection Issue',
    category: 'Sanitation',
    description: 'Garbage has not been collected for the past 3 days.',
    priority: 'High',
    address: 'Street 4',
    area: 'Shivajinagar',
    ward: 'Ward 5',
    pincode: '411005',
    photoCount: 0,
    documentCount: 0,
    date: '08 May 2024, 09:00 AM',
    status: 'Pending Verification',
  },
  {
    ticketId: 'CMP-1021',
    title: 'Drainage Blockage',
    category: 'Sewerage',
    description: 'Drainage is completely blocked causing waterlogging on the street.',
    priority: 'High',
    address: 'Market Road',
    area: 'Shivajinagar',
    ward: 'Ward 4',
    pincode: '411005',
    photoCount: 0,
    documentCount: 0,
    date: '05 May 2024, 11:20 AM',
    status: 'In Progress',
  }
];

export const useComplaintStore = create<ComplaintFormState>((set) => ({
  ...defaultState,
  submittedComplaints: initialComplaints,
  profilePhoto: null,
  phoneNumber: '+91 9876543210',
  profileName: 'Rahul Sharma',
  profileEmail: 'rahul@example.com',
  profileAddress: 'Street 12, Green Park, Bhopal',
  profilePincode: '462001',
  setCategory: (category) => set({ category }),
  setDetails: (title, description, priority) => set({ title, description, priority }),
  setLocation: (address, area, ward, pincode) => set({ address, area, ward, pincode }),
  setAttachments: (photoCount, documentCount) => set({ photoCount, documentCount }),
  setProfilePhoto: (profilePhoto) => set({ profilePhoto }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setProfile: (profileName, profileEmail, profileAddress, profilePincode) => set({ profileName, profileEmail, profileAddress, profilePincode }),
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
