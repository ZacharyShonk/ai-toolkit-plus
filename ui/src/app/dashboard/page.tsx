'use client';

import GpuMonitor from '@/components/GPUMonitor';
import JobsTable from '@/components/JobsTable';
import { TopBar, MainContent } from '@/components/layout';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <>
      <TopBar>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg">Dashboard</h1>
        </div>
      </TopBar>
      <MainContent>
        <GpuMonitor />
        <div className="w-full mt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-md">Queues</h1>
            <div className="text-xs text-gray-500">
              <Link href="/jobs">View All</Link>
            </div>
          </div>
          <JobsTable onlyActive />
        </div>
      </MainContent>
    </>
  );
}
