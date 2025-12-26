import "../css/app.css";
import "./bootstrap";

import { TooltipProvider } from "@/Components/ui/Tooltip";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

// Type for shared props from Laravel
interface SharedProps {
    appName: string;
    auth: {
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string | null;
            role_name: string;
        } | null;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
}

createInertiaApp({
    // Title function receives the page title, appName comes from shared props
    title: (title) => {
        // If title already includes "linkea", don't append
        if (title?.toLowerCase().includes("linkea")) {
            return title;
        }
        // Fallback to "Linkea" - the actual appName is used in individual pages
        return title ? `${title} | Linkea` : "Linkea";
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        // Access appName from shared props (comes from Laravel config)
        const sharedProps = props.initialPage.props as unknown as SharedProps;
        const appName = sharedProps.appName || "Linkea";

        // Store globally for components that need it
        window.__LINKEA_APP_NAME__ = appName;

        const root = createRoot(el);
        root.render(
            <TooltipProvider>
                <App {...props} />
            </TooltipProvider>
        );
    },
    progress: {
        color: "#f97316", // Brand orange color
    },
});

// Global error handler for CSRF token expiration (419)
document.addEventListener("inertia:error", (event: any) => {
    if (event.detail?.response?.status === 419) {
        console.warn(
            "CSRF token expired (419). Reloading page to refresh session..."
        );
        window.location.reload();
    }
});
