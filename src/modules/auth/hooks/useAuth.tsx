import { useLoginMutation } from "./mutations/useLoginMutation";
import { useLogoutMutation } from "./mutations/useLogoutMutation";
import { useForgotPasswordMutation } from "./mutations/useForgotPasswordMutation";
import { useResetPasswordMutation } from "./mutations/useResetPasswordMutation";

export const useAuth = () => {
    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation();
    const forgotPasswordMutation = useForgotPasswordMutation();
    const resetPasswordMutation = useResetPasswordMutation();

    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password });
    };

    const logout = () => {
        logoutMutation.mutate();
    };
    const forgotPassword = async (email: string) => {
        await forgotPasswordMutation.mutateAsync({ email });
    };

    const resetPassword = async (email: string, code: string, newPassword: string) => {
        await resetPasswordMutation.mutateAsync({ email, code, newPassword });
    };

    return {
        login,
        loginLoading: loginMutation.isPending,
        loginError: loginMutation.error?.message || null,
        resetLoginError: loginMutation.reset,

        logout,
        logoutLoading: logoutMutation.isPending,
        logoutError: logoutMutation.error?.message || null,
        resetLogoutError: logoutMutation.reset,

        forgotPassword,
        forgotPasswordLoading: forgotPasswordMutation.isPending,
        forgotPasswordError: forgotPasswordMutation.error?.message || null,
        forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
        resetForgotPasswordError: forgotPasswordMutation.reset,

        resetPassword,
        resetPasswordLoading: resetPasswordMutation.isPending,
        resetPasswordError: resetPasswordMutation.error?.message || null,
        resetPasswordSuccess: resetPasswordMutation.isSuccess,
        resetResetPasswordError: resetPasswordMutation.reset,

    };
};