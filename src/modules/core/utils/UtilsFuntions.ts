import {useAuthStore} from "../states/authStore.ts";

export const setAuthToken = (token: string): void => {

};

export const getAuthToken = (): string | null => {
    return useAuthStore.getState().token;
};

export const setUserType = (type: string): void => {
};

export const getUserType = (): string | null => {
    return useAuthStore.getState().userType;
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
    };
};

export const getheadersima = () => {
    return {
        'Authorization': `Bearer ${getAuthToken()}`
    };
};

export  const removetoken = () => {

}

export  const removetype = () => {

}