import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  if (layout === "list") {
    return (
      <div className="flex gap-5 rounded-xl border bg-card p-4">
        <Skeleton className="aspect-[3/4] w-24 sm:w-28" />
        <div className="flex-1 space-y-3 py-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col rounded-xl border bg-card p-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="mt-4 space-y-2.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-28" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
}
