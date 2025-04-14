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
}

export interface NomineeCardProps {
  nominee: Nominee;
}

export interface NominationModalProps {
  setIsOpen: (isOpen: boolean) => void;
  categoryId: string;
}