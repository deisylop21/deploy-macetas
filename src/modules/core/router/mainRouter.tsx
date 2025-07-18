import { Routes, Route, Navigate } from "react-router-dom";
import PublicRouter from "./routers/PublicRouter";
import PrivateRouter from "./routers/PrivateRouter";
import MainLayout from "../components/layout/MainLayout";
import { ROUTES } from "./path";
import LoginPage from "../../auth/pages/LoginPage";
import ForgotPasswordPage from "../../auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../../auth/pages/ResetPasswordPage";
import ProfilePage from "../../profile/pages/ProfilePage";
import PlantCatalogPage from "../../plants/pages/plant-catalogy/PlantCatalogPage.tsx";
import UserAdminPage from "../../users/pages/UserPage.tsx";
import ModulePage from "../../module/pages/ModulePage.tsx";
import RolePage from "../../roles/pages/RolePage.tsx";
import DevicesPage from "../../devices/pages/DevicesPage.tsx";
import UserGeneralPage from "../../users-generales/pages/UserGeneralPage.tsx";

export default function MainRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route element={<PublicRouter />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            </Route>
            <Route element={<PrivateRouter />}>
                <Route element={<MainLayout />}>
                    <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                    <Route path={ROUTES.CATALOG_PLANTS} element={<PlantCatalogPage />} />
                    <Route path={ROUTES.USERS_ADMIN} element={<UserAdminPage />} />
                    <Route path={ROUTES.MODULES} element={<ModulePage />} />
                    <Route path={ROUTES.USER_ROLE} element={<RolePage />} />
                    <Route path={ROUTES.DEVICES} element={<DevicesPage />} />
                    <Route path={ROUTES.USERS_GENERAL_ADMIN} element={<UserGeneralPage />} />
                </Route>
            </Route>
        </Routes>
    );
}