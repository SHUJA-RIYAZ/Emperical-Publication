export interface AccountUser {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
  phone: string;
  affiliation: string;
  country: string;
}

export type SubmissionStatus = "pending" | "in_review" | "accepted" | "rejected";

export interface MySubmission {
  id: string;
  referenceId: string;
  bookTitle: string;
  category: string;
  language: string;
  wordCount: string;
  synopsis: string;
  manuscriptFileName: string | null;
  status: SubmissionStatus;
  reviewerNotes: string | null;
  createdAt: string;
}

export interface AuthResult {
  accessToken: string;
  tokenType: string;
  user: AccountUser;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  affiliation?: string;
  country?: string;
}

export interface ProfilePayload {
  fullName: string;
  phone: string;
  affiliation: string;
  country: string;
}

export interface UploadResult {
  fileName: string;
  filePath: string;
  fileSize: number;
}
