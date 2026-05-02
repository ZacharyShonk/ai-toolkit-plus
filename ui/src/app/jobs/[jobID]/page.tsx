'use client';

import { useState, use } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { MdDashboard, MdImage, MdShowChart, MdCode } from 'react-icons/md';
import { Button } from '@headlessui/react';
import { TopBar, MainContent } from '@/components/layout';
import useJob from '@/hooks/useJob';
import SampleImages, { SampleImagesMenu } from '@/components/SampleImages';
import JobOverview from '@/components/JobOverview';
import { redirect } from 'next/navigation';
import JobActionBar from '@/components/JobActionBar';
import JobConfigViewer from '@/components/JobConfigViewer';
import JobLossGraph from '@/components/JobLossGraph';
import { Job } from '@prisma/client';

type PageKey = 'overview' | 'samples' | 'config' | 'loss_log';

interface Page {
  name: string;
  value: PageKey;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ job: Job }>;
  menuItem?: React.ComponentType<{ job?: Job | null }> | null;
  jobTypes?: string[]; // if specified, only show this page for these job types
}

const pages: Page[] = [
  {
    name: 'Overview',
    value: 'overview',
    icon: MdDashboard,
    component: JobOverview,
  },
  {
    name: 'Samples',
    value: 'samples',
    icon: MdImage,
    component: SampleImages,
    menuItem: SampleImagesMenu,
    jobTypes: ['train'],
  },
  {
    name: 'Loss Graph',
    value: 'loss_log',
    icon: MdShowChart,
    component: JobLossGraph,
    jobTypes: ['train'],
  },
  {
    name: 'Config File',
    value: 'config',
    icon: MdCode,
    component: JobConfigViewer,
  },
];

export default function JobPage({ params }: { params: { jobID: string } }) {
  const usableParams = use(params as any) as { jobID: string };
  const jobID = usableParams.jobID;
  const { job, status, refreshJob } = useJob(jobID, 5000);
  const [pageKey, setPageKey] = useState<PageKey>('overview');

  const page = pages.find(p => p.value === pageKey);

  const jobType = job?.job_type || 'unknown';

  let title = `Job: ${job?.name || 'Loading...'}`;
  if (jobType === 'caption') {
    title = `Captioning: ${job?.job_ref || 'Loading...'}`;
  }

  return (
    <>
      {/* Fixed top bar */}
      <TopBar>
        <div>
          <Button className="px-2 text-gray-500 dark:text-gray-300" onClick={() => redirect('/jobs')}>
            <FaChevronLeft />
          </Button>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg">{title}</h1>
        </div>
        {job && (
          <JobActionBar
            job={job}
            onRefresh={refreshJob}
            hideView
            afterDelete={() => {
              redirect('/jobs');
            }}
            autoStartQueue={true}
          />
        )}
      </TopBar>
      <div className="z-20 border-b border-gray-800 bg-gray-800/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-gray-800/85 sm:px-4">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
          {pages.map(page => {
            if (page.jobTypes && !page.jobTypes.includes(jobType)) {
              return null;
            }
            return (
              <Button
                key={page.value}
                onClick={() => setPageKey(page.value)}
                className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm ${page.value === pageKey ? 'bg-gray-300 text-white dark:bg-gray-700' : 'bg-transparent text-gray-200 hover:bg-gray-700'}`}
              >
                <page.icon className="text-sm" />
                {page.name}
              </Button>
            );
          })}
          {page?.menuItem && (
            <div className="ml-auto w-full sm:w-auto">
              <page.menuItem job={job} />
            </div>
          )}
        </div>
      </div>
      <MainContent className={pageKey === 'config' ? 'px-0 py-0' : undefined}>
        {status === 'loading' && job == null && <p>Loading...</p>}
        {status === 'error' && job == null && <p>Error fetching job</p>}
        {job && (
          <>
            {pages.map(page => {
              const Component = page.component;
              return page.value === pageKey ? <Component key={page.value} job={job} /> : null;
            })}
          </>
        )}
      </MainContent>
    </>
  );
}
