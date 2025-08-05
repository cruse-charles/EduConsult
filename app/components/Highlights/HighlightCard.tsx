import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LucideIcon } from "lucide-react"

interface HighlightCardProps {
  title: string
  icon: LucideIcon
  content: string | number | null
  detail?: string
  loading: boolean
}

const HighlightCard = ({ title, icon: Icon, content, detail, loading=false }: HighlightCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {loading ? <Skeleton className="h-4 w-24" /> : title}
        </CardTitle>

        {loading ? (
          <Skeleton className="h-4 w-4 rounded-full" />
        ) : (
            <div>Icon</div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-6 w-32" />
        ) : (
          <div className="text-2xl font-bold">{content}</div>
        )}

        {detail &&
          (loading ? (
            <Skeleton className="h-3 w-40 mt-2" />
          ) : (
            <p className="text-xs text-muted-foreground mt-2">{detail}</p>
          ))}
      </CardContent>
    </Card>
  )
}

export default HighlightCard
