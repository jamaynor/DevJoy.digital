import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import SiteLayout from "@/components/layouts/site-layout"
import BlogList from "@/components/blog/blog-list"
import BlogCategories from "@/components/blog/blog-categories"
import BlogListSkeleton from "@/components/blog/blog-list-skeleton"

export default async function BlogsPage() {
  const supabase = createServerSupabaseClient()

  // Fetch blog categories
  const { data: categories } = await supabase.from("blog_categories").select("*").order("name")

  return (
    <SiteLayout>
      <div className="container py-12">
        <h1 className="mb-8 text-center text-3xl font-bold">Blog</h1>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Categories Sidebar */}
          <div className="md:col-span-1">
            <BlogCategories categories={categories || []} />
          </div>

          {/* Blog Posts */}
          <div className="md:col-span-3">
            <Suspense fallback={<BlogListSkeleton />}>
              <BlogList />
            </Suspense>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
