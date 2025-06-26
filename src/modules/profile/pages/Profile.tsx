import React from "react";
import Sidebar from "../../core/components/layout/sidebar/pages/Sidebar.tsx";

const Profile = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex items-center justify-center bg-green-50">
                <h1 className="text-2xl font-bold text-green-900">Perfil de Usuario</h1>
            </main>
        </div>
    );
};

export default Profile;