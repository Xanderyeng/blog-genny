import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ArticleStatus = "draft" | "published" | "archived"

interface StatusBadgeProps {
  status: ArticleStatus
  className?: string
}

const statusConfig = {
  draft: {
    label: "Draft",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  published: {
    label: "Published",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  archived: {
    label: "Archived",
    variant: "outline" as const,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
