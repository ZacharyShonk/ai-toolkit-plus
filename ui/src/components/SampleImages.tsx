import { useMemo, useState, useRef, useEffect } from 'react';
import useSampleImages from '@/hooks/useSampleImages';
import SampleImageCard from './SampleImageCard';
import { Job } from '@prisma/client';
import { JobConfig } from '@/types';
import { LuImageOff, LuLoader, LuBan } from 'react-icons/lu';
import { Button } from '@headlessui/react';
import { FaDownload } from 'react-icons/fa';
import { apiClient } from '@/utils/api';
import classNames from 'classnames';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import SampleImageViewer from './SampleImageViewer';

interface SampleImagesMenuProps {
  job?: Job | null;
}

export const SampleImagesMenu = ({ job }: SampleImagesMenuProps) => {
  const [isZipping, setIsZipping] = useState(false);

  const downloadZip = async () => {
    if (isZipping) return;
    setIsZipping(true);

    try {
      const res = await apiClient.post('/api/zip', {
        zipTarget: 'samples',
        jobName: job?.name,
      });

      const zipPath = res.data.zipPath; // e.g. /mnt/Train2/out/ui/.../samples.zip
      if (!zipPath) throw new Error('No zipPath in response');

      const downloadPath = `/api/files/${encodeURIComponent(zipPath)}`;
      const a = document.createElement('a');
      a.href = downloadPath;
      // optional: suggest filename (browser may ignore if server sets Content-Disposition)
      a.download = 'samples.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error downloading zip:', err);
    } finally {
      setIsZipping(false);
    }
  };
  return (
    <Button
      onClick={downloadZip}
      className={classNames(`px-4 py-1 h-8 hover:bg-gray-200 dark:hover:bg-gray-700`, {
        'opacity-50 cursor-not-allowed': isZipping,
      })}
    >
      {isZipping ? (
        <LuLoader className="animate-spin inline-block mr-2" />
      ) : (
        <FaDownload className="inline-block mr-2" />
      )}
      {isZipping ? 'Preparing' : 'Download'}
    </Button>
  );
};

interface SampleImagesProps {
  job: Job;
}

export default function SampleImages({ job }: SampleImagesProps) {
  const { sampleImages, status, refreshSampleImages } = useSampleImages(job.id, 5000);
  const [selectedSamplePath, setSelectedSamplePath] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const didFirstScroll = useRef(false);
  const numSamples = useMemo(() => {
    if (job?.job_config) {
      const jobConfig = JSON.parse(job.job_config) as JobConfig;
      const sampleConfig = jobConfig.config.process[0].sample;
      const numPrompts = sampleConfig.prompts ? sampleConfig.prompts.length : 0;
      const numSamples = sampleConfig.samples.length;
      return Math.max(numPrompts, numSamples, 1);
    }
    return 10;
  }, [job]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'instant' });
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const PageInfoContent = useMemo(() => {
    let icon = null;
    let text = '';
    let subtitle = '';
    let showIt = false;
    let bgColor = '';
    let textColor = '';
    let iconColor = '';

    if (sampleImages.length > 0) return null;

    if (status == 'loading') {
      icon = <LuLoader className="animate-spin w-8 h-8" />;
      text = 'Loading Samples';
      subtitle = 'Please wait while we fetch your samples...';
      showIt = true;
      bgColor = 'bg-gray-50 dark:bg-gray-800/50';
      textColor = 'text-gray-900 dark:text-gray-100';
      iconColor = 'text-gray-500 dark:text-gray-400';
    }
    if (status == 'error') {
      icon = <LuBan className="w-8 h-8" />;
      text = 'Error Loading Samples';
      subtitle = 'There was a problem fetching the samples.';
      showIt = true;
      bgColor = 'bg-red-50 dark:bg-red-950/20';
      textColor = 'text-red-900 dark:text-red-100';
      iconColor = 'text-red-600 dark:text-red-400';
    }
    if (status == 'success' && sampleImages.length === 0) {
      icon = <LuImageOff className="w-8 h-8" />;
      text = 'No Samples Found';
      subtitle = 'No samples have been generated yet';
      showIt = true;
      bgColor = 'bg-gray-50 dark:bg-gray-800/50';
      textColor = 'text-gray-900 dark:text-gray-100';
      iconColor = 'text-gray-500 dark:text-gray-400';
    }

    if (!showIt) return null;

    return (
      <div
        className={`mt-10 flex flex-col items-center justify-center py-16 px-8 rounded-xl border-2 border-gray-700 border-dashed ${bgColor} ${textColor} mx-auto max-w-md text-center`}
      >
        <div className={`${iconColor} mb-4`}>{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{text}</h3>
        <p className="text-sm opacity-75 leading-relaxed">{subtitle}</p>
      </div>
    );
  }, [status, sampleImages.length]);

  const sampleConfig = useMemo(() => {
    if (job?.job_config) {
      const jobConfig = JSON.parse(job.job_config) as JobConfig;
      return jobConfig.config.process[0].sample;
    }
    return null;
  }, [job]);

  // scroll to bottom on first load of samples
  useEffect(() => {
    if (status === 'success' && sampleImages.length > 0 && !didFirstScroll.current) {
      didFirstScroll.current = true;
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [status, sampleImages.length]);

  return (
    <div ref={containerRef} className="relative overflow-y-auto">
      <div className="pb-4">
        {PageInfoContent}
        {sampleImages && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {sampleImages.map((sample: string, idx: number) => {
              return (
                <div key={sample}>
                  <SampleImageCard
                    imageUrl={sample}
                    numSamples={numSamples}
                    sampleImages={sampleImages}
                    alt="Sample Image"
                    onClick={() => setSelectedSamplePath(sample)}
                    observerRoot={containerRef.current}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <SampleImageViewer
        imgPath={selectedSamplePath}
        numSamples={numSamples}
        sampleImages={sampleImages}
        onChange={setPath => setSelectedSamplePath(setPath)}
        sampleConfig={sampleConfig}
        refreshSampleImages={refreshSampleImages}
      />
      <div
        className="fixed right-4 top-24 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white opacity-80 shadow-lg hover:opacity-100"
        onClick={scrollToTop}
        title="Scroll to Top"
      >
        <FaCaretUp className="text-gray-500 dark:text-gray-400" />
      </div>
      <div
        className="fixed bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white opacity-80 shadow-lg hover:opacity-100"
        onClick={scrollToBottom}
        title="Scroll to Bottom"
      >
        <FaCaretDown className="text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
}
