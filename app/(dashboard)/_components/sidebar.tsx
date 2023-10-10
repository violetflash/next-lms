import { Logo } from '@/app/(dashboard)/_components/logo';
import { SidebarRoutes } from '@/app/(dashboard)/_components/sidebarRoutes';

type Props = {

};
const Sidebar = (props: Props) => {
 return (
  <div className="h-full borer-r flex flex-col overflow-auto bg-white shadow-sm">
    <div className="p-6">
      <Logo />
    </div>
    <div className="flex flex-col w-full">
      <SidebarRoutes />
    </div>
  </div>
 );
};

export default Sidebar;