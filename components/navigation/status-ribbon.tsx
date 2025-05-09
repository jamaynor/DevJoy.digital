interface StatusRibbonProps {
  userRole?: string
  statusMessage?: string
}

export default function StatusRibbon({ userRole = "", statusMessage = "" }: StatusRibbonProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t bg-background py-2 lg:flex">
      <div className="container flex items-center justify-between">
        <div className="text-sm font-medium">
          {userRole && <span className="rounded bg-secondary/10 px-2 py-1 text-secondary">{userRole}</span>}
        </div>

        <div className="text-center text-sm text-muted-foreground">{statusMessage || "Ready"}</div>

        <div className="text-sm">{/* Right side placeholder */}</div>
      </div>
    </div>
  )
}
