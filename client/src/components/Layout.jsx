import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
        {children}
      </div>
    </div>
  );
}

export default Layout;