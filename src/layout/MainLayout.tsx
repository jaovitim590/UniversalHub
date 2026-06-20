import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function MainLayout() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
} 