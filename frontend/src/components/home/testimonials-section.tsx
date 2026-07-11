"use client";

import { useCallback } from "react";
import { Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { RatingStars } from "@/components/common/rating-stars";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { getTestimonials } from "@/services/content.service";

export function TestimonialsSection() {
  const fetcher = useCallback(() => getTestimonials(), []);
  const { data: testimonials, loading } = useAsync(fetcher);

  return (
    <section className="bg-secondary/40 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Author Voices"
          title="What our authors say"
          description="Unfiltered feedback from the researchers who trusted us with their work."
        />
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
                <div className="mt-6 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Reveal direction="none">
            <Swiper
              modules={[Autoplay, Pagination, A11y]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{ 700: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
              autoplay={{ delay: 5200, disableOnInteraction: true, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }}
              a11y={{ enabled: true }}
              className="!pb-12"
            >
              {testimonials?.map((t) => (
                <SwiperSlide key={t.id} className="!h-auto">
                  <figure className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm">
                    <Quote className="h-7 w-7 text-accent" aria-hidden />
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t pt-4">
                      <ProfileAvatar name={t.name} className="h-10 w-10 text-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t.role}, {t.institution}
                        </p>
                      </div>
                      <RatingStars rating={t.rating} className="shrink-0" />
                    </figcaption>
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
        )}
      </div>
    </section>
  );
}
