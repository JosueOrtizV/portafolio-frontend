export interface Project {
  id: number;
  title: string;
  title_en?: string | null;
  slug: string;
  short_description: string;
  short_description_en?: string | null;
  description: string;
  description_en?: string | null;
  technologies: string[];
  url_repo?: string | null;
  url_demo?: string | null;
  image_principal?: string | null;
  images?: string[] | null;
  order: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  name_en?: string | null;
  icon?: string | null;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  skill_type?: 'soft' | 'hard' | null;
  level: number;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  full_name: string;
  profession: string;
  profession_en?: string | null;
  tagline?: string | null;
  tagline_en?: string | null;
  biography: string;
  biography_en?: string | null;
  highlights?: Array<{ text_es: string; text_en: string }> | null;
  photo?: string | null;
  hero_photo?: string | null;
  cv_link?: string | null;
  cv_link_en?: string | null;
  certifications_link?: string | null;
  email: string;
  location: string;
  social_networks: {
    linkedin?: string;
    github?: string;
    whatsapp?: string;
    phone?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  company_name: string;
  position: string;
  position_en?: string | null;
  description: string;
  description_en?: string | null;
  start_date: string;
  end_date?: string | null;
  company_logo?: string | null;
  company_url?: string | null;
  location?: string | null;
  type: 'job' | 'practices' | 'freelance';
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  degree_en?: string | null;
  field_of_study?: string | null;
  field_of_study_en?: string | null;
  description?: string | null;
  description_en?: string | null;
  start_date: string;
  end_date?: string | null;
  institution_logo?: string | null;
  institution_url?: string | null;
  location?: string | null;
  type: 'university' | 'language' | 'course' | 'other';
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: number;
  title: string;
  title_en?: string | null;
  issuing_organization: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  image?: string | null;
  description?: string | null;
  description_en?: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  is_read: boolean;
  read_at?: string | null;
  ip_address?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
}
