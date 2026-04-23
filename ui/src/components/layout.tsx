import classNames from 'classnames';
import { MobileNavButton } from './AppShell';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const TopBar: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'sticky top-0 z-30 flex min-h-14 w-full flex-wrap items-center gap-2 border-b border-gray-800 bg-gray-900/95 px-3 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 sm:px-4',
        className,
      )}
    >
      <MobileNavButton />
      {children ? children : null}
    </div>
  );
};

export const MainContent: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={classNames('min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-4 sm:py-5', className)}>
      {children ? children : null}
    </div>
  );
};
