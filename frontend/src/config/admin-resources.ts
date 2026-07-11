import { BOOK_CATEGORIES, BOOK_LANGUAGES } from "@/constants";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "decimal"
  | "checkbox"
  | "select"
  | "tags" // comma-separated -> string[]
  | "paragraphs" // blank-line separated -> string[]
  | "json" // raw JSON editor for structured fields
  | "date"
  | "authors"; // multi-select of author ids (books only)

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  options?: readonly string[];
  required?: boolean;
  colSpan?: 1 | 2;
  help?: string;
}

export type AdminColumnType = "text" | "bool" | "badge" | "price" | "number" | "date";

export interface AdminColumn {
  key: string;
  label: string;
  type?: AdminColumnType;
}

export interface AdminResource {
  slug: string;
  title: string;
  singular: string;
  columns: AdminColumn[];
  fields: AdminField[];
  searchKeys: string[];
}

export const ADMIN_RESOURCES: Record<string, AdminResource> = {
  books: {
    slug: "books",
    title: "Books",
    singular: "book",
    searchKeys: ["title", "category", "isbn"],
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category", type: "badge" },
      { key: "publicationYear", label: "Year", type: "number" },
      { key: "price", label: "Price", type: "price" },
      { key: "featured", label: "Featured", type: "bool" },
      { key: "bestseller", label: "Bestseller", type: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { name: "subtitle", label: "Subtitle", type: "text", colSpan: 2 },
      { name: "description", label: "Description", type: "textarea", required: true, colSpan: 2 },
      { name: "category", label: "Category", type: "select", options: BOOK_CATEGORIES, required: true },
      { name: "language", label: "Language", type: "select", options: BOOK_LANGUAGES, required: true },
      { name: "publicationYear", label: "Publication year", type: "number", required: true },
      { name: "publicationDate", label: "Publication date", type: "date", required: true },
      { name: "isbn", label: "ISBN", type: "text" },
      { name: "pages", label: "Pages", type: "number" },
      { name: "price", label: "Price (USD)", type: "decimal" },
      { name: "rating", label: "Rating (0–5)", type: "decimal" },
      { name: "reviewsCount", label: "Reviews count", type: "number" },
      { name: "formats", label: "Formats", type: "tags", help: "Comma-separated: Hardcover, Paperback, eBook" },
      { name: "tags", label: "Tags", type: "tags", help: "Comma-separated keywords", colSpan: 2 },
      { name: "authorIds", label: "Authors", type: "authors", colSpan: 2 },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "bestseller", label: "Bestseller", type: "checkbox" },
    ],
  },
  authors: {
    slug: "authors",
    title: "Authors",
    singular: "author",
    searchKeys: ["name", "institution", "country"],
    columns: [
      { key: "name", label: "Name" },
      { key: "institution", label: "Institution" },
      { key: "country", label: "Country", type: "badge" },
      { key: "hIndex", label: "h-index", type: "number" },
      { key: "featured", label: "Featured", type: "bool" },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "title", label: "Academic title", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "department", label: "Department", type: "text" },
      { name: "country", label: "Country", type: "text", required: true },
      { name: "email", label: "Email", type: "text" },
      { name: "bio", label: "Biography", type: "textarea", colSpan: 2 },
      { name: "researchInterests", label: "Research interests", type: "tags", colSpan: 2, help: "Comma-separated" },
      { name: "hIndex", label: "h-index", type: "number" },
      { name: "citations", label: "Citations", type: "number" },
      { name: "booksPublished", label: "Books published", type: "number" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "publications", label: "Publications (JSON)", type: "json", colSpan: 2, help: 'Array of {"title","venue","year","type"}' },
      { name: "social", label: "Social links (JSON)", type: "json", colSpan: 2, help: 'Object, e.g. {"linkedin":"https://…"}' },
    ],
  },
  blogs: {
    slug: "blogs",
    title: "Blog Posts",
    singular: "blog post",
    searchKeys: ["title", "category", "authorName"],
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category", type: "badge" },
      { key: "authorName", label: "Author" },
      { key: "publishedAt", label: "Published", type: "date" },
      { key: "featured", label: "Featured", type: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, colSpan: 2 },
      { name: "content", label: "Content", type: "paragraphs", required: true, colSpan: 2, help: "Separate paragraphs with a blank line" },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "tags", label: "Tags", type: "tags", help: "Comma-separated" },
      { name: "authorName", label: "Author name", type: "text", required: true },
      { name: "authorRole", label: "Author role", type: "text" },
      { name: "publishedAt", label: "Publish date", type: "date", required: true },
      { name: "readTimeMinutes", label: "Read time (min)", type: "number" },
      { name: "featured", label: "Featured", type: "checkbox" },
    ],
  },
  journals: {
    slug: "journals",
    title: "Journals",
    singular: "journal",
    searchKeys: ["title", "field"],
    columns: [
      { key: "title", label: "Title" },
      { key: "field", label: "Field", type: "badge" },
      { key: "impactFactor", label: "IF", type: "number" },
      { key: "frequency", label: "Frequency" },
      { key: "openAccess", label: "Open Access", type: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      { name: "field", label: "Field", type: "text", required: true },
      { name: "editorInChief", label: "Editor-in-Chief", type: "text" },
      { name: "issn", label: "ISSN", type: "text" },
      { name: "eIssn", label: "e-ISSN", type: "text" },
      { name: "impactFactor", label: "Impact factor", type: "decimal" },
      { name: "citeScore", label: "CiteScore", type: "decimal" },
      { name: "frequency", label: "Frequency", type: "select", options: ["Monthly", "Bimonthly", "Quarterly", "Biannually"] },
      { name: "established", label: "Established (year)", type: "number" },
      { name: "acceptanceRate", label: "Acceptance rate (%)", type: "number" },
      { name: "reviewTimeWeeks", label: "Review time (weeks)", type: "number" },
      { name: "indexing", label: "Indexing", type: "tags", colSpan: 2, help: "Comma-separated: Scopus, Web of Science…" },
      { name: "openAccess", label: "Open access", type: "checkbox" },
    ],
  },
  services: {
    slug: "services",
    title: "Services",
    singular: "service",
    searchKeys: ["title", "category"],
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category", type: "badge" },
      { key: "icon", label: "Icon" },
      { key: "popular", label: "Popular", type: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { name: "shortDescription", label: "Short description", type: "textarea", required: true, colSpan: 2 },
      { name: "description", label: "Full description", type: "textarea", colSpan: 2 },
      { name: "category", label: "Category", type: "select", options: ["Editorial", "Production", "Distribution", "Marketing", "Author Services"], required: true },
      { name: "icon", label: "Icon key", type: "text", help: "e.g. pen-line, globe, palette" },
      { name: "features", label: "Features", type: "tags", colSpan: 2, help: "Comma-separated bullet points" },
      { name: "popular", label: "Popular", type: "checkbox" },
    ],
  },
  testimonials: {
    slug: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    searchKeys: ["name", "institution"],
    columns: [
      { key: "name", label: "Name" },
      { key: "institution", label: "Institution" },
      { key: "rating", label: "Rating", type: "number" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "institution", label: "Institution", type: "text" },
      { name: "rating", label: "Rating (1–5)", type: "number", required: true },
      { name: "quote", label: "Quote", type: "textarea", required: true, colSpan: 2 },
    ],
  },
  faqs: {
    slug: "faqs",
    title: "FAQs",
    singular: "FAQ",
    searchKeys: ["question", "category"],
    columns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category", type: "badge" },
    ],
    fields: [
      { name: "question", label: "Question", type: "textarea", required: true, colSpan: 2 },
      { name: "answer", label: "Answer", type: "textarea", required: true, colSpan: 2 },
      { name: "category", label: "Category", type: "select", options: ["General", "Publishing", "Royalties", "Submissions", "Support"], required: true },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },
};
