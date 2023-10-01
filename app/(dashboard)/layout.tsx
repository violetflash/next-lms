import { cn } from '@/lib/utils';
import Sidebar from './_components/sidebar';

type Props = {
  children: React.ReactNode
};
const DashBoardLayout = ({children}: Props) => {
  return (
    <div className="h-full">
      <div
        className={cn(
          "hidden h-full w-56 flex-col fixed inset-y-0 z-50",
          'md:flex'
        )}
      >
        <Sidebar />
      </div>
      {children}
    </div>
  );
};

export default DashBoardLayout;