export interface User {
    sub: string;
    email: string;
    type: string;
    name: string;
    picture: string | null;
    exp: number;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    userType: string | null;
    user: User | null;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}