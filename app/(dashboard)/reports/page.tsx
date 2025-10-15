import SalesReports from "@/components/reports/sales-reports"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">Sales Reports</h1>
      </header>
      <SalesReports />
    </div>
  )
}
