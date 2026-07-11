import { Skeleton } from "@/components/ui/skeleton";

export default function BookDetailsLoading() {
  return (
    <div className="container-page py-10 md:py-14">
      <Skeleton className="mb-8 h-4 w-56" />
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <Skeleton className="mx-auto aspect-[3/4] w-56 sm:w-64 lg:w-full" />
        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
