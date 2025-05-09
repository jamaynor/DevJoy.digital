import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validateOrgMatch(userHomeOrg: string, dataOwningOrg: string): boolean {
  // Convert to lowercase for case-insensitive comparison
  const homeOrg = userHomeOrg.toLowerCase()
  const owningOrg = dataOwningOrg.toLowerCase()

  // Global admin has access to everything
  if (homeOrg === "global_admin") return true

  // Check if user's home_org is a prefix of the data's owning_org
  return owningOrg.startsWith(homeOrg)
}
