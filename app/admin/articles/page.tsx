import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { DraftArticleTable } from "@/components/draft-article-table"

export default function AdminArticles() {
  return (
    <AdminDashboardLayout>
      <DraftArticleTable />
    </AdminDashboardLayout>
  )
}
