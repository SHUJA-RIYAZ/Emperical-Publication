import { faqs } from "@/data/faq";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { FAQItem, Service, Testimonial } from "@/types";
import { delay } from "./api";

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await apiFetch<Testimonial[]>("/testimonials");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return [...testimonials];
  }
}

export async function getFaqs(): Promise<FAQItem[]> {
  try {
    return await apiFetch<FAQItem[]>("/faqs");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return [...faqs];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    return await apiFetch<Service[]>("/services");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return [...services];
  }
}

export async function getFeaturedServices(limit = 6): Promise<Service[]> {
  try {
    return await apiFetch<Service[]>("/services/featured", { params: { limit } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    const popular = services.filter((s) => s.popular);
    return [...popular, ...services.filter((s) => !s.popular)].slice(0, limit);
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const all = await apiFetch<Service[]>("/services");
    return all.find((s) => s.slug === slug) ?? null;
  } catch (error) {
    if (!isUnreachable(error)) return null;
    return services.find((s) => s.slug === slug) ?? null;
  }
}
