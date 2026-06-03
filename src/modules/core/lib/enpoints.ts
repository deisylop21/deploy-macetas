export const API_ENDPOINTS = {
    LOGIN_ADMIN: "https://jardindeploy-olow.vercel.app/auth/login-admin",
    FORGOT_PASSWORD: "https://jardindeploy-olow.vercel.app/auth/forgot-password",
    RESET_PASSWORD: "https://jardindeploy-olow.vercel.app/auth/reset-password",

    ROLES: "https://jardindeploy-olow.vercel.app/roles",

    MODULE: "https://jardindeploy-olow.vercel.app/modules",
    MODULE_BY_ID: (id: string) =>
        `https://jardindeploy-olow.vercel.app/modules/${id}`,

    ADMIN_USERS: "https://jardindeploy-olow.vercel.app/admin-management/users",

    CATALOG_PLANTS: "https://jardindeploy-olow.vercel.app/catalog-plants",
    CATALOG_PLANT_BY_ID: (id: string) =>
        `https://jardindeploy-olow.vercel.app/catalog-plants/${id}`,

    PLANT_IMAGES_UPLOAD:
        "https://jardindeploy-olow.vercel.app/plant-images/upload",
    PLANT_IMAGES_LINK:
        "https://jardindeploy-olow.vercel.app/plant-images/link",
    PLANT_IMAGES_BY_ID: (id: string) =>
        `https://jardindeploy-olow.vercel.app/plant-images/${id}`,

    ADMIN_DEVICES: "https://jardindeploy-olow.vercel.app/admin/devices",
    ADMIN_DEVICE_BY_ID: (id: string) =>
        `https://jardindeploy-olow.vercel.app/admin/devices/${id}`,
    ADMIN_DEVICE_REGENERATE_KEY: (id: string) =>
        `https://jardindeploy-olow.vercel.app/admin/devices/${id}/regenerate-key`,

    TAXONOMY: "https://jardindeploy-olow.vercel.app/taxonomy",

    USERS_GENERAL_MANAGEMENT:
        "https://jardindeploy-olow.vercel.app/users-general-management",

    PROFILE_ADMIN:
        "https://jardindeploy-olow.vercel.app/profile-management/admin",
    PROFILE_UPDATE:
        "https://jardindeploy-olow.vercel.app/profile-management",
    PROFILE_CHANGE_PASSWORD:
        "https://jardindeploy-olow.vercel.app/profile-management/change-password",
    PROFILE_PHOTO:
        "https://jardindeploy-olow.vercel.app/profile-management/profile/photo",

    FAQS: "https://jardindeploy-olow.vercel.app/faqs",
    FAQS_BY_ID: (id: string) =>
        `https://jardindeploy-olow.vercel.app/faqs/${id}`,
    FAQS_BY_PARENT: (parentId: string) =>
        `https://jardindeploy-olow.vercel.app/faqs?parentId=${parentId}`,

    FAQS_IMAGES_UPLOAD:
        "https://jardindeploy-olow.vercel.app/faqs/images",
    FAQS_IMAGES_DELETE:
        "https://jardindeploy-olow.vercel.app/faqs/delete/images",

    MARKETPLACE_CATEGORIES:
        "https://jardindeploy-olow.vercel.app/marketplace/categories",
    MARKETPLACE_CATEGORY_BY_ID: (id: string) =>
        `https://jardindeploy-olow.vercel.app/marketplace/categories/${id}`,
    MARKETPLACE_CATEGORIES_BY_PARENT: (parent_id: string) =>
        `https://jardindeploy-olow.vercel.app/marketplace/categories?parent_id=${parent_id}`,
    MARKETPLACE_CATEGORY_UPLOAD_IMAGE:
        "https://jardindeploy-olow.vercel.app/marketplace/categories/upload-image",
    MARKETPLACE_CATEGORY_IMAGE: (id: string) =>
        `https://jardindeploy-olow.vercel.app/marketplace/categories/${id}/image`,

    MARKETPLACE_PRODUCTS:
        "https://jardindeploy-olow.vercel.app/marketplace/products",
    MARKETPLACE_PRODUCT_BY_ID: (id: string) =>
        `https://jardindeploy-olow.vercel.app/marketplace/products/${id}`,
    MARKETPLACE_PRODUCT_UPLOAD_IMAGE:
        "https://jardindeploy-olow.vercel.app/marketplace/products/upload-image",
    MARKETPLACE_PRODUCT_MAIN_IMAGE: (id: string) =>
        `https://jardindeploy-olow.vercel.app/marketplace/products/${id}/main-image`,
    MARKETPLACE_PRODUCT_IMAGES: (id: string) =>
        `https://jardindeploy-olow.vercel.app/marketplace/products/${id}/images`,
    MARKETPLACE_PRODUCT_IMAGE_BY_ID: (
        productId: string,
        imageId: string
    ) =>
        `https://jardindeploy-olow.vercel.app/marketplace/products/${productId}/images/${imageId}`,
};