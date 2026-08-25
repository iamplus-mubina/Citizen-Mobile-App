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
  setCategory: (value: string) => void;
  setDetails: (title: string, description: string, priority: string) => void;
  setLocation: (address: string, area: string, ward: string, pincode: string) => void;
  setAttachments: (photoCount: number, documentCount: number) => void;
  submitComplaint: () => void;
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
    ticketId: 'CMP-1024',
    title: 'Road Repair',
    category: 'Infrastructure',
    description: 'Road Repair needed in Ward 5',
    priority: 'Medium',
    address: 'Main Road',
    area: 'Shivajinagar',
    ward: 'Ward 5',
    pincode: '411005',
    photoCount: 0,
    documentCount: 0,
    date: '12 May 2024',
    status: 'In Progress',
  }
];

export const useComplaintStore = create<ComplaintFormState>((set) => ({
  ...defaultState,
  submittedComplaints: initialComplaints,
  setCategory: (category) => set({ category }),
  setDetails: (title, description, priority) => set({ title, description, priority }),
  setLocation: (address, area, ward, pincode) => set({ address, area, ward, pincode }),
  setAttachments: (photoCount, documentCount) => set({ photoCount, documentCount }),
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
