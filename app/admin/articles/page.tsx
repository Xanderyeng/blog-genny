import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { DraftArticleTable } from "@/components/draft-article-table"

export default function AdminArticles() {
  return (
    <AdminDashboardLayout>
      <DraftArticleTable initialArticles={[]} initialStats={{ published: 0, draft: 0, archived: 0 }} />
    </AdminDashboardLayout>
  )
}
