"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-12 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
    </div>
  )
}

export function PortfolioSkeleton() {
  return (
    <div className="space-y-4 py-6">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mx-auto h-5 w-48 rounded-xl" />
      <div className="text-center space-y-2 mt-4">
        <Skeleton className="h-4 w-20 mx-auto" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  )
}

export function LessonSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}
