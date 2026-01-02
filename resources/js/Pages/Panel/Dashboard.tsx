import {
    DashboardStats,
    DashboardTab,
} from "@/Components/Panel/Dashboard/DashboardTab";
import { LinkBar } from "@/Components/Panel/Links/LinkBar";
import { LinksTab, SocialLink } from "@/Components/Panel/Links/LinksTab";
import {
    AutoSaveBadge,
    ManualSaveButton,
} from "@/Components/Shared/AutoSaveSettings";
import { DeviceMode, PhonePreview } from "@/Components/Shared/PhonePreview";
import { useWhatsNewModal } from "@/Components/Shared/WhatsNewModal";
import { INITIAL_LINKS } from "@/constants";
import { useAutoSaveContext } from "@/contexts/AutoSaveContext";
import PanelLayout from "@/Layouts/PanelLayout";
import {
    BackgroundAttachment,
    BackgroundPosition,
    BackgroundRepeat,
    BackgroundSize,
    ButtonIconAlignment,
    ButtonShape,
    ButtonSize,
    ButtonStyle,
    FontPair,
    LinkBlock,
    UserProfile,
} from "@/types";
import { Head } from "@inertiajs/react";
import { Eye, Maximize2 } from "lucide-react";
import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

// Lazy load secondary tabs and modals for better initial load performance
const DesignTab = lazy(() =>
    import("@/Components/Panel/Design/DesignTab").then((m) => ({
        default: m.DesignTab,
    }))
);
const SettingsTab = lazy(() =>
    import("@/Components/Panel/Settings/SettingsTab").then((m) => ({
        default: m.SettingsTab,
    }))
);
const ProfileTab = lazy(() =>
    import("@/Components/Panel/Profile/ProfileTab").then((m) => ({
        default: m.ProfileTab,
    }))
);
const DevicePreviewModal = lazy(() =>
    import("@/Components/Shared/DevicePreviewModal").then((m) => ({
        default: m.DevicePreviewModal,
    }))
);
const WhatsNewModal = lazy(() =>
    import("@/Components/Shared/WhatsNewModal").then((m) => ({
        default: m.WhatsNewModal,
    }))
);

/**
 * Landing data from PanelLandingResource.
 * Already transformed to frontend format.
 */
interface PanelLandingData {
    id: string;
    name: string;
    slug: string;
    domain_name: string | null;
    verify: boolean;
    mongo_id?: string;
    logo: { image: string | null; thumb: string | null };
    template_config: {
        title: string;
        subtitle: string;
        showTitle: boolean;
        showSubtitle: boolean;
        background: {
            bgName: string;
            backgroundColor: string;
            backgroundImage: string | null;
            backgroundEnabled: boolean;
            backgroundSize: BackgroundSize;
            backgroundPosition: BackgroundPosition;
            backgroundAttachment: BackgroundAttachment;
            backgroundRepeat: BackgroundRepeat;
            props?: Record<string, string | number>;
            controls?: {
                hideBgColor?: boolean;
                colors?: string[];
                scale?: {
                    min: number;
                    max: number;
                    default: number;
                    aspectRatio?: boolean;
                };
                opacity?: { default: number };
                rotationBg?: { min: number; max: number; default: number };
            };
        };
        buttons: {
            style: ButtonStyle;
            shape: ButtonShape;
            size: ButtonSize;
            backgroundColor: string;
            textColor: string;
            borderColor: string | null;
            borderEnabled?: boolean;
            showIcons: boolean;
            iconAlignment: ButtonIconAlignment;
        };
        textColor: string | null;
        fontPair: FontPair;
        header: {
            roundedAvatar: boolean;
            avatarFloating: boolean;
        };
        showLinkSubtext: boolean;
        savedCustomThemes?: any[];
        lastCustomDesign?: any;
    };
    options: {
        meta: {
            title: string;
            description: string;
            image?: string | null;
        };
        analytics: {
            google_code: string;
            facebook_pixel: string;
        };
        is_private: boolean;
        bio?: string;
    };
    links: LinkBlock[];
    socialLinks: Array<{
        id: string;
        url: string;
        icon?: { type?: string; name?: string };
        isEnabled: boolean;
        clicks: number;
        sparklineData: { value: number }[];
    }>;
}

interface DashboardProps {
    landing: PanelLandingData | null;
    auth: {
        user: any;
    };
    activeTab?: string;
    dashboardStats?: DashboardStats | null;
}

// Loading fallback for lazy-loaded tabs
function TabLoadingFallback() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-brand-500" />
        </div>
    );
}

export default function Dashboard({
    landing,
    auth,
    activeTab: serverActiveTab = "dashboard",
    dashboardStats = null,
}: DashboardProps) {
    // Sync state with prop if needed, but primarily rely on prop for the "View"
    const activeTab = serverActiveTab;

    // Links come pre-transformed from PanelLandingResource
    const initialLinks: LinkBlock[] = landing?.links || INITIAL_LINKS;

    // Build UserProfile from pre-transformed landing data
    const tc = landing?.template_config;
    const bg = tc?.background;
    const buttons = tc?.buttons;
    const header = tc?.header;
    const opts = landing?.options;

    const initialUser: UserProfile = {
        name: landing?.name || "",
        handle: landing?.slug || landing?.domain_name || "",
        avatar:
            landing?.logo?.image ||
            auth.user.avatar ||
            "/images/logos/logo-icon.webp",
        avatarThumb:
            landing?.logo?.thumb || auth.user.avatar_thumb || undefined,
        title: tc?.title || landing?.slug || "",
        subtitle: tc?.subtitle || "",
        showTitle: tc?.showTitle ?? true,
        showSubtitle: tc?.showSubtitle ?? true,
        theme: bg?.bgName || "custom",
        customDesign: {
            // Background
            backgroundColor: bg?.backgroundColor || "#fed7aa",
            backgroundImage: bg?.backgroundImage || undefined,
            backgroundEnabled: bg?.backgroundEnabled ?? true,
            backgroundSize: bg?.backgroundSize || "cover",
            backgroundPosition: bg?.backgroundPosition || "center",
            backgroundRepeat: bg?.backgroundRepeat || "no-repeat",
            backgroundAttachment: bg?.backgroundAttachment || "scroll",
            backgroundProps: bg?.props || undefined,
            backgroundControls: bg?.controls || undefined,
            // Buttons
            buttonStyle: buttons?.style || "soft",
            buttonShape: buttons?.shape || "pill",
            buttonSize: buttons?.size || "compact",
            buttonColor: buttons?.backgroundColor || "#ea580c",
            buttonTextColor: buttons?.textColor || "#ffffff",
            buttonBorderColor: buttons?.borderColor || "#000000",
            buttonBorderEnabled: buttons?.borderEnabled ?? false,
            showButtonIcons: buttons?.showIcons ?? true,
            buttonIconAlignment: buttons?.iconAlignment || "left",
            showLinkSubtext: tc?.showLinkSubtext ?? true,
            // Typography
            fontPair: tc?.fontPair || "modern",
            textColor: tc?.textColor || "#1f2937",
            // Avatar
            roundedAvatar: header?.roundedAvatar ?? true,
            avatarFloating: header?.avatarFloating ?? true,
        },
        savedCustomThemes: tc?.savedCustomThemes || [],
        lastCustomDesign: tc?.lastCustomDesign || undefined,
        seoTitle: opts?.meta?.title || "",
        seoDescription: opts?.meta?.description || "",
        googleAnalyticsId: opts?.analytics?.google_code || "",
        facebookPixelId: opts?.analytics?.facebook_pixel || "",
        isPrivate: opts?.is_private || false,
        isVerified: landing?.verify || false,
        isLegacy: !!landing?.mongo_id,
    };

    // Social links come pre-transformed from PanelLandingResource
    const initialSocialLinks: SocialLink[] = (landing?.socialLinks || []).map(
        (link) => ({
            id: link.id,
            url: link.url || "",
            // Only include icon if it has required fields (name and type)
            icon:
                link.icon?.name && link.icon?.type
                    ? { name: link.icon.name, type: link.icon.type as any }
                    : undefined,
            active: link.isEnabled ?? true,
            clicks: link.clicks || 0,
            sparklineData:
                link.sparklineData ||
                Array(7)
                    .fill(0)
                    .map(() => ({ value: 0 })),
        })
    );

    // Get context for UI state persistence and save functionality
    const {
        uiState,
        setUiState,
        setLandingId,
        landingId: contextLandingId,
        setPendingChanges,
        saveAllChanges,
        autoSaveEnabled,
        setOnLandingUpdated,
    } = useAutoSaveContext();

    // Check if we should use context state (same landing, has data)
    const isSameLanding = contextLandingId === landing?.id;

    // Initialize state from context (if same landing) or from server
    const [links, setLinksInternal] = useState<LinkBlock[]>(() => {
        if (isSameLanding && uiState.links) {
            return uiState.links;
        }
        return initialLinks.length > 0 ? initialLinks : INITIAL_LINKS;
    });

    const [user, setUserInternal] = useState<UserProfile>(() => {
        if (isSameLanding && uiState.user) {
            return uiState.user;
        }
        return initialUser;
    });

    const [socialLinks, setSocialLinksInternal] = useState<SocialLink[]>(() => {
        if (isSameLanding && uiState.socialLinks) {
            return uiState.socialLinks;
        }
        return initialSocialLinks;
    });

    // Wrapper functions that update both local state and context UI state
    const setLinks = useCallback(
        (newLinks: LinkBlock[] | ((prev: LinkBlock[]) => LinkBlock[])) => {
            setLinksInternal((prev) => {
                const updated =
                    typeof newLinks === "function" ? newLinks(prev) : newLinks;
                setUiState("links", updated);
                return updated;
            });
        },
        [setUiState]
    );

    const setUser = useCallback(
        (newUser: UserProfile | ((prev: UserProfile) => UserProfile)) => {
            setUserInternal((prev) => {
                const updated =
                    typeof newUser === "function" ? newUser(prev) : newUser;
                setUiState("user", updated);
                return updated;
            });
        },
        [setUiState]
    );

    const setSocialLinks = useCallback(
        (newLinks: SocialLink[] | ((prev: SocialLink[]) => SocialLink[])) => {
            setSocialLinksInternal((prev) => {
                const updated =
                    typeof newLinks === "function" ? newLinks(prev) : newLinks;
                setUiState("socialLinks", updated);
                return updated;
            });
        },
        [setUiState]
    );

    const [currentLinkType, setCurrentLinkType] = useState<"blocks" | "social">(
        "blocks"
    );

    // Register callback to update user state when server returns processed data (e.g., S3 URLs)
    useEffect(() => {
        const callback = (updatedLandingData: any) => {
            setUser((prev) => {
                const updates: Partial<UserProfile> = {};

                // Update avatar if server returned new logo
                if (updatedLandingData.logo?.image) {
                    updates.avatar = updatedLandingData.logo.image;
                }
                if (updatedLandingData.logo?.thumb) {
                    updates.avatarThumb = updatedLandingData.logo.thumb;
                }

                // Update background image if server returned new URL
                if (
                    updatedLandingData.template_config?.background
                        ?.backgroundImage
                ) {
                    updates.customDesign = {
                        ...prev.customDesign,
                        backgroundImage:
                            updatedLandingData.template_config.background
                                .backgroundImage,
                    };
                }

                // Update other fields as needed
                if (updatedLandingData.name) {
                    updates.name = updatedLandingData.name;
                }
                if (updatedLandingData.options?.title) {
                    updates.title = updatedLandingData.options.title;
                }
                if (updatedLandingData.options?.subtitle) {
                    updates.subtitle = updatedLandingData.options.subtitle;
                }

                return { ...prev, ...updates };
            });
        };

        setOnLandingUpdated(() => callback);

        return () => {
            setOnLandingUpdated(null);
        };
    }, [setOnLandingUpdated, setUser]);

    // What's New modal for first-time visitors
    const whatsNewModal = useWhatsNewModal();

    // =================================================================
    // LANDING ID SYNC - Context handles reset when landing changes
    // =================================================================

    useEffect(() => {
        if (landing?.id) {
            // setLandingId internally resets all state when landing changes
            setLandingId(landing.id);
        }
    }, [landing?.id, setLandingId]);

    // Transform links to API format for saving
    // IMPORTANT: All block-specific config fields must be included here
    // See: .cursor/rules/block-development.mdc for full list
    const linksPayload = useMemo(
        () => ({
            links: links.map((link, index) => ({
                id: link.id,
                title: link.title,
                url: link.url,
                type: link.type,
                isEnabled: link.isEnabled,
                order: index,
                icon: link.icon,
                // Header
                headerSize: link.headerSize,
                // Video embeds (YouTube, Spotify, Vimeo, etc.)
                mediaDisplayMode: link.mediaDisplayMode,
                showInlinePlayer: link.showInlinePlayer,
                autoPlay: link.autoPlay,
                startMuted: link.startMuted,
                playerSize: link.playerSize,
                // WhatsApp
                phoneNumber: link.phoneNumber,
                predefinedMessage: link.predefinedMessage,
                // Calendar
                calendarProvider: link.calendarProvider,
                calendarDisplayMode: link.calendarDisplayMode,
                // Email
                emailAddress: link.emailAddress,
                emailSubject: link.emailSubject,
                emailBody: link.emailBody,
                // Map
                mapAddress: link.mapAddress,
                mapQuery: link.mapQuery,
                mapZoom: link.mapZoom,
                mapDisplayMode: link.mapDisplayMode,
                mapShowAddress: link.mapShowAddress,
            })),
        }),
        [links]
    );

    // Transform social links to API format
    const socialLinksPayload = useMemo(
        () => ({
            links: socialLinks.map((link, index) => ({
                id: link.id,
                title: "",
                url: link.url,
                type: "social",
                isEnabled: link.active,
                order: index,
                icon: link.icon,
            })),
        }),
        [socialLinks]
    );

    // Transform design/user data to API format
    const designPayload = useMemo(
        () => ({
            title: user.title,
            subtitle: user.subtitle,
            showTitle: user.showTitle,
            showSubtitle: user.showSubtitle,
            avatar: user.avatar,
            theme: user.theme,
            customDesign: {
                ...user.customDesign,
                roundedAvatar: user.customDesign.roundedAvatar ?? true,
                avatarFloating: user.customDesign.avatarFloating ?? true,
            },
            savedCustomThemes: user.savedCustomThemes,
            lastCustomDesign: user.lastCustomDesign,
        }),
        [
            user.title,
            user.subtitle,
            user.showTitle,
            user.showSubtitle,
            user.avatar,
            user.theme,
            user.customDesign,
            user.savedCustomThemes,
            user.lastCustomDesign,
        ]
    );

    // Transform settings data to API format
    const settingsPayload = useMemo(
        () => ({
            handle: user.handle,
            seoTitle: user.seoTitle,
            seoDescription: user.seoDescription,
            googleAnalyticsId: user.googleAnalyticsId,
            facebookPixelId: user.facebookPixelId,
            isPrivate: user.isPrivate,
        }),
        [
            user.handle,
            user.seoTitle,
            user.seoDescription,
            user.googleAnalyticsId,
            user.facebookPixelId,
            user.isPrivate,
        ]
    );

    // =================================================================
    // TRACK CHANGES - Always call setPendingChanges, context handles comparison
    // The context automatically captures initial state on first call per section
    // =================================================================

    // Track changes to links
    useEffect(() => {
        setPendingChanges("links", linksPayload);
    }, [linksPayload, setPendingChanges]);

    // Track changes to social links
    useEffect(() => {
        setPendingChanges("socialLinks", socialLinksPayload);
    }, [socialLinksPayload, setPendingChanges]);

    // Track changes to design (user appearance data)
    useEffect(() => {
        setPendingChanges("design", designPayload);
    }, [designPayload, setPendingChanges]);

    // Track changes to settings
    useEffect(() => {
        setPendingChanges("settings", settingsPayload);
    }, [settingsPayload, setPendingChanges]);

    // Auto-save with debounce when enabled
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (autoSaveEnabled) {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
            autoSaveTimeoutRef.current = setTimeout(() => {
                saveAllChanges();
            }, 1500);
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [
        linksPayload,
        socialLinksPayload,
        designPayload,
        settingsPayload,
        autoSaveEnabled,
        saveAllChanges,
    ]);

    // Manual save handler
    const handleManualSave = () => {
        saveAllChanges();
    };

    // Preview State
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [initialPreviewDevice, setInitialPreviewDevice] =
        useState<DeviceMode>("mobile");

    const handleUpdateUser = (updates: Partial<UserProfile>) => {
        setUser((prev) => ({ ...prev, ...updates }));
    };

    const openPreview = (device: DeviceMode = "mobile") => {
        setInitialPreviewDevice(device);
        setIsPreviewOpen(true);
    };

    return (
        <>
            <Head
                title={
                    activeTab === "links"
                        ? "Enlaces"
                        : activeTab === "appearance"
                        ? "Apariencia"
                        : activeTab === "settings"
                        ? "Ajustes"
                        : activeTab === "dashboard"
                        ? "Panel"
                        : activeTab
                }
            />

            {/* Added top padding for mobile to account for fixed MobileNav */}
            <div className="flex-1 w-full mx-auto p-4 md:p-8 lg:p-12 pt-32 md:pt-8 overflow-y-auto h-screen overlay-scrollbar relative">
                <div className=" max-w-5xl  mx-auto">
                    {/* Header - Hidden on Mobile to save space (MobileNav has context) */}
                    <header className="hidden md:flex justify-between items-end mb-8 sticky top-0 z-40 bg-slate-50/90 dark:bg-neutral-950/90 backdrop-blur-xl py-4 -mx-4 px-4 lg:-mx-12 lg:px-12 transition-all">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-bold text-neutral-400 mb-1 uppercase tracking-wider">
                                    <span>Panel</span>
                                    {activeTab !== "dashboard" && (
                                        <>
                                            <span className="text-neutral-300">
                                                &gt;
                                            </span>
                                            <span className="text-brand-500 capitalize">
                                                {activeTab}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight capitalize">
                                    {activeTab === "dashboard"
                                        ? "Mis enlaces"
                                        : activeTab}
                                </h1>
                            </div>
                            {/* Links Tab Switcher - Desktop */}
                            {activeTab === "links" && (
                                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                                    <button
                                        onClick={() =>
                                            setCurrentLinkType("blocks")
                                        }
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                            currentLinkType === "blocks"
                                                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                                                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                        }`}
                                    >
                                        BLOQUES
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentLinkType("social")
                                        }
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                            currentLinkType === "social"
                                                ? "bg-linear-to-r from-brand-500 to-pink-500 text-white shadow-md"
                                                : "bg-linear-to-r from-brand-100/60 to-pink-100/60 dark:from-brand-900/20 dark:to-pink-900/20 text-brand-600 dark:text-brand-400"
                                        }`}
                                    >
                                        REDES
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Auto-save status, preview button, and manual save - Hidden on profile tab */}
                        {activeTab !== "profile" && (
                            <div className="flex items-center gap-3">
                                <AutoSaveBadge />
                                {/* Preview button - visible when Live Preview sidebar is hidden */}
                                <button
                                    onClick={() => openPreview("mobile")}
                                    className="xl:hidden flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Eye size={16} />
                                    <span>Vista previa</span>
                                </button>
                                <ManualSaveButton onClick={handleManualSave} />
                            </div>
                        )}
                    </header>

                    {/* Mobile Title */}
                    <div className="md:hidden mb-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white capitalize">
                                {activeTab === "dashboard"
                                    ? "Resumen"
                                    : activeTab === "profile"
                                    ? "Perfil"
                                    : activeTab}
                            </h1>
                            {activeTab !== "profile" && (
                                <button
                                    onClick={() => openPreview("mobile")}
                                    className="p-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                                    aria-label="Vista previa"
                                >
                                    <Eye size={18} />
                                </button>
                            )}
                        </div>
                        {activeTab !== "profile" && (
                            <div className="mt-2">
                                <AutoSaveBadge />
                            </div>
                        )}
                        {/* Links Tab Switcher - Mobile */}
                        {activeTab === "links" && (
                            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl mt-4">
                                <button
                                    onClick={() => setCurrentLinkType("blocks")}
                                    className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                                        currentLinkType === "blocks"
                                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                                            : "text-neutral-500 dark:text-neutral-400"
                                    }`}
                                >
                                    BLOQUES
                                </button>
                                <button
                                    onClick={() => setCurrentLinkType("social")}
                                    className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                                        currentLinkType === "social"
                                            ? "bg-gradient-to-r from-brand-500 to-pink-500 text-white shadow-md"
                                            : "bg-gradient-to-r from-brand-200/50 to-pink-200/50 dark:from-brand-900/30 dark:to-pink-900/30 text-brand-600 dark:text-brand-400"
                                    }`}
                                >
                                    REDES
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sticky LinkBar - Shows public URL (visible on all tabs except profile and links) */}
                    {/* Note: Links tab has its own sticky container that includes LinkBar */}
                    {activeTab !== "profile" && activeTab !== "links" && (
                        <div className="sticky top-0 md:top-20 z-30 bg-slate-50/95 dark:bg-neutral-950/95 backdrop-blur-xl -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 py-4">
                            <LinkBar landing={landing} user={auth.user} />
                        </div>
                    )}

                    {/* Content Rendering based on activeTab */}
                    {activeTab === "dashboard" && (
                        <DashboardTab stats={dashboardStats} />
                    )}

                    {activeTab === "links" && (
                        <LinksTab
                            links={links}
                            socialLinks={socialLinks}
                            onUpdateLinks={setLinks}
                            onUpdateSocialLinks={setSocialLinks}
                            currentLinkType={currentLinkType}
                            onChangeLinkType={setCurrentLinkType}
                            landing={landing}
                            user={auth.user}
                        />
                    )}

                    {activeTab === "appearance" && (
                        <Suspense fallback={<TabLoadingFallback />}>
                            <DesignTab
                                user={user}
                                onUpdateUser={handleUpdateUser}
                            />
                        </Suspense>
                    )}

                    {activeTab === "settings" && (
                        <Suspense fallback={<TabLoadingFallback />}>
                            <SettingsTab
                                user={user}
                                onUpdateUser={handleUpdateUser}
                            />
                        </Suspense>
                    )}

                    {activeTab === "profile" && (
                        <Suspense fallback={<TabLoadingFallback />}>
                            <ProfileTab user={auth.user} />
                        </Suspense>
                    )}
                </div>
            </div>

            {/* Right: Live Preview (Desktop Sticky - Only Mobile Mode) - Hidden on profile tab */}
            <div
                className={`w-[440px] ${
                    activeTab === "profile" ? "hidden" : "hidden xl:flex"
                } flex-col items-center justify-center gap-4 py-6 sticky top-0 h-screen bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border-l border-neutral-200/50 dark:border-neutral-800/50`}
            >
                {/* Live Preview Badge */}
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full shrink-0">
                    Vista previa
                </span>

                {/* Phone Component Container - Scales based on available height */}
                <div className="flex-1 flex items-center justify-center min-h-0 w-full">
                    <PhonePreview
                        user={user}
                        links={links}
                        socialLinks={socialLinks}
                        device="mobile"
                        scale={0.8}
                    />
                </div>

                {/* Desktop Fullscreen Trigger */}
                <button
                    onClick={() => openPreview("desktop")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                    <Maximize2 size={16} />
                    <span>Vista expandida</span>
                </button>
            </div>

            {/* Fullscreen Responsive Preview Modal - Lazy loaded */}
            {isPreviewOpen && (
                <Suspense fallback={null}>
                    <DevicePreviewModal
                        isOpen={isPreviewOpen}
                        onClose={() => setIsPreviewOpen(false)}
                        user={user}
                        links={links}
                        socialLinks={socialLinks}
                        initialDevice={initialPreviewDevice}
                    />
                </Suspense>
            )}

            {/* What's New Modal - Shows on first visit, lazy loaded */}
            {whatsNewModal.isOpen && (
                <Suspense fallback={null}>
                    <WhatsNewModal
                        isOpen={whatsNewModal.isOpen}
                        onClose={whatsNewModal.close}
                    />
                </Suspense>
            )}
        </>
    );
}

Dashboard.layout = (page: any) => (
    <PanelLayout user={page.props.auth.user} title={page.props.title}>
        {page}
    </PanelLayout>
);
