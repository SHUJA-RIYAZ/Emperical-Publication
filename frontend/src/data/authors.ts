import type { Author, AuthorPublication } from "@/types";

interface AuthorSeed {
  name: string;
  title: string;
  institution: string;
  department: string;
  country: string;
  interests: string[];
  featured?: boolean;
}

const SEEDS: AuthorSeed[] = [
  { name: "Dr. Eleanor Whitfield", title: "Professor of Molecular Biology", institution: "University of Cambridge", department: "Department of Biochemistry", country: "United Kingdom", interests: ["Gene Regulation", "CRISPR Systems", "Synthetic Biology"], featured: true },
  { name: "Prof. Rajesh Menon", title: "Chair of Computer Science", institution: "Indian Institute of Technology Bombay", department: "Department of Computer Science & Engineering", country: "India", interests: ["Machine Learning", "Distributed Systems", "Algorithmic Fairness"], featured: true },
  { name: "Dr. Sofia Almeida", title: "Associate Professor of Economics", institution: "University of São Paulo", department: "Faculty of Economics", country: "Brazil", interests: ["Development Economics", "Labor Markets", "Behavioral Economics"], featured: true },
  { name: "Prof. Hiroshi Tanaka", title: "Professor of Materials Science", institution: "University of Tokyo", department: "Institute of Industrial Science", country: "Japan", interests: ["Nanomaterials", "Energy Storage", "Photovoltaics"], featured: true },
  { name: "Dr. Amara Okonkwo", title: "Senior Lecturer in Public Health", institution: "University of Lagos", department: "College of Medicine", country: "Nigeria", interests: ["Epidemiology", "Health Policy", "Infectious Diseases"], featured: true },
  { name: "Prof. Katarina Novak", title: "Professor of Environmental Engineering", institution: "ETH Zürich", department: "Institute of Environmental Engineering", country: "Switzerland", interests: ["Water Treatment", "Circular Economy", "Climate Adaptation"], featured: true },
  { name: "Dr. Michael O'Sullivan", title: "Reader in Modern History", institution: "Trinity College Dublin", department: "School of Histories and Humanities", country: "Ireland", interests: ["European History", "Historiography", "Cultural Memory"] },
  { name: "Prof. Fatima Al-Rashid", title: "Professor of Petroleum Engineering", institution: "King Fahd University of Petroleum & Minerals", department: "College of Engineering", country: "Saudi Arabia", interests: ["Reservoir Simulation", "Enhanced Oil Recovery", "Carbon Capture"] },
  { name: "Dr. Lars Eriksson", title: "Associate Professor of Neuroscience", institution: "Karolinska Institutet", department: "Department of Neuroscience", country: "Sweden", interests: ["Neurodegeneration", "Brain Imaging", "Cognitive Aging"] },
  { name: "Prof. Isabella Rossi", title: "Professor of Classical Studies", institution: "Sapienza University of Rome", department: "Department of Classics", country: "Italy", interests: ["Roman Literature", "Epigraphy", "Ancient Philosophy"] },
  { name: "Dr. Chen Wei", title: "Professor of Quantum Physics", institution: "Tsinghua University", department: "Department of Physics", country: "China", interests: ["Quantum Computing", "Quantum Information", "Condensed Matter"] },
  { name: "Prof. Sarah Mitchell", title: "Dean of Business School", institution: "University of Melbourne", department: "Melbourne Business School", country: "Australia", interests: ["Corporate Strategy", "Innovation Management", "Sustainable Business"] },
  { name: "Dr. Ahmed Hassan", title: "Associate Professor of Civil Engineering", institution: "Cairo University", department: "Faculty of Engineering", country: "Egypt", interests: ["Structural Dynamics", "Earthquake Engineering", "Smart Infrastructure"] },
  { name: "Prof. Marie Dubois", title: "Professor of Linguistics", institution: "Sorbonne Université", department: "Faculty of Letters", country: "France", interests: ["Sociolinguistics", "Language Acquisition", "Computational Linguistics"] },
  { name: "Dr. James Anderson", title: "Professor of Law", institution: "Yale University", department: "Yale Law School", country: "United States", interests: ["Constitutional Law", "International Law", "Technology Regulation"] },
  { name: "Prof. Priya Sharma", title: "Professor of Mathematics", institution: "University of Delhi", department: "Department of Mathematics", country: "India", interests: ["Number Theory", "Cryptography", "Algebraic Geometry"] },
  { name: "Dr. Thomas Müller", title: "Group Leader, Robotics", institution: "Technical University of Munich", department: "School of Computation, Information and Technology", country: "Germany", interests: ["Autonomous Systems", "Human-Robot Interaction", "Control Theory"] },
  { name: "Prof. Grace Kim", title: "Professor of Chemistry", institution: "Seoul National University", department: "Department of Chemistry", country: "South Korea", interests: ["Catalysis", "Green Chemistry", "Polymer Science"] },
  { name: "Dr. Daniel Cohen", title: "Senior Research Fellow", institution: "Weizmann Institute of Science", department: "Department of Molecular Genetics", country: "Israel", interests: ["Genomics", "Systems Biology", "Bioinformatics"] },
  { name: "Prof. Ana Martínez", title: "Professor of Education", institution: "Universidad Nacional Autónoma de México", department: "Faculty of Philosophy and Letters", country: "Mexico", interests: ["Educational Technology", "Curriculum Design", "Inclusive Education"] },
  { name: "Dr. Oliver Bennett", title: "Associate Professor of Philosophy", institution: "University of Oxford", department: "Faculty of Philosophy", country: "United Kingdom", interests: ["Ethics of AI", "Epistemology", "Philosophy of Mind"] },
  { name: "Prof. Zanele Dlamini", title: "Professor of Sociology", institution: "University of Cape Town", department: "Department of Sociology", country: "South Africa", interests: ["Urban Studies", "Social Inequality", "Migration"] },
  { name: "Dr. Elena Petrova", title: "Professor of Astrophysics", institution: "Lomonosov Moscow State University", department: "Faculty of Physics", country: "Russia", interests: ["Exoplanets", "Stellar Evolution", "Gravitational Waves"] },
  { name: "Prof. David Thompson", title: "Professor of Medicine", institution: "Johns Hopkins University", department: "School of Medicine", country: "United States", interests: ["Cardiology", "Clinical Trials", "Precision Medicine"] },
  { name: "Dr. Nadia Karim", title: "Assistant Professor of Data Science", institution: "National University of Singapore", department: "School of Computing", country: "Singapore", interests: ["Natural Language Processing", "Responsible AI", "Data Visualization"] },
];

const VENUES = [
  "Nature Communications",
  "The Lancet Global Health",
  "IEEE Transactions",
  "Journal of Applied Sciences",
  "Cambridge Quarterly Review",
  "International Review of Economics",
  "Annual Research Symposium",
  "Emperical Review of Science",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(dr|prof|mr|ms|mrs)\.?\s+/, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildPublications(seed: AuthorSeed, index: number): AuthorPublication[] {
  const types: AuthorPublication["type"][] = [
    "Journal Article",
    "Book Chapter",
    "Conference Paper",
    "Monograph",
  ];
  return seed.interests.flatMap((interest, i) => [
    {
      title: `Advances in ${interest}: A Systematic Review`,
      venue: VENUES[(index + i) % VENUES.length],
      year: 2024 - i,
      type: types[(index + i) % types.length],
    },
    {
      title: `${interest} in Practice: Methods and Applications`,
      venue: VENUES[(index + i + 3) % VENUES.length],
      year: 2022 - i,
      type: types[(index + i + 1) % types.length],
    },
  ]);
}

export const authors: Author[] = SEEDS.map((seed, i) => {
  const slug = slugify(seed.name);
  const firstName = seed.name.replace(/^(Dr|Prof)\.?\s+/, "").split(" ")[0];
  return {
    id: `author-${i + 1}`,
    slug,
    name: seed.name,
    title: seed.title,
    institution: seed.institution,
    department: seed.department,
    country: seed.country,
    bio: `${seed.name} is ${/^[aeiou]/i.test(seed.title) ? "an" : "a"} ${seed.title.toLowerCase()} at ${seed.institution}, where ${firstName}'s research group focuses on ${seed.interests[0].toLowerCase()} and ${seed.interests[1].toLowerCase()}. With over ${12 + (i % 14)} years of academic experience, ${firstName} has published extensively in leading international journals and supervised more than ${8 + (i % 20)} doctoral candidates. ${firstName} serves on the editorial boards of several peer-reviewed journals and is a frequent keynote speaker at international conferences. Their work with Emperical International Publication reflects a commitment to making rigorous scholarship accessible to a global readership.`,
    researchInterests: seed.interests,
    publications: buildPublications(seed, i),
    email: `${slug.split("-")[0]}.${slug.split("-").slice(-1)[0]}@${seed.institution.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12)}.edu`,
    social: {
      twitter: `https://twitter.com/${slug.replace(/-/g, "_")}`,
      linkedin: `https://linkedin.com/in/${slug}`,
      orcid: `https://orcid.org/0000-000${(i % 9) + 1}-${1000 + i * 37}-${2000 + i * 53}`,
      googleScholar: `https://scholar.google.com/citations?user=${slug.slice(0, 8)}`,
    },
    hIndex: 18 + ((i * 7) % 42),
    citations: 1200 + ((i * 913) % 14000),
    booksPublished: 1 + (i % 5),
    featured: seed.featured,
  };
});
