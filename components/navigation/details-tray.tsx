"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DetailsTrayProps {
  expanded: boolean
}

export default function DetailsTray({ expanded }: DetailsTrayProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-30 flex flex-col border-l bg-background transition-all duration-300 ease-in-out lg:relative",
        expanded ? "w-80" : "w-0",
      )}
      style={{ top: "64px" }}
    >
      {expanded && (
        <div className="flex flex-col p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Details</h3>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Select an item to view its details here.</p>
          </div>

          <div className="mt-6">
            <h4 className="mb-2 text-sm font-medium">AI Assistant</h4>
            <div className="rounded-lg border p-4">
              <p className="mb-4 text-sm text-muted-foreground">
                Ask me anything about your data or how to use the application.
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your question..."
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <Button size="sm">Ask</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
