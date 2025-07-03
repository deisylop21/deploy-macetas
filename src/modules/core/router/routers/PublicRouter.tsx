import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../states/authStore";
import { ROUTES } from "../path";

export default function PublicRouter() {
    const { isAuthenticated } = useAuthStore();
    if (isAuthenticated) {
        return <Navigate to={ROUTES.CATALOG_PLANTS} replace />;
    }

    return <Outlet />;
}