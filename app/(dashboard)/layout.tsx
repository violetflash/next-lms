import { Navbar } from '@/app/(dashboard)/_components/navbar';
import { cn } from '@/lib/utils';
import Sidebar from './_components/sidebar';

type Props = {
  children: React.ReactNode
};
const DashBoardLayout = ({children}: Props) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div
        className={cn(
          "hidden h-full w-56 flex-col fixed inset-y-0 z-50",
          'md:flex'
        )}
      >
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full">
        {children}
      </main>
    </div>
  );
};

export default DashBoardLayout;