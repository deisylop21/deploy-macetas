import { Routes, Route, Navigate } from "react-router-dom";
import PublicRouter from "./routers/PublicRouter";
import PrivateRouter from "./routers/PrivateRouter";
import MainLayout from "../../components/layout/MainLayout";
import { ROUTES } from "./path";
import LoginPage from "../../auth/pages/LoginPage";
import ForgotPasswordPage from "../../auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../../auth/pages/ResetPasswordPage";
import Profile from "../../profile/pages/Profile";
import PlantCatalogPage from "../../plants/pages/plant-catalogy/PlantCatalogPage.tsx";
import PlantFamilyPage from "../../plants/pages/plant-family/PlantFamilyPage.tsx";
import PlantGenusPage from "../../plants/pages/plant-genus/PlantGenusPage.tsx";
import PlantSpeciesPage from "../../plants/pages/plant-species/PlantSpeciesPage.tsx";
import UserAdminPage from "../../users/pages/UserPage.tsx";
import ModulePage from "../../module/pages/ModulePage.tsx";
import RolePage from "../../roles/pages/RolePage.tsx";
import DevicesPage from "../../devices/pages/DevicesPage.tsx";

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
                    <Route path={ROUTES.PROFILE} element={<Profile />} />
                    <Route path={ROUTES.CATALOG_PLANTS} element={<PlantCatalogPage />} />
                    <Route path={ROUTES.PLANT_FAMILY} element={<PlantFamilyPage />} />
                    <Route path={ROUTES.PLANT_GENUS} element={<PlantGenusPage />} />
                    <Route path={ROUTES.PLANT_SPECIES} element={<PlantSpeciesPage />} />
                    <Route path={ROUTES.USERS_ADMIN} element={<UserAdminPage />} />
                    <Route path={ROUTES.MODULES} element={<ModulePage />} />
                    <Route path={ROUTES.USER_ROLE} element={<RolePage />} />
                    <Route path={ROUTES.DEVICES} element={<DevicesPage />} />
                </Route>
            </Route>
        </Routes>
    );
}