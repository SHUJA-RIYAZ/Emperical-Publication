export type BookFormat = "Hardcover" | "Paperback" | "eBook";

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  authorIds: string[];
  category: string;
  language: string;
  publicationYear: number;
  publicationDate: string; // ISO date
  isbn: string;
  pages: number;
  price: number;
  formats: BookFormat[];
  rating: number;
  reviewsCount: number;
  tags: string[];
  featured?: boolean;
  bestseller?: boolean;
}

export interface AuthorPublication {
  title: string;
  venue: string;
  year: number;
  type: "Journal Article" | "Book Chapter" | "Conference Paper" | "Monograph";
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  title: string;
  institution: string;
  department: string;
  country: string;
  bio: string;
  researchInterests: string[];
  publications: AuthorPublication[];
  email: string;
  social: {
    twitter?: string;
    linkedin?: string;
    orcid?: string;
    googleScholar?: string;
    website?: string;
  };
  hIndex: number;
  citations: number;
  booksPublished: number;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // paragraphs
  category: string;
  tags: string[];
  authorName: string;
  authorRole: string;
  publishedAt: string; // ISO date
  readTimeMinutes: number;
  featured?: boolean;
}

export interface Journal {
  id: string;
  slug: string;
  title: string;
  issn: string;
  eIssn: string;
  field: string;
  impactFactor: number;
  citeScore: number;
  frequency: "Monthly" | "Bimonthly" | "Quarterly" | "Biannually";
  openAccess: boolean;
  description: string;
  editorInChief: string;
  established: number;
  acceptanceRate: number;
  reviewTimeWeeks: number;
  indexing: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Publishing" | "Royalties" | "Submissions" | "Support";
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string; // lucide icon key, resolved in ServiceIcon component
  features: string[];
  category: "Editorial" | "Production" | "Distribution" | "Marketing" | "Author Services";
  popular?: boolean;
}

export interface PublishingRequest {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  affiliation: string;
  bookTitle: string;
  category: string;
  language: string;
  wordCount: string;
  synopsis: string;
  manuscriptFileName?: string;
  agreedToTerms: boolean;
  isOriginalWork: boolean;
}

export interface ContactMessage {
  name: string;
  email: string;
  department: string;
  subject: string;
  message: string;
}

export interface SiteInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  founded: number;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

export interface OfficeItem {
  city: string;
  address: string;
  hours: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface SiteSettings {
  site: SiteInfo;
  stats: StatItem[];
  trustedBy: string[];
  socials: Record<string, string>;
  offices: OfficeItem[];
  process: ProcessStep[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BookQuery {
  search?: string;
  category?: string;
  language?: string;
  year?: string;
  sort?: "newest" | "oldest" | "title-asc" | "title-desc" | "price-asc" | "price-desc" | "rating";
  page?: number;
  pageSize?: number;
}

export interface AuthorQuery {
  search?: string;
  country?: string;
  interest?: string;
}

export interface BlogQuery {
  search?: string;
  category?: string;
  tag?: string;
}
