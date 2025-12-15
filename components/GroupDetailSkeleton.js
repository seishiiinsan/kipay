import Skeleton from './Skeleton';
import DashboardHeader from './DashboardHeader';

export default function GroupDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-14 w-80" />
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <Skeleton className="h-10 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Dépenses */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
              <div className="p-6 border-b-4 border-black dark:border-white">
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="p-6 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            <Skeleton className="h-48 w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]" />
            <Skeleton className="h-48 w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]" />
          </div>
        </div>
      </main>
    </div>
  );
}
