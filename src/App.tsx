import { BrowserRouter } from "react-router-dom";
import MainRouter from "./modules/core/router/mainRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./modules/core/components/providers/ThemeProvider";
import { useAuthStore } from "./modules/core/states/authStore";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
    const { initializeAuth } = useAuthStore();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <BrowserRouter>
                    <MainRouter />
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;