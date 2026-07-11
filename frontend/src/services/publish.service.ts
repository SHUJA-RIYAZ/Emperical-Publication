import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { ContactMessage, PublishingRequest } from "@/types";
import { delay } from "./api";

export interface SubmissionResult {
  success: boolean;
  referenceId: string;
  message: string;
}

function mockReferenceId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
}

export async function submitPublishingRequest(
  data: PublishingRequest
): Promise<SubmissionResult> {
  try {
    return await apiFetch<SubmissionResult>("/publishing-requests", {
      method: "POST",
      body: data,
    });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(700);
    return {
      success: true,
      referenceId: mockReferenceId("EIP"),
      message:
        "Your manuscript submission has been received. Our editorial team will contact you within two business days.",
    };
  }
}

export async function submitContactMessage(data: ContactMessage): Promise<SubmissionResult> {
  try {
    return await apiFetch<SubmissionResult>("/contact-messages", { method: "POST", body: data });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(600);
    return {
      success: true,
      referenceId: mockReferenceId("MSG"),
      message: "Thank you for reaching out. Our team will respond within one business day.",
    };
  }
}

export async function subscribeNewsletter(email: string): Promise<SubmissionResult> {
  try {
    return await apiFetch<SubmissionResult>("/newsletter", { method: "POST", body: { email } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(500);
    return {
      success: true,
      referenceId: mockReferenceId("NL"),
      message: "You are subscribed. Welcome to the Emperical community.",
    };
  }
}
