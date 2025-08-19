import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { GenerateForm } from '@/components/generate-article-form'

export default function AdminGenerate() {
  return (
    <AdminDashboardLayout>
      <div className="max-w-2xl mx-auto">
        <GenerateForm />
      </div>
    </AdminDashboardLayout>
  )
}
