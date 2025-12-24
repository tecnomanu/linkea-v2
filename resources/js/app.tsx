import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Linkea";

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

// Global error handler for CSRF token expiration (419)
document.addEventListener("inertia:error", (event: any) => {
    // Check if the error is a 419 (CSRF token mismatch/expiration)
    if (event.detail?.response?.status === 419) {
        console.warn(
            "CSRF token expired (419). Reloading page to refresh session..."
        );
        // Reload the page to get a fresh CSRF token
        window.location.reload();
    }
});
