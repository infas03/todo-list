import { Skeleton } from "@heroui/react";

export const EmployerTableSkeleton = () => {
  return (
    <div className="w-full mt-5">
      <Skeleton className="rounded-lg">
        <div className="h-10 rounded-lg bg-default-300" />
      </Skeleton>
      <Skeleton className="rounded-lg mt-2">
        <div className="h-10 rounded-lg bg-default-300" />
      </Skeleton>
      <Skeleton className="rounded-lg mt-2">
        <div className="h-10 rounded-lg bg-default-300" />
      </Skeleton>
      <Skeleton className="rounded-lg mt-2">
        <div className="h-10 rounded-lg bg-default-300" />
      </Skeleton>
      <Skeleton className="rounded-lg mt-2">
        <div className="h-10 rounded-lg bg-default-300" />
      </Skeleton>
      <Skeleton className="rounded-lg mt-2">
        <div className="h-10 rounded-lg bg-default-300" />
      </Skeleton>
    </div>
  );
};
