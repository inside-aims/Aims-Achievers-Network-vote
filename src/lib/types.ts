export interface Category {
  id: string;
  created_at?: string;
  name: string;
  image: string;
  description: string;
  eventID: number;
}

export interface CategoryGridProps {
  categories: Category[];
}

export interface CategoryCardProps {
  category: Category;
}

export interface Nominee {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  shortcode: string | null;
  secretkey: string | null;
  categoryID: string;
  eventId: number | null;
  image: string | null;
  votes: number;
  showVote: boolean;
}

export interface NomineeCardProps {
  nominee: Nominee;
}

export interface NominationModalProps {
  setIsOpen: (isOpen: boolean) => void;
  categoryId: string;
}

export interface VerifyModalProps {
  setIsOpen: (isOpen: boolean) => void;
  secretkey: string | null;
  onVerified: () => void;
}

export interface EventDetails {
  id: number;
  name: string;
  bulkVote: boolean;
  showVote: boolean;
}

export interface NomineeCategory {
  id: string;
  name: string;
  image: string;
  eventID: number;
  created_at: string;
  description: string;
}

export interface NomineeWithDetails {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  shortcode: string | null;
  secretkey: string | null;
  categoryID: string;
  eventId: EventDetails;
  image: string;
  category: NomineeCategory;
}

export interface CustomField {
  display_name: string;
  variable_name: string;
  value: string | number;
}

export interface PaymentMetadata {
  custom_fields?: CustomField[];
}


export interface Nomineee {
  id: string
  name: string
  stage_name: string
  image: string | null
  category: {
    id: string
    name: string
  }
  totalVotes: number,
  totalAmount: number
}

export interface Category {
  id: string
  name: string
  votes: number
}

export interface CategoryWithNominees extends Category {
  nominees: Nomineee[]
}

export interface VoteData {
  nominees: Nomineee[]
  categories: Category[]
  categoriesWithNominees: CategoryWithNominees[]
}
