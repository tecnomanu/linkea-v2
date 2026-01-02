/**
 * Landing-only entrypoint
 *
 * This is a minimal entrypoint for public landing pages.
 * It does NOT include Panel, Admin, Auth, or Web components.
 *
 * Benefits:
 * - Smaller bundle size (~30KB vs ~128KB)
 * - Faster Time to Interactive for public visitors
 * - Better cache efficiency
 */

import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

createInertiaApp({
    title: (title) => {
        if (title?.toLowerCase().includes("linkea")) {
            return title;
        }
        return title ? `${title} | Linkea` : "Linkea";
    },
    resolve: (name) => {
        // Only resolve LandingView - no need to glob all pages
        const pages = import.meta.glob("./Pages/LandingView.tsx", {
            eager: true,
        });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#f97316",
    },
});
