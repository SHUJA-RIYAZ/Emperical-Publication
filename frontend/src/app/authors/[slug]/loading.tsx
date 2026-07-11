import { Skeleton } from "@/components/ui/skeleton";

export default function AuthorProfileLoading() {
  return (
    <div className="container-page py-10 md:py-14">
      <Skeleton className="mb-8 h-4 w-56" />
      <div className="flex flex-col gap-8 md:flex-row">
        <Skeleton className="h-28 w-28 rounded-full md:h-32 md:w-32" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-80" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 md:w-64">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    </div>
  );
}
