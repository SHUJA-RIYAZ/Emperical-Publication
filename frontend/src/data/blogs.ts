import type { BlogPost } from "@/types";

interface BlogSeed {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorName: string;
  authorRole: string;
  featured?: boolean;
}

const SEEDS: BlogSeed[] = [
  { title: "The Future of Open Access: What Authors Need to Know in 2026", excerpt: "Open access mandates are reshaping scholarly publishing. We break down the funding models, licence choices, and what they mean for your next book or article.", category: "Publishing Insights", tags: ["Open Access", "Policy", "Funding"], authorName: "Margaret Chen", authorRole: "Director of Open Research", featured: true },
  { title: "How to Turn Your PhD Thesis into a Published Monograph", excerpt: "A dissertation and a book serve different readers. Our senior editors share a practical roadmap for restructuring your thesis for a scholarly audience.", category: "Author Guides", tags: ["Thesis", "Monograph", "Writing"], authorName: "Dr. Jonathan Pierce", authorRole: "Senior Commissioning Editor", featured: true },
  { title: "Peer Review in the Age of AI: Safeguarding Research Integrity", excerpt: "Generative AI is changing how manuscripts are written and reviewed. Here is how our editorial board is adapting review protocols to protect integrity.", category: "Research Integrity", tags: ["Peer Review", "AI", "Ethics"], authorName: "Prof. Alison Grant", authorRole: "Chair, Ethics Committee", featured: true },
  { title: "Writing an Irresistible Book Proposal: A Commissioning Editor's View", excerpt: "What separates proposals that get contracts from those that get polite rejections? An insider's checklist from twenty years of acquisitions.", category: "Author Guides", tags: ["Book Proposal", "Writing", "Acquisitions"], authorName: "Dr. Jonathan Pierce", authorRole: "Senior Commissioning Editor" },
  { title: "Understanding Impact Factors, CiteScore, and Altmetrics", excerpt: "Journal metrics are often misunderstood and misused. We explain what each metric actually measures and how to interpret them responsibly.", category: "Research Metrics", tags: ["Impact Factor", "Metrics", "Journals"], authorName: "Dr. Yusuf Adeyemi", authorRole: "Head of Journal Analytics" },
  { title: "Five Common Reasons Manuscripts Are Rejected — and How to Avoid Them", excerpt: "Our editorial board reviews over 3,000 submissions a year. These are the recurring issues that sink otherwise promising manuscripts.", category: "Author Guides", tags: ["Submissions", "Rejection", "Editing"], authorName: "Sarah Lindqvist", authorRole: "Managing Editor" },
  { title: "The Rise of Multilingual Academic Publishing", excerpt: "English is no longer the only language of scholarship. How simultaneous multilingual editions are expanding readership and citation reach.", category: "Publishing Insights", tags: ["Translation", "Multilingual", "Global South"], authorName: "Margaret Chen", authorRole: "Director of Open Research" },
  { title: "Designing Accessible Academic Books: Beyond Compliance", excerpt: "Accessibility is not a checkbox — it is good publishing. Our production team on EPUB accessibility, alt text for figures, and inclusive design.", category: "Production", tags: ["Accessibility", "EPUB", "Design"], authorName: "Tomás Herrera", authorRole: "Head of Digital Production" },
  { title: "How Academic Libraries Decide What to Buy", excerpt: "Library budgets are tighter than ever. We spoke with acquisition librarians on three continents about what makes a title library-shelf worthy.", category: "Publishing Insights", tags: ["Libraries", "Distribution", "Sales"], authorName: "Rebecca Osei", authorRole: "Director of Library Relations" },
  { title: "A Practical Guide to ORCID, DOIs, and Research Identifiers", excerpt: "Persistent identifiers make your work discoverable and citable. Here is how to set up and connect ORCID, DOIs, and ISBNs correctly.", category: "Research Metrics", tags: ["ORCID", "DOI", "Metadata"], authorName: "Dr. Yusuf Adeyemi", authorRole: "Head of Journal Analytics" },
  { title: "Behind the Cover: How We Design Award-Winning Academic Books", excerpt: "A conversation with our design studio on typography, series identity, and why academic covers no longer need to be boring.", category: "Production", tags: ["Design", "Covers", "Typography"], authorName: "Tomás Herrera", authorRole: "Head of Digital Production" },
  { title: "Royalties Demystified: How Academic Authors Actually Get Paid", excerpt: "Net receipts, escalators, subsidiary rights — we translate the contract language and show real-world royalty scenarios for academic titles.", category: "Author Guides", tags: ["Royalties", "Contracts", "Income"], authorName: "Sarah Lindqvist", authorRole: "Managing Editor" },
  { title: "Research Data Sharing: Policies, Repositories, and Best Practice", excerpt: "Funders increasingly require open data. We survey the repository landscape and explain how to write a data availability statement that satisfies everyone.", category: "Research Integrity", tags: ["Open Data", "Repositories", "FAIR"], authorName: "Prof. Alison Grant", authorRole: "Chair, Ethics Committee" },
  { title: "Marketing Your Academic Book Without Feeling Like a Salesperson", excerpt: "Scholarly self-promotion can feel uncomfortable. Practical, dignified strategies that actually move the needle on academic book sales.", category: "Marketing", tags: ["Marketing", "Social Media", "Conferences"], authorName: "Rebecca Osei", authorRole: "Director of Library Relations" },
  { title: "Inside Our Editorial Board: How Publishing Decisions Are Made", excerpt: "Transparency matters. A step-by-step account of how a submission travels from our inbox to a publishing contract — or a constructive rejection.", category: "Publishing Insights", tags: ["Editorial", "Process", "Transparency"], authorName: "Prof. Alison Grant", authorRole: "Chair, Ethics Committee" },
];

function buildContent(seed: BlogSeed): string[] {
  return [
    seed.excerpt,
    `The landscape of academic publishing has shifted dramatically over the past decade, and few topics generate as much discussion among our authors as ${seed.tags[0].toLowerCase()}. In our conversations with researchers across 92 countries, the same questions surface again and again — and the answers are rarely as simple as conference-panel soundbites suggest. This article draws on Emperical's editorial experience across more than 4,200 published titles to offer grounded, practical guidance.`,
    `First, it helps to understand the underlying incentives. Publishers, funders, libraries, and authors each operate under different constraints, and policies around ${seed.tags[0].toLowerCase()} reflect a negotiation between these interests. When our editorial board evaluates a new initiative in this area, we ask three questions: does it serve readers, does it treat authors fairly, and is it sustainable for the scholarly record? Anything that fails one of these tests tends to fail eventually in the market as well.`,
    `Second, the practical details matter more than the principles. Authors who succeed in this area treat ${seed.tags[1].toLowerCase()} not as an administrative afterthought but as part of the scholarly work itself. In our experience, the most common mistakes are made early — often before a manuscript is even submitted — and are entirely avoidable with a small amount of planning. Our author-services team has assembled checklists and templates for exactly this purpose, available to every author under contract.`,
    `Third, seek advice early and from the right people. Your commissioning editor has seen hundreds of projects navigate these questions and can save you weeks of second-guessing. Colleagues who published recently in your field are another underused resource; policies change quickly, and advice from even five years ago may now be outdated.`,
    `At Emperical International Publication, we believe that informed authors make better books — and better books make a stronger scholarly record. If you have questions about how any of this applies to your own project, our editorial team is always available through the contact page, and our author mentorship programme offers structured, one-to-one guidance for those earlier in their publishing careers.`,
  ];
}

export const blogs: BlogPost[] = SEEDS.map((seed, i) => {
  const month = 6 - Math.floor(i / 3); // spread across first half of 2026
  const day = ((i * 5) % 26) + 1;
  return {
    id: `blog-${i + 1}`,
    slug: seed.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-"),
    title: seed.title,
    excerpt: seed.excerpt,
    content: buildContent(seed),
    category: seed.category,
    tags: seed.tags,
    authorName: seed.authorName,
    authorRole: seed.authorRole,
    publishedAt: `2026-${String(Math.max(1, month)).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    readTimeMinutes: 5 + (i % 7),
    featured: seed.featured,
  };
});
