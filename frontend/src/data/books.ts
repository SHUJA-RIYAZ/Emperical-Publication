import type { Book, BookFormat } from "@/types";

interface BookSeed {
  title: string;
  subtitle?: string;
  category: string;
  tags: string[];
  language?: string;
  featured?: boolean;
  bestseller?: boolean;
}

const SEEDS: BookSeed[] = [
  { title: "Foundations of Quantum Computing", subtitle: "From Qubits to Algorithms", category: "Science & Technology", tags: ["Quantum", "Computing", "Physics"], featured: true, bestseller: true },
  { title: "The Genomic Revolution", subtitle: "CRISPR and the Future of Medicine", category: "Medicine & Health", tags: ["Genomics", "CRISPR", "Biotechnology"], featured: true, bestseller: true },
  { title: "Machine Learning for Scientific Discovery", category: "Science & Technology", tags: ["AI", "Machine Learning", "Research Methods"], featured: true },
  { title: "Sustainable Urban Infrastructure", subtitle: "Engineering Cities for the 22nd Century", category: "Engineering", tags: ["Sustainability", "Urban Planning", "Civil Engineering"], featured: true },
  { title: "Global Health Economics", subtitle: "Policy, Equity, and Outcomes", category: "Business & Economics", tags: ["Health Policy", "Economics", "Public Health"], featured: true },
  { title: "The Ethics of Artificial Intelligence", category: "Humanities", tags: ["AI Ethics", "Philosophy", "Technology"], featured: true, bestseller: true },
  { title: "Advanced Structural Dynamics", subtitle: "Theory and Seismic Applications", category: "Engineering", tags: ["Structures", "Earthquakes", "Dynamics"] },
  { title: "Climate Adaptation Strategies", subtitle: "A Handbook for Policymakers", category: "Environmental Science", tags: ["Climate Change", "Policy", "Adaptation"], featured: true },
  { title: "Behavioral Economics in Emerging Markets", category: "Business & Economics", tags: ["Behavioral Economics", "Development", "Markets"] },
  { title: "Neural Networks and Deep Learning", subtitle: "A Mathematical Perspective", category: "Mathematics", tags: ["Deep Learning", "Mathematics", "AI"], bestseller: true },
  { title: "Constitutional Law in the Digital Age", category: "Law", tags: ["Constitutional Law", "Privacy", "Technology"] },
  { title: "Precision Cardiology", subtitle: "Data-Driven Approaches to Heart Disease", category: "Medicine & Health", tags: ["Cardiology", "Precision Medicine", "Clinical Practice"] },
  { title: "The Sociology of Migration", subtitle: "Borders, Belonging, and Identity", category: "Social Sciences", tags: ["Migration", "Identity", "Urban Studies"] },
  { title: "Renewable Energy Systems", subtitle: "Design, Analysis, and Integration", category: "Engineering", tags: ["Renewable Energy", "Power Systems", "Sustainability"], bestseller: true },
  { title: "Ancient Rome Reconsidered", subtitle: "New Readings of Classical Sources", category: "Humanities", tags: ["Classics", "Roman History", "Literature"] },
  { title: "Epidemiology of Infectious Diseases", category: "Medicine & Health", tags: ["Epidemiology", "Public Health", "Infectious Diseases"] },
  { title: "Number Theory and Cryptographic Applications", category: "Mathematics", tags: ["Number Theory", "Cryptography", "Security"] },
  { title: "Inclusive Education in Practice", subtitle: "Frameworks for Diverse Classrooms", category: "Education", tags: ["Inclusion", "Pedagogy", "Curriculum"] },
  { title: "Nanomaterials for Energy Storage", category: "Science & Technology", tags: ["Nanotechnology", "Batteries", "Materials"] },
  { title: "Corporate Strategy in Uncertain Times", category: "Business & Economics", tags: ["Strategy", "Management", "Innovation"] },
  { title: "Water Treatment Technologies", subtitle: "Principles and Emerging Methods", category: "Environmental Science", tags: ["Water", "Treatment", "Engineering"] },
  { title: "Cognitive Aging and the Brain", category: "Medicine & Health", tags: ["Neuroscience", "Aging", "Cognition"] },
  { title: "International Trade Law", subtitle: "Treaties, Disputes, and Reform", category: "Law", tags: ["Trade Law", "WTO", "International Relations"] },
  { title: "Sociolinguistics of Multilingual Cities", category: "Social Sciences", tags: ["Linguistics", "Multilingualism", "Cities"], language: "French" },
  { title: "Robotics and Autonomous Systems", subtitle: "Perception, Planning, and Control", category: "Engineering", tags: ["Robotics", "Autonomy", "Control"] },
  { title: "Green Catalysis", subtitle: "Sustainable Chemical Transformations", category: "Science & Technology", tags: ["Chemistry", "Catalysis", "Green Chemistry"] },
  { title: "The Philosophy of Mind", subtitle: "Consciousness in the Age of Machines", category: "Humanities", tags: ["Philosophy", "Consciousness", "AI"] },
  { title: "Systems Biology and Genomic Medicine", category: "Medicine & Health", tags: ["Systems Biology", "Genomics", "Bioinformatics"] },
  { title: "Educational Technology and Learning Design", category: "Education", tags: ["EdTech", "Learning Design", "Digital Education"], language: "Spanish" },
  { title: "Exoplanets and Stellar Systems", subtitle: "The Search for Other Worlds", category: "Science & Technology", tags: ["Astronomy", "Exoplanets", "Astrophysics"], bestseller: true },
  { title: "Labor Markets in the Global South", category: "Business & Economics", tags: ["Labor", "Development", "Policy"], language: "Spanish" },
  { title: "Earthquake-Resilient Design", category: "Engineering", tags: ["Seismic Design", "Resilience", "Structures"] },
  { title: "The Historiography of Modern Europe", category: "Humanities", tags: ["History", "Europe", "Methodology"], language: "German" },
  { title: "Carbon Capture and Storage", subtitle: "Technologies for a Net-Zero Future", category: "Environmental Science", tags: ["Carbon Capture", "Climate", "Energy"] },
  { title: "Clinical Trials Methodology", subtitle: "Design, Conduct, and Analysis", category: "Medicine & Health", tags: ["Clinical Trials", "Statistics", "Research Methods"] },
  { title: "Algebraic Geometry: An Introduction", category: "Mathematics", tags: ["Algebra", "Geometry", "Pure Mathematics"] },
  { title: "Human-Robot Interaction", subtitle: "Design Principles for Collaborative Machines", category: "Science & Technology", tags: ["HRI", "Robotics", "Design"] },
  { title: "Urban Inequality and Social Policy", category: "Social Sciences", tags: ["Inequality", "Urban Studies", "Policy"] },
  { title: "Polymer Science and Applications", category: "Science & Technology", tags: ["Polymers", "Materials", "Chemistry"], language: "German" },
  { title: "Comparative Constitutional Design", category: "Law", tags: ["Comparative Law", "Constitutions", "Governance"] },
  { title: "Natural Language Processing in Practice", subtitle: "From Text to Insight", category: "Science & Technology", tags: ["NLP", "AI", "Text Mining"], bestseller: true },
  { title: "Reservoir Engineering Fundamentals", category: "Engineering", tags: ["Petroleum", "Reservoirs", "Energy"], language: "Arabic" },
  { title: "The Economics of Innovation", subtitle: "R&D, Patents, and Growth", category: "Business & Economics", tags: ["Innovation", "R&D", "Growth"] },
  { title: "Gravitational Waves and Cosmology", category: "Science & Technology", tags: ["Cosmology", "Gravitational Waves", "Physics"] },
  { title: "Curriculum Design for Higher Education", category: "Education", tags: ["Curriculum", "Higher Education", "Assessment"] },
  { title: "Bioinformatics Algorithms", subtitle: "Sequence to Structure", category: "Mathematics", tags: ["Bioinformatics", "Algorithms", "Genomics"] },
  { title: "Cultural Memory and National Identity", category: "Humanities", tags: ["Memory Studies", "Identity", "Culture"], language: "French" },
  { title: "Circular Economy Engineering", subtitle: "Designing Out Waste", category: "Environmental Science", tags: ["Circular Economy", "Sustainability", "Design"] },
  { title: "Health Policy and Global Equity", category: "Social Sciences", tags: ["Health Policy", "Equity", "Global Health"], language: "Arabic" },
  { title: "Smart Infrastructure and IoT", subtitle: "Sensing the Built Environment", category: "Engineering", tags: ["IoT", "Infrastructure", "Smart Cities"], featured: true },
];

const FORMAT_SETS: BookFormat[][] = [
  ["Hardcover", "eBook"],
  ["Hardcover", "Paperback", "eBook"],
  ["Paperback", "eBook"],
  ["Hardcover"],
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function isbnFor(i: number): string {
  const body = String(900000000 + i * 7919).slice(0, 9);
  const check = (i * 3 + 7) % 10;
  return `978-1-${body.slice(0, 5)}-${body.slice(5, 8)}-${check}`;
}

export const books: Book[] = SEEDS.map((seed, i) => {
  const year = 2018 + (i % 8); // 2018–2025
  const month = (i % 12) + 1;
  const day = ((i * 3) % 27) + 1;
  return {
    id: `book-${i + 1}`,
    slug: slugify(seed.title),
    title: seed.title,
    subtitle: seed.subtitle,
    description: `${seed.title}${seed.subtitle ? `: ${seed.subtitle}` : ""} offers a comprehensive and rigorously peer-reviewed treatment of ${seed.tags[0].toLowerCase()} for researchers, graduate students, and practitioners. Drawing on the latest international scholarship, the book combines theoretical foundations with real-world case studies, worked examples, and end-of-chapter exercises. Each chapter has been reviewed by leading experts in ${seed.category.toLowerCase()}, ensuring both academic depth and practical relevance. This edition includes updated references, new material on ${seed.tags[1].toLowerCase()}, and companion resources for instructors.`,
    authorIds: [`author-${(i % 25) + 1}`, ...(i % 3 === 0 ? [`author-${((i + 7) % 25) + 1}`] : [])],
    category: seed.category,
    language: seed.language ?? "English",
    publicationYear: year,
    publicationDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    isbn: isbnFor(i),
    pages: 240 + ((i * 37) % 480),
    price: 39.99 + ((i * 13) % 12) * 10,
    formats: FORMAT_SETS[i % FORMAT_SETS.length],
    rating: Math.round((3.9 + ((i * 17) % 11) / 10) * 10) / 10,
    reviewsCount: 12 + ((i * 29) % 240),
    tags: seed.tags,
    featured: seed.featured,
    bestseller: seed.bestseller,
  };
});
