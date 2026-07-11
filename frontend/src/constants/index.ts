export const SITE = {
  name: "Emperical International Publication",
  shortName: "Emperical",
  tagline: "Advancing Knowledge, Publishing Excellence",
  description:
    "Emperical International Publication is a premier global academic publisher of books, journals, and scholarly research across science, medicine, engineering, and the humanities.",
  email: "contact@empericalpublication.com",
  phone: "+1 (212) 555-0184",
  address: "One Scholars Plaza, Suite 1200, New York, NY 10016, USA",
  founded: 1998,
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Books", href: "/books" },
  { label: "Authors", href: "/authors" },
  { label: "Journals", href: "/journals" },
  { label: "Publish Your Book", href: "/publish" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  explore: [
    { label: "Books Catalogue", href: "/books" },
    { label: "Journals", href: "/journals" },
    { label: "Author Directory", href: "/authors" },
    { label: "Blog & Insights", href: "/blog" },
  ],
  services: [
    { label: "Publish Your Book", href: "/publish" },
    { label: "All Services", href: "/services" },
    { label: "Editorial Services", href: "/services#editorial" },
    { label: "Global Distribution", href: "/services#distribution" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/about#careers" },
    { label: "FAQs", href: "/contact#faq" },
  ],
} as const;

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com",
  linkedin: "https://linkedin.com",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
} as const;

export const OFFICES = [
  { city: "New York (HQ)", address: SITE.address, hours: "Mon–Fri, 9:00–17:30 EST" },
  { city: "London", address: "48 Bloomsbury Court, London WC1A 2QS, United Kingdom", hours: "Mon–Fri, 9:00–17:30 GMT" },
  { city: "Singapore", address: "12 Science Park Drive, #04-08, Singapore 118225", hours: "Mon–Fri, 9:00–18:00 SGT" },
] as const;

export const BOOK_CATEGORIES = [
  "Science & Technology",
  "Medicine & Health",
  "Engineering",
  "Business & Economics",
  "Social Sciences",
  "Humanities",
  "Law",
  "Education",
  "Environmental Science",
  "Mathematics",
] as const;

export const BOOK_LANGUAGES = ["English", "Spanish", "French", "German", "Arabic"] as const;

export const STATS = [
  { label: "Books Published", value: 4200, suffix: "+" },
  { label: "Authors Worldwide", value: 1800, suffix: "+" },
  { label: "Countries Reached", value: 92, suffix: "" },
  { label: "Years of Excellence", value: 27, suffix: "" },
] as const;

export const TRUSTED_BY = [
  "Harvard University",
  "University of Oxford",
  "ETH Zürich",
  "National University of Singapore",
  "University of Tokyo",
  "MIT Press Consortium",
  "Max Planck Society",
  "Indian Institute of Science",
  "University of Toronto",
  "KU Leuven",
] as const;

export const PUBLISHING_PROCESS = [
  {
    step: 1,
    title: "Manuscript Submission",
    description:
      "Submit your manuscript through our online portal along with a synopsis and author profile.",
  },
  {
    step: 2,
    title: "Editorial Review",
    description:
      "Our editorial board conducts a rigorous double-blind peer review within 4–6 weeks.",
  },
  {
    step: 3,
    title: "Contract & Planning",
    description:
      "Accepted works receive a transparent publishing agreement and a tailored production plan.",
  },
  {
    step: 4,
    title: "Editing & Design",
    description:
      "Professional copyediting, typesetting, and award-winning cover design bring your work to life.",
  },
  {
    step: 5,
    title: "Production & ISBN",
    description:
      "We handle ISBN registration, DOI assignment, printing, and e-book conversion.",
  },
  {
    step: 6,
    title: "Global Launch",
    description:
      "Your book is distributed to 92 countries with dedicated marketing and library outreach.",
  },
] as const;

export const SAMPLE_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
