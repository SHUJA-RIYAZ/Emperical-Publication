import type { Journal } from "@/types";

interface JournalSeed {
  title: string;
  field: string;
  editorInChief: string;
  openAccess: boolean;
  frequency: Journal["frequency"];
}

const SEEDS: JournalSeed[] = [
  { title: "Emperical Review of Applied Sciences", field: "Multidisciplinary", editorInChief: "Prof. Hiroshi Tanaka", openAccess: true, frequency: "Monthly" },
  { title: "International Journal of Machine Intelligence", field: "Computer Science", editorInChief: "Prof. Rajesh Menon", openAccess: true, frequency: "Monthly" },
  { title: "Journal of Global Health Policy", field: "Medicine & Public Health", editorInChief: "Dr. Amara Okonkwo", openAccess: true, frequency: "Bimonthly" },
  { title: "Advances in Sustainable Engineering", field: "Engineering", editorInChief: "Prof. Katarina Novak", openAccess: false, frequency: "Quarterly" },
  { title: "Emperical Economics Quarterly", field: "Economics", editorInChief: "Dr. Sofia Almeida", openAccess: false, frequency: "Quarterly" },
  { title: "Journal of Quantum Science & Technology", field: "Physics", editorInChief: "Dr. Chen Wei", openAccess: true, frequency: "Bimonthly" },
  { title: "International Review of Education Research", field: "Education", editorInChief: "Prof. Ana Martínez", openAccess: true, frequency: "Quarterly" },
  { title: "Journal of Environmental Systems", field: "Environmental Science", editorInChief: "Prof. Katarina Novak", openAccess: true, frequency: "Bimonthly" },
  { title: "Emperical Law Review", field: "Law", editorInChief: "Dr. James Anderson", openAccess: false, frequency: "Biannually" },
  { title: "Journal of Molecular Medicine & Genomics", field: "Life Sciences", editorInChief: "Dr. Eleanor Whitfield", openAccess: true, frequency: "Monthly" },
  { title: "Studies in Humanities & Cultural Theory", field: "Humanities", editorInChief: "Prof. Isabella Rossi", openAccess: false, frequency: "Biannually" },
  { title: "International Journal of Mathematical Sciences", field: "Mathematics", editorInChief: "Prof. Priya Sharma", openAccess: true, frequency: "Quarterly" },
  { title: "Journal of Urban Sociology", field: "Social Sciences", editorInChief: "Prof. Zanele Dlamini", openAccess: true, frequency: "Quarterly" },
  { title: "Emperical Materials Letters", field: "Materials Science", editorInChief: "Prof. Grace Kim", openAccess: true, frequency: "Monthly" },
  { title: "Journal of Clinical & Translational Research", field: "Medicine", editorInChief: "Prof. David Thompson", openAccess: false, frequency: "Bimonthly" },
];

const INDEXING_POOLS = [
  ["Scopus", "Web of Science", "DOAJ", "Google Scholar"],
  ["Scopus", "PubMed", "Web of Science", "EMBASE"],
  ["Scopus", "Web of Science", "MathSciNet"],
  ["Scopus", "DOAJ", "ERIC", "Google Scholar"],
];

export const journals: Journal[] = SEEDS.map((seed, i) => ({
  id: `journal-${i + 1}`,
  slug: seed.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-"),
  title: seed.title,
  issn: `2${400 + i * 13}-${String(1000 + i * 517).slice(0, 4)}`,
  eIssn: `2${500 + i * 11}-${String(2000 + i * 391).slice(0, 4)}`,
  field: seed.field,
  impactFactor: Math.round((1.8 + ((i * 23) % 40) / 8) * 10) / 10,
  citeScore: Math.round((2.5 + ((i * 31) % 50) / 8) * 10) / 10,
  frequency: seed.frequency,
  openAccess: seed.openAccess,
  description: `${seed.title} is an international, peer-reviewed journal publishing original research, systematic reviews, and perspectives in ${seed.field.toLowerCase()}. Established under the Emperical International Publication imprint, the journal maintains a rigorous double-blind review process and is committed to research integrity, reproducibility, and global accessibility. It welcomes submissions from researchers at all career stages and offers rapid editorial decisions with constructive reviewer feedback.`,
  editorInChief: seed.editorInChief,
  established: 2002 + (i % 18),
  acceptanceRate: 18 + ((i * 7) % 22),
  reviewTimeWeeks: 4 + (i % 6),
  indexing: INDEXING_POOLS[i % INDEXING_POOLS.length],
}));
