'use client';

import JobsTable from '@/components/JobsTable';
import { TopBar, MainContent } from '@/components/layout';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <>
      <TopBar>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg">Queue</h1>
        </div>
        <div className="w-full sm:w-auto">
          <Link
            href="/jobs/new"
            className="inline-flex w-full items-center justify-center rounded-md bg-slate-600 px-3 py-2 text-sm text-white sm:w-auto"
          >
            New Training Job
          </Link>
        </div>
      </TopBar>
      <MainContent>
        <JobsTable />
      </MainContent>
    </>
  );
}
