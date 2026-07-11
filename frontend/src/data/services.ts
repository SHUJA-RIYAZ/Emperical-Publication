import type { Service } from "@/types";

interface ServiceSeed {
  title: string;
  short: string;
  icon: string;
  category: Service["category"];
  features: string[];
  popular?: boolean;
}

const SEEDS: ServiceSeed[] = [
  { title: "Manuscript Evaluation", short: "Expert assessment of your manuscript's readiness for publication.", icon: "file-search", category: "Editorial", features: ["Detailed evaluation report", "Market positioning analysis", "Revision roadmap", "Response within 3 weeks"], popular: true },
  { title: "Developmental Editing", short: "Structural editing that shapes your argument and narrative arc.", icon: "pen-line", category: "Editorial", features: ["Chapter-level restructuring", "Argument coherence review", "Audience alignment", "Two revision rounds"] },
  { title: "Copyediting & Proofreading", short: "Meticulous line editing to Chicago, APA, or house style.", icon: "spell-check", category: "Editorial", features: ["Grammar and style correction", "Citation formatting", "Consistency checks", "Final proofread pass"], popular: true },
  { title: "Scientific & Technical Editing", short: "Specialist editors for STEM manuscripts with complex notation.", icon: "flask-conical", category: "Editorial", features: ["Subject-expert editors", "Equation and notation review", "Figure caption editing", "Terminology consistency"] },
  { title: "Academic Translation", short: "Scholarly translation across five major languages.", icon: "languages", category: "Editorial", features: ["Native-speaker translators", "Discipline-specific terminology", "Back-translation QA", "Simultaneous editions"] },
  { title: "Peer Review Management", short: "Rigorous double-blind review coordinated end to end.", icon: "users", category: "Editorial", features: ["Reviewer identification", "Double-blind process", "Structured review reports", "Editorial board oversight"] },
  { title: "Cover Design", short: "Award-winning cover design tailored to academic markets.", icon: "palette", category: "Production", features: ["Three original concepts", "Unlimited revisions", "Series design available", "Print and digital variants"], popular: true },
  { title: "Typesetting & Layout", short: "Professional interior design for print and digital.", icon: "layout-template", category: "Production", features: ["LaTeX and InDesign workflows", "Complex tables and equations", "Accessible PDF output", "Multilingual typesetting"] },
  { title: "E-book Conversion", short: "Reflowable and fixed-layout e-books for every platform.", icon: "tablet", category: "Production", features: ["EPUB 3 and Kindle formats", "Accessibility compliance", "Interactive elements", "Quality assurance on 12 devices"] },
  { title: "ISBN & DOI Registration", short: "Complete identifier management for global discoverability.", icon: "barcode", category: "Production", features: ["ISBN assignment", "DOI registration via Crossref", "Cataloguing-in-Publication data", "Metadata distribution"] },
  { title: "Print-on-Demand", short: "Global POD network with bookstore-quality output.", icon: "printer", category: "Production", features: ["Facilities on 3 continents", "Hardcover and paperback", "48-hour fulfilment", "No inventory risk"] },
  { title: "Audiobook Production", short: "Studio-quality audiobook narration and mastering.", icon: "mic", category: "Production", features: ["Professional narrators", "Full studio production", "Distribution to major platforms", "Author-read options"] },
  { title: "Global Distribution", short: "Placement in 92 countries via wholesalers and retailers.", icon: "globe", category: "Distribution", features: ["92-country retail network", "Library supply channels", "Major online retailers", "Sales reporting dashboard"], popular: true },
  { title: "Library Outreach", short: "Dedicated campaigns targeting academic libraries worldwide.", icon: "library", category: "Distribution", features: ["Approval plan placement", "Library catalogue feeds", "Consortium negotiations", "Usage analytics"] },
  { title: "Institutional Licensing", short: "Site licences and coursepack permissions handled for you.", icon: "building", category: "Distribution", features: ["Campus-wide licences", "Coursepack clearances", "Interlibrary loan terms", "Revenue share reporting"] },
  { title: "Book Marketing Campaigns", short: "Targeted campaigns that reach your scholarly audience.", icon: "megaphone", category: "Marketing", features: ["Launch strategy", "Academic media outreach", "Conference presence", "Email campaigns to 40k subscribers"], popular: true },
  { title: "Review Placement", short: "Securing reviews in leading journals and trade media.", icon: "star", category: "Marketing", features: ["Journal review copies", "Reviewer targeting", "Trade media pitches", "Review tracking reports"] },
  { title: "Author Website & Branding", short: "A professional web presence for you and your book.", icon: "monitor", category: "Marketing", features: ["Custom author site", "SEO optimisation", "Social media kit", "Analytics setup"] },
  { title: "Royalty Management", short: "Transparent quarterly royalties in 90+ currencies.", icon: "wallet", category: "Author Services", features: ["Quarterly statements", "Multi-currency payments", "Real-time sales dashboard", "Tax documentation support"] },
  { title: "Author Mentorship Programme", short: "One-to-one guidance for first-time academic authors.", icon: "graduation-cap", category: "Author Services", features: ["Dedicated publishing mentor", "Proposal development", "Writing workshops", "Career-long support"] },
];

export const services: Service[] = SEEDS.map((seed, i) => ({
  id: `service-${i + 1}`,
  slug: seed.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-"),
  title: seed.title,
  shortDescription: seed.short,
  description: `${seed.short} Our ${seed.category.toLowerCase()} team brings decades of combined experience from leading international publishing houses, ensuring every project meets the exacting standards expected of a premier academic imprint. The service is available as part of our full publishing packages or as a standalone engagement for authors and institutions.`,
  icon: seed.icon,
  features: seed.features,
  category: seed.category,
  popular: seed.popular,
}));
