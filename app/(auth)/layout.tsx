type Props = {
  children: React.ReactNode
};
const Layout = ({children}: Props) => {
  return (
    <div className="h-full flex justify-center items-center">
      {children}
    </div>
  );
};

export default Layout;