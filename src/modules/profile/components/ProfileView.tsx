import { useProfile } from "../hooks/useProfile";
import { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import { useThemeStore } from "../../core/states/themeStore"; // Usa tu store real

const defaultProfileImg = "https://ui-avatars.com/api/?background=6EE7B7&color=fff&name=Perfil";

export function ProfileView() {
    const {
        profile,
        isLoading,
        error,
        profilePhotoUrl,
        updating,
        uploading,
        updateProfile,
        changePassword,
        uploadProfilePhoto,
        deleteProfilePhoto,
        fetchProfile,
    } = useProfile();

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const CARD_BG = isDark ? "bg-[#151E2A] text-white" : "bg-white text-gray-900";
    const CARD_SHADOW = "shadow-lg";
    const CARD_BORDER = isDark ? "border border-[#232f3e]" : "border border-gray-200";
    const INPUT_BG = isDark ? "bg-[#212C3B] text-white" : "bg-gray-100 text-gray-900";
    const INPUT_BORDER = isDark ? "border-green-700" : "border-gray-300";
    const LABEL_COLOR = isDark ? "text-green-300" : "text-green-700";
    const BTN_COLOR = "bg-green-600 hover:bg-green-700 text-white";

    const [editForm, setEditForm] = useState({
        name: "",
        lastname: "",
        birthdate: "",
        phone: "",
        country: "",
        province: "",
        city: "",
    });
    useEffect(() => {
        if (profile && profile.profile) {
            setEditForm({
                name: profile.name ?? "",
                lastname: profile.lastname ?? "",
                birthdate: formatDate(profile.profile.birthdate),
                phone: profile.profile.phone?.trim() ?? "",
                country: profile.profile.country ?? "",
                province: profile.profile.province ?? "",
                city: profile.profile.city ?? "",
            });
        }
    }, [profile]);

    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    const handleUpload = async () => {
        if (selectedFile) {
            await uploadProfilePhoto(selectedFile);
            setSelectedFile(null);
            await fetchProfile();
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError("");
        setEditSuccess("");
        try {
            await updateProfile({
                name: editForm.name,
                lastname: editForm.lastname,
                profile: {
                    birthdate: editForm.birthdate,
                    phone: editForm.phone,
                    country: editForm.country,
                    province: editForm.province,
                    city: editForm.city,
                }
            });
            await fetchProfile();
        } catch {
            setEditError("No se pudo actualizar el perfil.");
        }
    };

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: ""
    });
    const [passError, setPassError] = useState("");
    const [passSuccess, setPassSuccess] = useState("");

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassError("");
        setPassSuccess("");
        try {
            await changePassword(passwordForm);
            setPassSuccess("¡Contraseña cambiada!");
            setPasswordForm({ currentPassword: "", newPassword: "" });
        } catch {
            setPassError("Contraseña incorrecta o error en el cambio.");
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-96 text-lg text-green-400">Cargando perfil...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!profile || !profile.profile) return null;

    const profilePicture = profilePhotoUrl || profile.profile.profile_picture || defaultProfileImg;

    return (
        <div className="flex flex-col gap-8 items-center w-full px-2">
            {(editSuccess || editError || passError || passSuccess) && (
                <div className="mb-2 w-full max-w-4xl text-center">
                    {editSuccess && <span className="text-green-500">{editSuccess}</span>}
                    {editError && <span className="text-red-500">{editError}</span>}
                    {passSuccess && <span className="text-green-500">{passSuccess}</span>}
                    {passError && <span className="text-red-500">{passError}</span>}
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
                <div className={`flex flex-col items-center w-full md:w-1/3 rounded-2xl ${CARD_BG} ${CARD_SHADOW} ${CARD_BORDER} p-8`}>
                    <div className="relative mb-2">
                        <img
                            src={profilePicture}
                            alt="Foto de perfil"
                            className="rounded-full border-4 border-green-400 object-cover w-32 h-32 shadow"
                        />
                        {profile.profile.profile_picture && (
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 rounded-full bg-red-600 text-white hover:bg-red-700 border-none px-2 py-1 text-xs font-semibold shadow"
                                onClick={async () => {
                                    await deleteProfilePhoto();
                                    await fetchProfile();
                                }}
                                disabled={uploading}
                                style={{ transform: "translate(50%, 50%)" }}
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                    <label
                        htmlFor="profile-photo-input"
                        className={`cursor-pointer rounded px-4 py-2 bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition-all ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {uploading ? "Subiendo..." : "Cambiar foto"}
                    </label>
                    <input
                        id="profile-photo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    {selectedFile && (
                        <button
                            type="button"
                            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            Confirmar subida
                        </button>
                    )}
                    <div className="mt-6 text-center">
                        <div className={`font-bold text-lg ${LABEL_COLOR}`}>{profile.name} {profile.lastname}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{profile.profile.phone.trim()}</div>
                        <div className="mt-1 text-xs text-gray-400">Tipo: {profile.type || "Sin tipo"}</div>
                        {profile.role && <div className="text-xs text-gray-400">Rol: {profile.role}</div>}
                    </div>
                </div>
                <div className={`w-full md:w-2/3 rounded-2xl ${CARD_BG} ${CARD_SHADOW} ${CARD_BORDER} p-8`}>
                    <h2 className={`mb-4 font-semibold text-lg ${LABEL_COLOR}`}>Editar información</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleEditSubmit}>
                        <div>
                            <label className={LABEL_COLOR}>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                required
                                className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                                style={{ borderWidth: 1 }}
                            />
                        </div>
                        <div>
                            <label className={LABEL_COLOR}>Apellido</label>
                            <input
                                type="text"
                                name="lastname"
                                value={editForm.lastname}
                                onChange={handleEditChange}
                                required
                                className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                                style={{ borderWidth: 1 }}
                            />
                        </div>
                        <div>
                            <label className={LABEL_COLOR}>Fecha de nacimiento</label>
                            <input
                                type="date"
                                name="birthdate"
                                value={editForm.birthdate}
                                onChange={handleEditChange}
                                required
                                className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                                style={{ borderWidth: 1 }}
                            />
                        </div>
                        <div>
                            <label className={LABEL_COLOR}>Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={editForm.phone}
                                onChange={handleEditChange}
                                required
                                className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                                style={{ borderWidth: 1 }}
                            />
                        </div>
                        <div>
                            <label className={LABEL_COLOR}>País</label>
                            <input
                                type="text"
                                name="country"
                                value={editForm.country}
                                onChange={handleEditChange}
                                required
                                className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                                style={{ borderWidth: 1 }}
                            />
                        </div>
                        <div>
                            <label className={LABEL_COLOR}>Provincia</label>
                            <input
                                type="text"
                                name="province"
                                value={editForm.province}
                                onChange={handleEditChange}
                                required
                                className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                                style={{ borderWidth: 1 }}
                            />
                        </div>
                        <div>
                            <label className={LABEL_COLOR}>Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                value={editForm.city}
                                onChange={handleEditChange}
                                required
                                className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                                style={{ borderWidth: 1 }}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={updating}
                                className={`w-full rounded px-8 py-2 font-bold ${BTN_COLOR}`}
                            >
                                {updating ? "Actualizando..." : "Actualizar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={`w-full max-w-4xl mt-2 rounded-2xl ${CARD_BG} ${CARD_SHADOW} ${CARD_BORDER} p-8`}>
                <h2 className={`mb-4 font-semibold text-lg ${LABEL_COLOR}`}>Seguridad</h2>
                <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={handlePasswordSubmit}>
                    <div>
                        <label className={LABEL_COLOR}>Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} border-green-200 outline-none text-gray-500`}
                            style={{ borderWidth: 1 }}
                        />
                    </div>
                    <div>
                        <label className={LABEL_COLOR}>Contraseña nueva</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                            style={{ borderWidth: 1 }}
                        />
                    </div>
                    <div>
                        <label className={LABEL_COLOR}>Contraseña actual</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className={`w-full rounded px-3 py-2 mt-1 ${INPUT_BG} ${INPUT_BORDER} outline-none focus:border-green-500 transition-colors`}
                            style={{ borderWidth: 1 }}
                        />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                        <button
                            type="submit"
                            disabled={updating}
                            className={`rounded px-8 py-2 font-bold ${BTN_COLOR}`}
                        >
                            {updating ? "Actualizando..." : "Cambiar contraseña"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}