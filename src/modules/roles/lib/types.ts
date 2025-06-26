export interface Permission {
    module_id: string;
    module_name?: string;
    permissions: PermissionType[];
}

export type PermissionType = "CREATE" | "READ" | "UPDATE" | "DELETE";

export interface Role {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_date: string;
    permissions: Permission[];
    user_count?: number;
}

export interface CreateRoleDTO {
    name: string;
    description: string;
    permissions: Permission[];
}

export const permissionLabels: Record<PermissionType, string> = {
    "CREATE": "Crear",
    "READ": "Ver",
    "UPDATE": "Editar",
    "DELETE": "Eliminar"
};

export const validatePermissions = (permissions: PermissionType[]): boolean => {
    if (permissions.length === 0) return true;
    const hasOtherPermissions = permissions.some(p => p !== "READ");
    const hasReadPermission = permissions.includes("READ");
    return !hasOtherPermissions || (hasOtherPermissions && hasReadPermission);
};