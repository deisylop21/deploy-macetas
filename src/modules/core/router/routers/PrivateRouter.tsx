import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../states/authStore";
import { useEffect } from "react";
import { ROUTES } from "../path";

export default function PrivateRouter() {
    const { isAuthenticated, validateToken } = useAuthStore();

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}