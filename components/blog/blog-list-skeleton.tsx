import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-full overflow-hidden">
          <div className="aspect-video overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>

          <CardHeader className="p-4 pb-0">
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </CardContent>

          <CardFooter className="flex items-center justify-between p-4 pt-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
