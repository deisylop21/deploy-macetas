import { ProfileView } from "../components/ProfileView";
import { useThemeStore } from "../../core/states/themeStore";

export default function ProfilePage() {
    const { mode } = useThemeStore();
    return (
        <div className={mode === "dark" ? "dark bg-[#151E2A] min-h-screen" : "bg-white min-h-screen"}>
            <ProfileView />
        </div>
    );
}