"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { BookCard } from "@/components/books/book-card";
import { BookCardSkeleton } from "@/components/books/book-card-skeleton";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/use-async";
import { getFeaturedBooks } from "@/services/books.service";

export function FeaturedBooks() {
  const fetcher = useCallback(() => getFeaturedBooks(), []);
  const { data: books, loading } = useAsync(fetcher);

  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="New & Notable"
        title="Featured publications"
        description="A selection of recent titles our editors are proud of — peer-reviewed, beautifully produced, globally distributed."
      />
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Reveal direction="none">
          <Swiper
            modules={[Autoplay, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              560: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 4200, disableOnInteraction: true, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            a11y={{ enabled: true }}
            className="!pb-12"
          >
            {books?.map((book) => (
              <SwiperSlide key={book.id} className="!h-auto">
                <BookCard book={book} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      )}
      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/books">
            Explore the full catalogue <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
