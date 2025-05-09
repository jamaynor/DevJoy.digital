"use client"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogCategoriesProps {
  categories: Category[]
}

export default function BlogCategories({ categories }: BlogCategoriesProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get("category")

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Categories</h2>

      <ul className="space-y-2">
        <li>
          <Link
            href="/blogs"
            className={cn(
              "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
              !currentCategory && "bg-accent font-medium",
            )}
          >
            All Posts
          </Link>
        </li>

        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/blogs?category=${category.slug}`}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                currentCategory === category.slug && "bg-accent font-medium",
              )}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
