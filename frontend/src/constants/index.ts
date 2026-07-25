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

export const ABOUT_VALUES = [
  { icon: "scale", title: "Integrity First", description: "Double-blind peer review, transparent contracts, and zero tolerance for predatory practices. Our reputation is our product." },
  { icon: "globe", title: "Global by Design", description: "Multilingual publishing, equitable pricing for the Global South, and distribution built for every continent." },
  { icon: "heart-handshake", title: "Authors as Partners", description: "Fair royalties, dedicated support, and mentorship. When our authors succeed, scholarship succeeds." },
  { icon: "sparkles", title: "Craft & Care", description: "Award-winning design and meticulous production. Books are cultural artefacts — we treat them that way." },
] as const;

export const ABOUT_MILESTONES = [
  { year: 1998, event: "Founded in New York as a specialist science imprint with three journals." },
  { year: 2004, event: "First international office opens in London; book programme launches." },
  { year: 2010, event: "Open access programme established — among the first mid-size publishers to commit." },
  { year: 2015, event: "1,000th book published; distribution network reaches 60 countries." },
  { year: 2019, event: "Author mentorship programme launches; multilingual publishing expands to five languages." },
  { year: 2023, event: "Print-on-demand facilities open on three continents; 4,000th title released." },
  { year: 2026, event: "Fifteen journals, 4,200+ books, and a community of 1,800 authors across 92 countries." },
] as const;

export const LEADERSHIP = [
  { name: "Dr. Helena Marchetti", role: "Chief Executive Officer", bio: "Former editorial director at a major European science publisher; 25 years in scholarly publishing." },
  { name: "Prof. Samuel Adeyinka", role: "Editor-in-Chief", bio: "Emeritus professor of chemistry and champion of open science across the Global South." },
  { name: "Margaret Chen", role: "Director of Open Research", bio: "Architect of our open access programme and Research4Life partnership." },
  { name: "Tomás Herrera", role: "Head of Production & Design", bio: "Leads the studio behind 14 international book design awards." },
  { name: "Rebecca Osei", role: "Director of Library Relations", bio: "Builds the library partnerships that carry our titles into 92 countries." },
  { name: "Dr. Jonathan Pierce", role: "Senior Commissioning Editor", bio: "Has shepherded over 400 monographs from proposal to publication." },
] as const;

export const WHY_CHOOSE_US = [
  { icon: "shield-check", title: "Uncompromising Peer Review", description: "Every title is vetted by at least two subject experts through a double-blind process overseen by our 300-member editorial board." },
  { icon: "globe", title: "Genuinely Global Reach", description: "Distribution partnerships in 92 countries, print-on-demand on three continents, and e-books on every major platform." },
  { icon: "hand-coins", title: "Fair, Transparent Royalties", description: "Up to 25% royalties on net receipts, quarterly statements, and a real-time sales dashboard — no fine print." },
  { icon: "clock", title: "Predictable Timelines", description: "Editorial decisions in 4–6 weeks and publication within 6–9 months of contract. We publish on schedule, every time." },
  { icon: "users", title: "Author-First Support", description: "A dedicated author-services manager from submission to post-launch, plus mentorship for first-time academic authors." },
  { icon: "award", title: "Award-Winning Production", description: "Our design studio has won 14 international book design awards. Complex equations, figures, and multilingual text — handled." },
] as const;

export const CONTACT_DEPARTMENTS = [
  "Editorial & Submissions",
  "Author Services & Royalties",
  "Sales & Distribution",
  "Rights & Permissions",
  "Press & Media",
  "General Enquiries",
] as const;

export const SAMPLE_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
