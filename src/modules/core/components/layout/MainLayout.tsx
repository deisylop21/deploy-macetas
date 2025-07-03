import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/pages/Sidebar";
import { Outlet } from "react-router-dom";
import { useSidebarState } from "./sidebar/hooks/useSidebarState";

const MainLayout = () => {
    const { open } = useSidebarState();
    return (
        <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <div className="h-16 w-full" /> {/* Espaciador, igual al alto del navbar */}
            <div className="flex flex-row flex-1">
                <Sidebar />
                <main
                    className={`
                        flex-1 overflow-auto transition-all duration-300
                        ${open ? "ml-64" : "ml-0"}
                    `}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;