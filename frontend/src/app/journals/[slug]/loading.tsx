import { Skeleton } from "@/components/ui/skeleton";

export default function JournalDetailsLoading() {
  return (
    <div className="container-page py-10 md:py-14">
      <Skeleton className="mb-8 h-4 w-56" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-28 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-10 w-3/4" />
      <Skeleton className="mt-2 h-4 w-64" />
      <div className="mt-6 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    </div>
  );
}
