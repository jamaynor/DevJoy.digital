import Link from "next/link"
import Image from "next/image"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatDate, truncateText } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface BlogListProps {
  categorySlug?: string
}

export default async function BlogList({ categorySlug }: BlogListProps) {
  const supabase = createServerSupabaseClient()

  // Build query
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      user_profiles(first_name, last_name),
      blog_categories(name, slug)
    `)
    .eq("published", true)
    .order("published_at", { ascending: false })

  // Filter by category if provided
  if (categorySlug) {
    query = query.eq("blog_categories.slug", categorySlug)
  }

  // Execute query
  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching blog posts:", error)
    return <div>Error loading blog posts</div>
  }

  if (!posts || posts.length === 0) {
    return <div>No blog posts found</div>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const author = post.user_profiles as any
        const category = post.blog_categories as any

        return (
          <Link key={post.id} href={`/blogs/${post.slug}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={post.featured_image || "/placeholder.svg?height=200&width=400"}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <CardHeader className="p-4 pb-0">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">{category?.name || "Uncategorized"}</span>
                  <h3 className="line-clamp-2 text-lg font-semibold">{post.title}</h3>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                <p className="line-clamp-3 text-sm text-muted-foreground">{truncateText(post.excerpt || "", 120)}</p>
              </CardContent>

              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.published_at || post.created_at)}
                </span>
                <span className="text-xs font-medium">
                  {author ? `${author.first_name} ${author.last_name}` : "Unknown Author"}
                </span>
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
