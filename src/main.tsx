import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { MainLayout } from "./layout/MainLayout";
import "./index.css"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <MainPage />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);