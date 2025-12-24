/**
 * LEGACY BACKGROUNDS
 * 
 * These backgrounds were migrated from the legacy Angular application.
 * They are preserved for backward compatibility with existing landings.
 * 
 * NOTE: This is legacy code. New backgrounds should be added to the Themes system.
 * These backgrounds may be deprecated in a future version.
 */

export interface LegacyBackground {
    id: string;
    name: string;
    backgroundColor: string;
    backgroundImage?: string;
    backgroundAttachment?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    background?: string;
    props?: Record<string, string | number>;
    controls?: {
        hideBgColor?: boolean;
        colors?: string[];
        scale?: { min: number; max: number; default: number; aspectRatio?: boolean };
        opacity?: { default: number };
        rotationBg?: { min: number; max: number; default: number };
    };
}

export const LEGACY_BACKGROUNDS: LegacyBackground[] = [
    {
        id: "static",
        name: "Un Color",
        backgroundColor: "#FE6A16",
    },
    {
        id: "gradient",
        name: "Gradient",
        backgroundColor: "#ffc107",
        background: "linear-gradient(90deg, #FE6A16 0%, #ff528e 100%)",
        props: {
            color1: "#FE6A16",
            color2: "#ff528e",
        },
        controls: {
            hideBgColor: true,
            colors: ["color1", "color2"],
            rotationBg: { min: 0, max: 360, default: 90 },
        },
    },
    {
        id: "diagonal_stripes",
        name: "Diagonal Stripes",
        backgroundColor: "#131",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 20 20\'%3E%3Cg fill-opacity=\'1\'%3E%3Cpolygon fill=\'%23242\' points=\'20 10 10 0 0 0 20 20\'/%3E%3Cpolygon fill=\'%23242\' points=\'0 10 0 20 10 20\'/%3E%3C/g%3E%3C/svg%3E")',
        props: {
            color2: "#242",
            opacity: 100,
            scale: 100,
        },
    },
    {
        id: "large_triangles",
        name: "Large Triangles",
        backgroundColor: "#00b7ff",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'540\' height=\'450\' viewBox=\'0 0 1080 900\'%3E%3Cg fill-opacity=\'.1\'%3E%3Cpolygon fill=\'%23444\' points=\'90 150 0 300 180 300\'/%3E%3Cpolygon points=\'90 150 180 0 0 0\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'270 150 360 0 180 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'450 150 360 300 540 300\'/%3E%3Cpolygon fill=\'%23999\' points=\'450 150 540 0 360 0\'/%3E%3Cpolygon points=\'630 150 540 300 720 300\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'630 150 720 0 540 0\'/%3E%3Cpolygon fill=\'%23444\' points=\'810 150 720 300 900 300\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'810 150 900 0 720 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'990 150 900 300 1080 300\'/%3E%3Cpolygon fill=\'%23444\' points=\'990 150 1080 0 900 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'90 450 0 600 180 600\'/%3E%3Cpolygon points=\'90 450 180 300 0 300\'/%3E%3Cpolygon fill=\'%23666\' points=\'270 450 180 600 360 600\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'270 450 360 300 180 300\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'450 450 360 600 540 600\'/%3E%3Cpolygon fill=\'%23999\' points=\'450 450 540 300 360 300\'/%3E%3Cpolygon fill=\'%23999\' points=\'630 450 540 600 720 600\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'630 450 720 300 540 300\'/%3E%3Cpolygon points=\'810 450 720 600 900 600\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'810 450 900 300 720 300\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'990 450 900 600 1080 600\'/%3E%3Cpolygon fill=\'%23444\' points=\'990 450 1080 300 900 300\'/%3E%3Cpolygon fill=\'%23222\' points=\'90 750 0 900 180 900\'/%3E%3Cpolygon points=\'270 750 180 900 360 900\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'270 750 360 600 180 600\'/%3E%3Cpolygon points=\'450 750 540 600 360 600\'/%3E%3Cpolygon points=\'630 750 540 900 720 900\'/%3E%3Cpolygon fill=\'%23444\' points=\'630 750 720 600 540 600\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'810 750 720 900 900 900\'/%3E%3Cpolygon fill=\'%23666\' points=\'810 750 900 600 720 600\'/%3E%3Cpolygon fill=\'%23999\' points=\'990 750 900 900 1080 900\'/%3E%3Cpolygon fill=\'%23999\' points=\'180 0 90 150 270 150\'/%3E%3Cpolygon fill=\'%23444\' points=\'360 0 270 150 450 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'540 0 450 150 630 150\'/%3E%3Cpolygon points=\'900 0 810 150 990 150\'/%3E%3Cpolygon fill=\'%23222\' points=\'0 300 -90 450 90 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'0 300 90 150 -90 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'180 300 90 450 270 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'180 300 270 150 90 150\'/%3E%3Cpolygon fill=\'%23222\' points=\'360 300 270 450 450 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'360 300 450 150 270 150\'/%3E%3Cpolygon fill=\'%23444\' points=\'540 300 450 450 630 450\'/%3E%3Cpolygon fill=\'%23222\' points=\'540 300 630 150 450 150\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'720 300 630 450 810 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'720 300 810 150 630 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'900 300 810 450 990 450\'/%3E%3Cpolygon fill=\'%23999\' points=\'900 300 990 150 810 150\'/%3E%3Cpolygon points=\'0 600 -90 750 90 750\'/%3E%3Cpolygon fill=\'%23666\' points=\'0 600 90 450 -90 450\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'180 600 90 750 270 750\'/%3E%3Cpolygon fill=\'%23444\' points=\'180 600 270 450 90 450\'/%3E%3Cpolygon fill=\'%23444\' points=\'360 600 270 750 450 750\'/%3E%3Cpolygon fill=\'%23999\' points=\'360 600 450 450 270 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'540 600 630 450 450 450\'/%3E%3Cpolygon fill=\'%23222\' points=\'720 600 630 750 810 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'900 600 810 750 990 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'900 600 990 450 810 450\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'0 900 90 750 -90 750\'/%3E%3Cpolygon fill=\'%23444\' points=\'180 900 270 750 90 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'360 900 450 750 270 750\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'540 900 630 750 450 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'720 900 810 750 630 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'900 900 990 750 810 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'1080 300 990 450 1170 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'1080 300 1170 150 990 150\'/%3E%3Cpolygon points=\'1080 600 990 750 1170 750\'/%3E%3Cpolygon fill=\'%23666\' points=\'1080 600 1170 450 990 450\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'1080 900 1170 750 990 750\'/%3E%3C/g%3E%3C/svg%3E")',
    },
    {
        id: "repeating_chevrons",
        name: "Repeating Chevrons",
        backgroundColor: "#DFA",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\' viewBox=\'0 0 120 120\'%3E%3Cpolygon fill=\'%23AE9\' fill-opacity=\'1\' points=\'120 120 60 120 90 90 120 60 120 0 120 0 60 60 0 0 0 60 30 90 60 120 120 120\'/%3E%3C/svg%3E")',
        props: {
            color2: "#AE9",
        },
    },
    {
        id: "diamond_sunset",
        name: "Diamond Sunset",
        backgroundColor: "#ffffff",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' x1=\'0\' x2=\'0\' y1=\'0\' y2=\'1\'%3E%3Cstop offset=\'0\' stop-color=\'%2380F\'/%3E%3Cstop offset=\'1\' stop-color=\'%23f40\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id=\'b\' width=\'24\' height=\'24\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle fill=\'%23fff\' cx=\'12\' cy=\'12\' r=\'12\'/%3E%3C/pattern%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23a)\'/%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23b)\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
    },
    {
        id: "abstract_envelope",
        name: "Abstract Envelope",
        backgroundColor: "#7a7",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 2 1\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' gradientUnits=\'userSpaceOnUse\' x1=\'0\' x2=\'0\' y1=\'0\' y2=\'1\'%3E%3Cstop offset=\'0\' stop-color=\'%237a7\'/%3E%3Cstop offset=\'1\' stop-color=\'%234fd\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'b\' gradientUnits=\'userSpaceOnUse\' x1=\'0\' y1=\'0\' x2=\'0\' y2=\'1\'%3E%3Cstop offset=\'0\' stop-color=\'%23cf8\' stop-opacity=\'0\'/%3E%3Cstop offset=\'1\' stop-color=\'%23cf8\' stop-opacity=\'1\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'c\' gradientUnits=\'userSpaceOnUse\' x1=\'0\' y1=\'0\' x2=\'2\' y2=\'2\'%3E%3Cstop offset=\'0\' stop-color=\'%23cf8\' stop-opacity=\'0\'/%3E%3Cstop offset=\'1\' stop-color=\'%23cf8\' stop-opacity=\'1\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x=\'0\' y=\'0\' fill=\'url(%23a)\' width=\'2\' height=\'1\'/%3E%3Cg fill-opacity=\'0.5\'%3E%3Cpolygon fill=\'url(%23b)\' points=\'0 1 0 0 2 0\'/%3E%3Cpolygon fill=\'url(%23c)\' points=\'2 1 2 0 0 0\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
    },
    {
        id: "wintery_sunburst",
        name: "Wintery Sunburst",
        backgroundColor: "#FFF",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 800 800\'%3E%3Cdefs%3E%3CradialGradient id=\'a\' cx=\'400\' cy=\'400\' r=\'50%25\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%23FFF\'/%3E%3Cstop offset=\'1\' stop-color=\'%230EF\'/%3E%3C/radialGradient%3E%3CradialGradient id=\'b\' cx=\'400\' cy=\'400\' r=\'70%25\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%23FFF\'/%3E%3Cstop offset=\'1\' stop-color=\'%230FF\'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill=\'url(%23a)\' width=\'800\' height=\'800\'/%3E%3Cg fill-opacity=\'.8\'%3E%3Cpath fill=\'url(%23b)\' d=\'M998.7 439.2c1.7-26.5 1.7-52.7 0.1-78.5L401 399.9c0 0 0-0.1 0-0.1l587.6-116.9c-5.1-25.9-11.9-51.2-20.3-75.8L400.9 399.7c0 0 0-0.1 0-0.1l537.3-265c-11.6-23.5-24.8-46.2-39.3-67.9L400.8 399.5c0 0 0-0.1-0.1-0.1l450.4-395c-17.3-19.7-35.8-38.2-55.5-55.5l-395 450.4c0 0-0.1 0-0.1-0.1L733.4-99c-21.7-14.5-44.4-27.6-68-39.3l-265 537.4c0 0-0.1 0-0.1 0l192.6-567.4c-24.6-8.3-49.9-15.1-75.8-20.2L400.2 399c0 0-0.1 0-0.1 0l39.2-597.7c-26.5-1.7-52.7-1.7-78.5-0.1L399.9 399c0 0-0.1 0-0.1 0L282.9-188.6c-25.9 5.1-51.2 11.9-75.8 20.3l192.6 567.4c0 0-0.1 0-0.1 0l-265-537.3c-23.5 11.6-46.2 24.8-67.9 39.3l332.8 498.1c0 0-0.1 0-0.1 0.1L4.4-51.1C-15.3-33.9-33.8-15.3-51.1 4.4l450.4 395c0 0 0 0.1-0.1 0.1L-99 66.6c-14.5 21.7-27.6 44.4-39.3 68l537.4 265c0 0 0 0.1 0 0.1l-567.4-192.6c-8.3 24.6-15.1 49.9-20.2 75.8L399 399.8c0 0 0 0.1 0 0.1l-597.7-39.2c-1.7 26.5-1.7 52.7-0.1 78.5L399 400.1c0 0 0 0.1 0 0.1l-587.6 116.9c5.1 25.9 11.9 51.2 20.3 75.8l567.4-192.6c0 0 0 0.1 0 0.1l-537.3 265c11.6 23.5 24.8 46.2 39.3 67.9l498.1-332.8c0 0 0 0.1 0.1 0.1l-450.4 395c17.3 19.7 35.8 38.2 55.5 55.5l395-450.4c0 0 0.1 0 0.1 0.1L66.6 899c21.7 14.5 44.4 27.6 68 39.3l265-537.4c0 0 0.1 0 0.1 0L207.1 968.3c24.6 8.3 49.9 15.1 75.8 20.2L399.8 401c0 0 0.1 0 0.1 0l-39.2 597.7c26.5 1.7 52.7 1.7 78.5 0.1L400.1 401c0 0 0.1 0 0.1 0l116.9 587.6c25.9-5.1 51.2-11.9 75.8-20.3L400.3 400.9c0 0 0.1 0 0.1 0l265 537.3c23.5-11.6 46.2-24.8 67.9-39.3L400.5 400.8c0 0 0.1 0 0.1-0.1l395 450.4c19.7-17.3 38.2-35.8 55.5-55.5l-450.4-395c0 0 0-0.1 0.1-0.1L899 733.4c14.5-21.7 27.6-44.4 39.3-68l-537.4-265c0 0 0-0.1 0-0.1l567.4 192.6c8.3-24.6 15.1-49.9 20.2-75.8L401 400.2c0 0 0-0.1 0-0.1L998.7 439.2z\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    {
        id: "fade_panels",
        name: "Fade Panels",
        backgroundColor: "#FD9",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 80 80\'%3E%3Crect fill=\'%23444\' width=\'10\' height=\'80\'/%3E%3Crect fill=\'%23444\' x=\'10\' width=\'10\' height=\'80\'/%3E%3Crect fill=\'%23444\' x=\'20\' width=\'10\' height=\'80\'/%3E%3Crect fill=\'%23444\' x=\'30\' width=\'10\' height=\'80\'/%3E%3Crect fill=\'%23444\' x=\'40\' width=\'10\' height=\'80\'/%3E%3Crect fill=\'%23444\' x=\'50\' width=\'10\' height=\'80\'/%3E%3Crect fill=\'%23444\' x=\'60\' width=\'10\' height=\'80\'/%3E%3Crect fill=\'%23444\' x=\'70\' width=\'10\' height=\'80\'/%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    {
        id: "subtle_prism",
        name: "Subtle Prism",
        backgroundColor: "#FFF",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' gradientUnits=\'userSpaceOnUse\' x1=\'0\' x2=\'0\' y1=\'0\' y2=\'100%25\' gradientTransform=\'rotate(240)\'%3E%3Cstop offset=\'0\' stop-color=\'%23FFF\'/%3E%3Cstop offset=\'1\' stop-color=\'%234FE\'/%3E%3C/linearGradient%3E%3Cpattern patternUnits=\'userSpaceOnUse\' id=\'b\' width=\'540\' height=\'450\' x=\'0\' y=\'0\' viewBox=\'0 0 1080 900\'%3E%3Cg fill-opacity=\'0.1\'%3E%3Cpolygon fill=\'%23444\' points=\'90 150 0 300 180 300\'/%3E%3Cpolygon points=\'90 150 180 0 0 0\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'270 150 360 0 180 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'450 150 360 300 540 300\'/%3E%3Cpolygon fill=\'%23999\' points=\'450 150 540 0 360 0\'/%3E%3Cpolygon points=\'630 150 540 300 720 300\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'630 150 720 0 540 0\'/%3E%3Cpolygon fill=\'%23444\' points=\'810 150 720 300 900 300\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'810 150 900 0 720 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'990 150 900 300 1080 300\'/%3E%3Cpolygon fill=\'%23444\' points=\'990 150 1080 0 900 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'90 450 0 600 180 600\'/%3E%3Cpolygon points=\'90 450 180 300 0 300\'/%3E%3Cpolygon fill=\'%23666\' points=\'270 450 180 600 360 600\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'270 450 360 300 180 300\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'450 450 360 600 540 600\'/%3E%3Cpolygon fill=\'%23999\' points=\'450 450 540 300 360 300\'/%3E%3Cpolygon fill=\'%23999\' points=\'630 450 540 600 720 600\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'630 450 720 300 540 300\'/%3E%3Cpolygon points=\'810 450 720 600 900 600\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'810 450 900 300 720 300\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'990 450 900 600 1080 600\'/%3E%3Cpolygon fill=\'%23444\' points=\'990 450 1080 300 900 300\'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x=\'0\' y=\'0\' fill=\'url(%23a)\' width=\'100%25\' height=\'100%25\'/%3E%3Crect x=\'0\' y=\'0\' fill=\'url(%23b)\' width=\'100%25\' height=\'100%25\'/%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
    },
    {
        id: "bullseye_gradient",
        name: "Bullseye Gradient",
        backgroundColor: "#000",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 800 800\'%3E%3Cg fill-opacity=\'1\'%3E%3Ccircle fill=\'%23000\' cx=\'400\' cy=\'400\' r=\'600\'/%3E%3Ccircle fill=\'%23110617\' fill-opacity=\'0.2\' cx=\'400\' cy=\'400\' r=\'500\'/%3E%3Ccircle fill=\'%23220d2f\' fill-opacity=\'0.5\' cx=\'400\' cy=\'400\' r=\'400\'/%3E%3Ccircle fill=\'%23331447\' fill-opacity=\'0.5\' cx=\'400\' cy=\'400\' r=\'300\'/%3E%3Ccircle fill=\'%23441b5f\' fill-opacity=\'0.5\' cx=\'400\' cy=\'400\' r=\'200\'/%3E%3Ccircle fill=\'%23552277\' cx=\'400\' cy=\'400\' r=\'100\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    {
        id: "hollowed_boxes",
        name: "Hollowed Boxes",
        backgroundColor: "#487346",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Cg fill-opacity=\'1\'%3E%3Cpolygon fill=\'%23527a4a\' points=\'100 57.1 64 93.1 71.5 100.6 100 72.1\'/%3E%3Cpolygon fill=\'%236da363\' points=\'100 57.1 100 72.1 128.6 100.6 136.1 93.1\'/%3E%3Cpolygon fill=\'%23527a4a\' points=\'100 163.2 100 178.2 170.7 107.5 170.8 92.4\'/%3E%3Cpolygon fill=\'%236da363\' points=\'100 163.2 29.2 92.5 29.2 107.5 100 178.2\'/%3E%3Cpath fill=\'%2389CC7C\' d=\'M100 21.8L29.2 92.5l70.7 70.7l70.7-70.7L100 21.8z M100 127.9L64.6 92.5L100 57.1l35.4 35.4L100 127.9z\'/%3E%3Cpolygon fill=\'%236d7a46\' points=\'0 157.1 0 172.1 28.6 200.6 36.1 193.1\'/%3E%3Cpolygon fill=\'%2391a35e\' points=\'70.7 200 70.8 192.4 63.2 200\'/%3E%3Cpolygon fill=\'%23B6CC76\' points=\'27.8 200 63.2 200 70.7 192.5 0 121.8 0 157.2 35.3 192.5\'/%3E%3Cpolygon fill=\'%2391a35e\' points=\'200 157.1 164 193.1 171.5 200.6 200 172.1\'/%3E%3Cpolygon fill=\'%236d7a46\' points=\'136.7 200 129.2 192.5 129.2 200\'/%3E%3Cpolygon fill=\'%23B6CC76\' points=\'172.1 200 164.6 192.5 200 157.1 200 157.2 200 121.8 200 121.8 129.2 192.5 136.7 200\'/%3E%3Cpolygon fill=\'%236d7a46\' points=\'129.2 0 129.2 7.5 200 78.2 200 63.2 136.7 0\'/%3E%3Cpolygon fill=\'%23B6CC76\' points=\'200 27.8 200 27.9 172.1 0 136.7 0 200 63.2 200 63.2\'/%3E%3Cpolygon fill=\'%2391a35e\' points=\'63.2 0 0 63.2 0 78.2 70.7 7.5 70.7 0\'/%3E%3Cpolygon fill=\'%23B6CC76\' points=\'0 63.2 63.2 0 27.8 0 0 27.8\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
    },
    {
        id: "rose_petals",
        name: "Rose Petals",
        backgroundColor: "#300",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 800 400\'%3E%3Cdefs%3E%3CradialGradient id=\'a\' cx=\'396\' cy=\'281\' r=\'514\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%23D18\'/%3E%3Cstop offset=\'1\' stop-color=\'%23300\'/%3E%3C/radialGradient%3E%3ClinearGradient id=\'b\' gradientUnits=\'userSpaceOnUse\' x1=\'400\' y1=\'148\' x2=\'400\' y2=\'333\'%3E%3Cstop offset=\'0\' stop-color=\'%23FA3\' stop-opacity=\'0\'/%3E%3Cstop offset=\'1\' stop-color=\'%23FA3\' stop-opacity=\'0.5\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=\'url(%23a)\' width=\'800\' height=\'400\'/%3E%3Cg fill-opacity=\'0.4\'%3E%3Ccircle fill=\'url(%23b)\' cx=\'267.5\' cy=\'61\' r=\'300\'/%3E%3Ccircle fill=\'url(%23b)\' cx=\'532.5\' cy=\'61\' r=\'300\'/%3E%3Ccircle fill=\'url(%23b)\' cx=\'400\' cy=\'30\' r=\'300\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
    },
    {
        id: "slanted_gradient",
        name: "Slanted Gradient",
        backgroundColor: "#000",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1600 800\'%3E%3Cg fill-opacity=\'1\'%3E%3Cpolygon fill=\'%23200\' points=\'1600 160 0 460 0 350 1600 50\'/%3E%3Cpolygon fill=\'%23400\' points=\'1600 260 0 560 0 450 1600 150\'/%3E%3Cpolygon fill=\'%23600\' points=\'1600 360 0 660 0 550 1600 250\'/%3E%3Cpolygon fill=\'%23800\' points=\'1600 460 0 760 0 650 1600 350\'/%3E%3Cpolygon fill=\'%23A00\' points=\'1600 800 0 800 0 750 1600 450\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
    },
    {
        id: "confetti_doodles",
        name: "Confetti Doodles",
        backgroundColor: "#A33",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1600\' height=\'800\' viewBox=\'0 0 1600 800\'%3E%3Cpath fill=\'%23FF7\' d=\'M1102.5 734.8c2.5-1.2 24.8-8.6 25.6-7.5.5.7-3.9 23.8-4.6 24.5C1123.3 752.1 1107.5 739.5 1102.5 734.8zM1226.3 229.1c0-.1-4.9-9.4-7-14.2-.1-.3-.3-1.1-.4-1.6-.1-.4-.3-.7-.6-.9-.3-.2-.6-.1-.8.1l-13.1 12.3c0 0 0 0 0 0-.2.2-.3.5-.4.8 0 .3 0 .7.2 1 .1.1 1.4 2.5 2.1 3.6 2.4 3.7 6.5 12.1 6.5 12.2.2.3.4.5.7.6.3 0 .5-.1.7-.3 0 0 1.8-2.5 2.7-3.6 1.5-1.6 3-3.2 4.6-4.7 1.2-1.2 1.6-1.4 2.1-1.6.5-.3 1.1-.5 2.5-1.9C1226.5 230.4 1226.6 229.6 1226.3 229.1zM33 770.3C33 770.3 33 770.3 33 770.3c0-.7-.5-1.2-1.2-1.2-.1 0-.3 0-.4.1-1.6.2-14.3.1-22.2 0-.3 0-.6.1-.9.4-.2.2-.4.5-.4.9 0 .2 0 4.9.1 5.9l.4 13.6c0 .3.2.6.4.9.2.2.5.3.8.3 0 0 .1 0 .1 0 7.3-.7 14.7-.9 22-.6.3 0 .7-.1.9-.3.2-.2.4-.6.4-.9C32.9 783.3 32.9 776.2 33 770.3z\'/%3E%3Cpath fill=\'%235ff\' d=\'M171.1 383.4c1.3-2.5 14.3-22 15.6-21.6.8.3 11.5 21.2 11.5 22.1C198.1 384.2 177.9 384 171.1 383.4zM596.4 711.8c-.1-.1-6.7-8.2-9.7-12.5-.2-.3-.5-1-.7-1.5-.2-.4-.4-.7-.7-.8-.3-.1-.6 0-.8.3L574 712c0 0 0 0 0 0-.2.2-.2.5-.2.9 0 .3.2.7.4.9.1.1 1.8 2.2 2.8 3.1 3.1 3.1 8.8 10.5 8.9 10.6.2.3.5.4.8.4.3 0 .5-.2.6-.5 0 0 1.2-2.8 2-4.1 1.1-1.9 2.3-3.7 3.5-5.5.9-1.4 1.3-1.7 1.7-2 .5-.4 1-.7 2.1-2.4C596.9 713.1 596.8 712.3 596.4 711.8zM727.5 179.9C727.5 179.9 727.5 179.9 727.5 179.9c.6.2 1.3-.2 1.4-.8 0-.1 0-.2 0-.4.2-1.4 2.8-12.6 4.5-19.5.1-.3 0-.6-.2-.8-.2-.3-.5-.4-.8-.5-.2 0-4.7-1.1-5.7-1.3l-13.4-2.7c-.3-.1-.7 0-.9.2-.2.2-.4.4-.5.6 0 0 0 .1 0 .1-.8 6.5-2.2 13.1-3.9 19.4-.1.3 0 .6.2.9.2.3.5.4.8.5C714.8 176.9 721.7 178.5 727.5 179.9zM728.5 178.1c-.1-.1-.2-.2-.4-.2C728.3 177.9 728.4 178 728.5 178.1z\'/%3E%3Cg fill-opacity=\'1\' fill=\'%23FFF\'%3E%3Cpath d=\'M699.6 472.7c-1.5 0-2.8-.8-3.5-2.3-.8-1.9 0-4.2 1.9-5 3.7-1.6 6.8-4.7 8.4-8.5 1.6-3.8 1.7-8.1.2-11.9-.3-.9-.8-1.8-1.2-2.8-.8-1.7-1.8-3.7-2.3-5.9-.9-4.1-.2-8.6 2-12.8 1.7-3.1 4.1-6.1 7.6-9.1 1.6-1.4 4-1.2 5.3.4 1.4 1.6 1.2 4-.4 5.3-2.8 2.5-4.7 4.7-5.9 7-1.4 2.6-1.9 5.3-1.3 7.6.3 1.4 1 2.8 1.7 4.3.5 1.1 1 2.2 1.5 3.3 2.1 5.6 2 12-.3 17.6-2.3 5.5-6.8 10.1-12.3 12.5C700.6 472.6 700.1 472.7 699.6 472.7z\'/%3E%3Ccircle cx=\'1013.7\' cy=\'153.9\' r=\'7.1\'/%3E%3Ccircle cx=\'1024.3\' cy=\'132.1\' r=\'7.1\'/%3E%3Ccircle cx=\'1037.3\' cy=\'148.9\' r=\'7.1\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
    },
    {
        id: "protruding_squares",
        name: "Protruding Squares",
        backgroundColor: "#E52",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 200 200\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' gradientUnits=\'userSpaceOnUse\' x1=\'100\' y1=\'33\' x2=\'100\' y2=\'-3\'%3E%3Cstop offset=\'0\' stop-color=\'%23000\' stop-opacity=\'0\'/%3E%3Cstop offset=\'1\' stop-color=\'%23000\' stop-opacity=\'1\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'b\' gradientUnits=\'userSpaceOnUse\' x1=\'100\' y1=\'135\' x2=\'100\' y2=\'97\'%3E%3Cstop offset=\'0\' stop-color=\'%23000\' stop-opacity=\'0\'/%3E%3Cstop offset=\'1\' stop-color=\'%23000\' stop-opacity=\'1\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill=\'%23E52\'%3E%3Crect width=\'200\' height=\'200\'%3E%3C/rect%3E%3C/g%3E%3Cg fill=\'%23be441b\' fill-opacity=\'0.6\'%3E%3Crect x=\'100\' width=\'100\' height=\'100\'/%3E%3Crect y=\'100\' width=\'100\' height=\'100\'/%3E%3C/g%3E%3Cg fill-opacity=\'0.5\'%3E%3Cpolygon fill=\'url(%23a)\' points=\'100 30 0 0 200 0\'/%3E%3Cpolygon fill=\'url(%23b)\' points=\'100 100 0 130 0 100 200 100 200 130\'/%3E%3C/g%3E%3C/svg%3E")',
    },
    {
        id: "geometric_intersection",
        name: "Geometric Intersection",
        backgroundColor: "#FF9",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1000 1000\'%3E%3Cg fill=\'%23ffd472\'%3E%3Cpolygon points=\'1000 -50 0 -50 500 450\'/%3E%3Cpolygon points=\'550 500 1050 1000 1050 0\'/%3E%3Cpolygon points=\'-50 0 -50 1000 450 500\'/%3E%3Cpolygon points=\'0 1050 1000 1050 500 550\'/%3E%3C/g%3E%3Cg fill=\'%23ffaa4c\'%3E%3Cpolygon points=\'1000 -133.3 0 -133.3 500 366.7\'/%3E%3Cpolygon points=\'633.3 500 1133.3 1000 1133.3 0\'/%3E%3Cpolygon points=\'-133.3 0 -133.3 1000 366.7 500\'/%3E%3Cpolygon points=\'0 1133.3 1000 1133.3 500 633.3\'/%3E%3C/g%3E%3Cg fill=\'%23ff7f26\'%3E%3Cpolygon points=\'1000 -216.7 0 -216.7 500 283.3\'/%3E%3Cpolygon points=\'716.7 500 1216.7 1000 1216.7 0\'/%3E%3Cpolygon points=\'-216.7 0 -216.7 1000 283.3 500\'/%3E%3Cpolygon points=\'0 1216.7 1000 1216.7 500 716.7\'/%3E%3C/g%3E%3Cg fill=\'%23F50\'%3E%3Cpolygon points=\'1000 -300 0 -300 500 200\'/%3E%3Cpolygon points=\'800 500 1300 1000 1300 0\'/%3E%3Cpolygon points=\'-300 0 -300 1000 200 500\'/%3E%3Cpolygon points=\'0 1300 1000 1300 500 800\'/%3E%3C/g%3E%3Cg fill-opacity=\'0.5\'%3E%3Cpolygon fill=\'%23FE0\' points=\'0 707.1 0 292.9 292.9 0 707.1 0 1000 292.9 1000 707.1 707.1 1000 292.9 1000\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
    },
    {
        id: "dragon_scales",
        name: "Dragon Scales",
        backgroundColor: "#305",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 1000\'%3E%3Cg fill-opacity=\'1\'%3E%3Ccircle fill=\'%23305\' cx=\'50\' cy=\'0\' r=\'50\'/%3E%3Cg fill=\'%233b005d\'%3E%3Ccircle cx=\'0\' cy=\'50\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'50\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%23406\' cx=\'50\' cy=\'100\' r=\'50\'/%3E%3Cg fill=\'%234c006e\'%3E%3Ccircle cx=\'0\' cy=\'150\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'150\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%23507\' cx=\'50\' cy=\'200\' r=\'50\'/%3E%3Cg fill=\'%235d007f\'%3E%3Ccircle cx=\'0\' cy=\'250\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'250\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%23608\' cx=\'50\' cy=\'300\' r=\'50\'/%3E%3Cg fill=\'%236e0090\'%3E%3Ccircle cx=\'0\' cy=\'350\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'350\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%23709\' cx=\'50\' cy=\'400\' r=\'50\'/%3E%3Cg fill=\'%237f00a1\'%3E%3Ccircle cx=\'0\' cy=\'450\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'450\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%2380A\' cx=\'50\' cy=\'500\' r=\'50\'/%3E%3Cg fill=\'%239000b2\'%3E%3Ccircle cx=\'0\' cy=\'550\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'550\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%2390B\' cx=\'50\' cy=\'600\' r=\'50\'/%3E%3Cg fill=\'%23a100c3\'%3E%3Ccircle cx=\'0\' cy=\'650\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'650\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%23A0C\' cx=\'50\' cy=\'700\' r=\'50\'/%3E%3Cg fill=\'%23b200d4\'%3E%3Ccircle cx=\'0\' cy=\'750\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'750\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%23B0D\' cx=\'50\' cy=\'800\' r=\'50\'/%3E%3Cg fill=\'%23c300e5\'%3E%3Ccircle cx=\'0\' cy=\'850\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'850\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%23C0E\' cx=\'50\' cy=\'900\' r=\'50\'/%3E%3Cg fill=\'%23d400f6\'%3E%3Ccircle cx=\'0\' cy=\'950\' r=\'50\'/%3E%3Ccircle cx=\'100\' cy=\'950\' r=\'50\'/%3E%3C/g%3E%3Ccircle fill=\'%23D0F\' cx=\'50\' cy=\'1000\' r=\'50\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "contain",
        backgroundPosition: "center",
    },
    {
        id: "quantum_gradient",
        name: "Quantum Gradient",
        backgroundColor: "#F00",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1200 800\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' gradientUnits=\'userSpaceOnUse\' x1=\'600\' y1=\'25\' x2=\'600\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23F00\'/%3E%3Cstop offset=\'1\' stop-color=\'%23E0F\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'b\' gradientUnits=\'userSpaceOnUse\' x1=\'650\' y1=\'25\' x2=\'650\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23fd0017\'/%3E%3Cstop offset=\'1\' stop-color=\'%23d800f2\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'c\' gradientUnits=\'userSpaceOnUse\' x1=\'700\' y1=\'25\' x2=\'700\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23fb002e\'/%3E%3Cstop offset=\'1\' stop-color=\'%23c200e6\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'d\' gradientUnits=\'userSpaceOnUse\' x1=\'750\' y1=\'25\' x2=\'750\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23fa0045\'/%3E%3Cstop offset=\'1\' stop-color=\'%23ad00d9\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'e\' gradientUnits=\'userSpaceOnUse\' x1=\'800\' y1=\'25\' x2=\'800\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23f8005c\'/%3E%3Cstop offset=\'1\' stop-color=\'%239700cd\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'f\' gradientUnits=\'userSpaceOnUse\' x1=\'850\' y1=\'25\' x2=\'850\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23f70073\'/%3E%3Cstop offset=\'1\' stop-color=\'%238100c1\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'g\' gradientUnits=\'userSpaceOnUse\' x1=\'900\' y1=\'25\' x2=\'900\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23f5008b\'/%3E%3Cstop offset=\'1\' stop-color=\'%236c00b4\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'h\' gradientUnits=\'userSpaceOnUse\' x1=\'950\' y1=\'25\' x2=\'950\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23f400a2\'/%3E%3Cstop offset=\'1\' stop-color=\'%235600a8\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'i\' gradientUnits=\'userSpaceOnUse\' x1=\'1000\' y1=\'25\' x2=\'1000\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23f200b9\'/%3E%3Cstop offset=\'1\' stop-color=\'%2340009c\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'j\' gradientUnits=\'userSpaceOnUse\' x1=\'1050\' y1=\'25\' x2=\'1050\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23f100d0\'/%3E%3Cstop offset=\'1\' stop-color=\'%232b008f\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'k\' gradientUnits=\'userSpaceOnUse\' x1=\'1100\' y1=\'25\' x2=\'1100\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23ef00e7\'/%3E%3Cstop offset=\'1\' stop-color=\'%23150083\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'l\' gradientUnits=\'userSpaceOnUse\' x1=\'1150\' y1=\'25\' x2=\'1150\' y2=\'777\'%3E%3Cstop offset=\'0\' stop-color=\'%23E0F\'/%3E%3Cstop offset=\'1\' stop-color=\'%23007\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill-opacity=\'1\'%3E%3Crect fill=\'url(%23a)\' width=\'1200\' height=\'800\'/%3E%3Crect fill=\'url(%23b)\' x=\'100\' width=\'1100\' height=\'800\'/%3E%3Crect fill=\'url(%23c)\' x=\'200\' width=\'1000\' height=\'800\'/%3E%3Crect fill=\'url(%23d)\' x=\'300\' width=\'900\' height=\'800\'/%3E%3Crect fill=\'url(%23e)\' x=\'400\' width=\'800\' height=\'800\'/%3E%3Crect fill=\'url(%23f)\' x=\'500\' width=\'700\' height=\'800\'/%3E%3Crect fill=\'url(%23g)\' x=\'600\' width=\'600\' height=\'800\'/%3E%3Crect fill=\'url(%23h)\' x=\'700\' width=\'500\' height=\'800\'/%3E%3Crect fill=\'url(%23i)\' x=\'800\' width=\'400\' height=\'800\'/%3E%3Crect fill=\'url(%23j)\' x=\'900\' width=\'300\' height=\'800\'/%3E%3Crect fill=\'url(%23k)\' x=\'1000\' width=\'200\' height=\'800\'/%3E%3Crect fill=\'url(%23l)\' x=\'1100\' width=\'100\' height=\'800\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    {
        id: "spectrum_gradient",
        name: "Spectrum Gradient",
        backgroundColor: "#FF0",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1200 800\'%3E%3Cdefs%3E%3CradialGradient id=\'a\' cx=\'0\' cy=\'800\' r=\'800\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%23FF8400\'/%3E%3Cstop offset=\'1\' stop-color=\'%23FF8400\' stop-opacity=\'0\'/%3E%3C/radialGradient%3E%3CradialGradient id=\'b\' cx=\'1200\' cy=\'800\' r=\'800\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%2300FF00\'/%3E%3Cstop offset=\'1\' stop-color=\'%2300FF00\' stop-opacity=\'0\'/%3E%3C/radialGradient%3E%3CradialGradient id=\'c\' cx=\'600\' cy=\'0\' r=\'600\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%23FF00FF\'/%3E%3Cstop offset=\'1\' stop-color=\'%23FF00FF\' stop-opacity=\'0\'/%3E%3C/radialGradient%3E%3CradialGradient id=\'d\' cx=\'600\' cy=\'800\' r=\'600\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%23FFFF00\'/%3E%3Cstop offset=\'1\' stop-color=\'%23FFFF00\' stop-opacity=\'0\'/%3E%3C/radialGradient%3E%3CradialGradient id=\'e\' cx=\'0\' cy=\'0\' r=\'800\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%23FF0000\'/%3E%3Cstop offset=\'1\' stop-color=\'%23FF0000\' stop-opacity=\'0\'/%3E%3C/radialGradient%3E%3CradialGradient id=\'f\' cx=\'1200\' cy=\'0\' r=\'800\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%230CF\'/%3E%3Cstop offset=\'1\' stop-color=\'%230CF\' stop-opacity=\'0\'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill=\'url(%23a)\' width=\'1200\' height=\'800\'/%3E%3Crect fill=\'url(%23b)\' width=\'1200\' height=\'800\'/%3E%3Crect fill=\'url(%23c)\' width=\'1200\' height=\'800\'/%3E%3Crect fill=\'url(%23d)\' width=\'1200\' height=\'800\'/%3E%3Crect fill=\'url(%23e)\' width=\'1200\' height=\'800\'/%3E%3Crect fill=\'url(%23f)\' width=\'1200\' height=\'800\'/%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    {
        id: "cornered_stairs",
        name: "Cornered Stairs",
        backgroundColor: "#000",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1600 800\'%3E%3Cg fill-opacity=\'1\'%3E%3Cpolygon fill=\'%23222\' points=\'800 100 0 200 0 800 1600 800 1600 200\'/%3E%3Cpolygon fill=\'%23444\' points=\'800 200 0 400 0 800 1600 800 1600 400\'/%3E%3Cpolygon fill=\'%23666\' points=\'800 300 0 600 0 800 1600 800 1600 600\'/%3E%3Cpolygon fill=\'%23888\' points=\'1600 800 800 400 0 800\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'1280 800 800 500 320 800\'/%3E%3Cpolygon fill=\'%23CCC\' points=\'533.3 800 1066.7 800 800 600\'/%3E%3Cpolygon fill=\'%23EEE\' points=\'684.1 800 914.3 800 800 700\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
    },
    {
        id: "liquid_cheese",
        name: "Liquid Cheese",
        backgroundColor: "#FA0",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1600 800\'%3E%3Cg fill-opacity=\'1\'%3E%3Cpath fill=\'%23ffb100\' d=\'M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z\'/%3E%3Cpath fill=\'%23ffb800\' d=\'M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z\'/%3E%3Cpath fill=\'%23ffbe00\' d=\'M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z\'/%3E%3Cpath fill=\'%23ffc500\' d=\'M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z\'/%3E%3Cpath fill=\'%23ffcc00\' d=\'M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z\'/%3E%3Cpath fill=\'%23ffd722\' d=\'M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z\'/%3E%3Cpath fill=\'%23ffe135\' d=\'M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z\'/%3E%3Cpath fill=\'%23ffeb46\' d=\'M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z\'/%3E%3Cpath fill=\'%23fff556\' d=\'M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z\'/%3E%3Cpath fill=\'%23ffff66\' d=\'M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
    },
    {
        id: "wave_pattern",
        name: "Wave Pattern",
        backgroundColor: "#003153",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'18\' viewBox=\'0 0 100 18\'%3E%3Cpath fill=\'%239C92AC\' fill-opacity=\'0.4\' d=\'M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S searching34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z\'%3E%3C/path%3E%3C/svg%3E")',
    },
    {
        id: "polka_dots",
        name: "Polka Dots",
        backgroundColor: "#e5e5f7",
        backgroundImage:
            "radial-gradient(#444 0.5px, #e5e5f7 0.5px)",
        backgroundSize: "10px 10px",
    },
    {
        id: "zigzag",
        name: "Zigzag",
        backgroundColor: "#e5e5f7",
        backgroundImage:
            'linear-gradient(135deg, #444 25%, transparent 25%), linear-gradient(225deg, #444 25%, transparent 25%), linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(315deg, #444 25%, #e5e5f7 25%)',
        backgroundSize: "20px 20px",
        backgroundPosition: "10px 0, 10px 0, 0 0, 0 0",
    },
    {
        id: "carbon_fiber",
        name: "Carbon Fiber",
        backgroundColor: "#282828",
        backgroundImage:
            'linear-gradient(27deg, #151515 5px, transparent 5px), linear-gradient(207deg, #151515 5px, transparent 5px), linear-gradient(27deg, #222 5px, transparent 5px), linear-gradient(207deg, #222 5px, transparent 5px), linear-gradient(90deg, #1b1b1b 10px, transparent 10px), linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424)',
        backgroundSize: "30px 30px",
        backgroundPosition: "0 5px, 10px 5px, 0 0, 10px 0, 15px 0, 0 0",
    },
    {
        id: "honeycomb",
        name: "Honeycomb",
        backgroundColor: "#f5a623",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'56\' height=\'100\' viewBox=\'0 0 56 100\'%3E%3Cpath fill=\'%23f9d423\' fill-opacity=\'0.4\' d=\'M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100\'%3E%3C/path%3E%3Cpath fill=\'%23f5d547\' fill-opacity=\'0.4\' d=\'M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34\'%3E%3C/path%3E%3C/svg%3E")',
    },
    {
        id: "japanese_waves",
        name: "Japanese Waves",
        backgroundColor: "#1a1a2e",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'none\' stroke=\'%2316213e\' stroke-width=\'2\' stroke-opacity=\'0.5\' d=\'M0 50 Q 25 0 50 50 T 100 50\'%3E%3C/path%3E%3Cpath fill=\'none\' stroke=\'%230f3460\' stroke-width=\'2\' stroke-opacity=\'0.5\' d=\'M0 60 Q 25 10 50 60 T 100 60\'%3E%3C/path%3E%3Cpath fill=\'none\' stroke=\'%23e94560\' stroke-width=\'2\' stroke-opacity=\'0.3\' d=\'M0 70 Q 25 20 50 70 T 100 70\'%3E%3C/path%3E%3C/svg%3E")',
    },
    {
        id: "moroccan_tile",
        name: "Moroccan Tile",
        backgroundColor: "#0c3547",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'26\' viewBox=\'0 0 32 26\'%3E%3Cpath fill=\'%2313547a\' fill-opacity=\'0.4\' d=\'M14 0v3.994C14 7.864 10.858 11 7 11c-3.866 0-7-3.138-7-7.006V0h2v4.005C2 6.765 4.24 9 7 9c2.756 0 5-2.236 5-4.995V0h2zm0 26v-5.994C14 16.138 10.866 13 7 13c-3.858 0-7 3.137-7 6.006V26h2v-6.994C2 16.235 4.244 14 7 14c2.76 0 5 2.236 5 5.006V26h2zm2-18.994C16 3.136 19.142 0 23 0c3.866 0 7 3.138 7 7.006v9.988C30 20.864 26.858 24 23 24c-3.866 0-7-3.138-7-7.006V7.006zm2-.01C18 4.235 20.244 2 23 2c2.76 0 5 2.236 5 4.995v10.01C28 19.765 25.756 22 23 22c-2.76 0-5-2.236-5-4.995V6.995z\'%3E%3C/path%3E%3C/svg%3E")',
    },
];

/**
 * Get a legacy background by ID
 */
export const getLegacyBackgroundById = (id: string): LegacyBackground | undefined => {
    return LEGACY_BACKGROUNDS.find(bg => bg.id === id);
};

/**
 * Generate CSS styles for a legacy background
 */
export const getLegacyBackgroundStyles = (background: LegacyBackground): React.CSSProperties => {
    const styles: React.CSSProperties = {
        backgroundColor: background.backgroundColor,
    };

    if (background.background) {
        styles.background = background.background;
    }

    if (background.backgroundImage) {
        styles.backgroundImage = background.backgroundImage;
    }

    if (background.backgroundAttachment) {
        styles.backgroundAttachment = background.backgroundAttachment as 'fixed' | 'scroll' | 'local';
    }

    if (background.backgroundSize) {
        styles.backgroundSize = background.backgroundSize;
    }

    if (background.backgroundPosition) {
        styles.backgroundPosition = background.backgroundPosition;
    }

    return styles;
};

