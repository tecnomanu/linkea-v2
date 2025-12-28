import { DashboardTab } from "@/Components/Panel/Dashboard/DashboardTab";
import { DesignTab } from "@/Components/Panel/Design/DesignTab";
import { LinkBar } from "@/Components/Panel/Links/LinkBar";
import { LinksTab, SocialLink } from "@/Components/Panel/Links/LinksTab";
import { ProfileTab } from "@/Components/Panel/Profile/ProfileTab";
import { SettingsTab } from "@/Components/Panel/Settings/SettingsTab";
import {
    AutoSaveBadge,
    ManualSaveButton,
} from "@/Components/Shared/AutoSaveSettings";
import { DevicePreviewModal } from "@/Components/Shared/DevicePreviewModal";
import { DeviceMode, PhonePreview } from "@/Components/Shared/PhonePreview";
import {
    useWhatsNewModal,
    WhatsNewModal,
} from "@/Components/Shared/WhatsNewModal";
import { INITIAL_LINKS } from "@/constants";
import { useAutoSaveContext } from "@/contexts/AutoSaveContext";
import PanelLayout from "@/Layouts/PanelLayout";
import { BlockType, LinkBlock, UserProfile } from "@/types";
import { Head } from "@inertiajs/react";
import { Eye, Maximize2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface DashboardStats {
    totalClicks: number;
    totalLinks: number;
    activeLinks: number;
    clicksToday: number;
    clicksThisWeek: number;
    clicksThisMonth: number;
    weeklyChange: number;
    dailyAverage: number;
    chartData: { date: string; fullDate: string; clicks: number }[];
    topLinks: {
        id: string;
        title: string;
        type: string;
        clicks: number;
        sparklineData: { value: number }[];
    }[];
    linksByType: {
        type: string;
        count: number;
        clicks: number;
    }[];
}

interface DashboardProps {
    landing: any;
    links: any[];
    socialLinks?: any[];
    auth: {
        user: any;
    };
    activeTab?: string; // Passed from controller
    dashboardStats?: DashboardStats | null;
}

export default function Dashboard({
    landing,
    links: serverLinks,
    socialLinks: serverSocialLinks = [],
    auth,
    activeTab: serverActiveTab = "dashboard",
    dashboardStats = null,
}: DashboardProps) {
    // Sync state with prop if needed, but primarily rely on prop for the "View"
    const activeTab = serverActiveTab;

    // Serialize server links to frontend LinkBlock format
    const initialLinks: LinkBlock[] = serverLinks.map((link) => ({
        id: link.id.toString(),
        title: link.text,
        url: link.link,
        isEnabled: !!link.state, // Ensure boolean
        clicks: link.visited || 0,
        type: (link.type as BlockType) || "link", // Default to link if unknown
        icon: link.icon || undefined, // Legacy icon data {name, type}
        sparklineData:
            link.sparklineData ||
            Array(7)
                .fill(0)
                .map(() => ({ value: 0 })), // Use server data or fallback to zeros
        // Config fields - from config JSON column
        headerSize: link.config?.header_size,
        mediaDisplayMode: link.config?.media_display_mode,
        showInlinePlayer: link.config?.show_inline_player,
        autoPlay: link.config?.auto_play,
        startMuted: link.config?.start_muted,
        playerSize: link.config?.player_size,
        phoneNumber: link.config?.phone_number,
        predefinedMessage: link.config?.predefined_message,
        // Calendar specific
        calendarProvider: link.config?.calendar_provider,
        calendarDisplayMode: link.config?.calendar_display_mode,
        // Email specific
        emailAddress: link.config?.email_address,
        emailSubject: link.config?.email_subject,
        emailBody: link.config?.email_body,
        // Map specific
        mapAddress: link.config?.map_address,
        mapQuery: link.config?.map_query,
        mapZoom: link.config?.map_zoom,
        mapDisplayMode: link.config?.map_display_mode,
        // Video embeds (Vimeo, TikTok, Twitch)
        videoId: link.config?.video_id,
        // SoundCloud
        soundcloudUrl: link.config?.soundcloud_url,
    }));

    // Serialize server user/landing to frontend UserProfile format
    // Title and subtitle come from template_config (as in legacy)
    const displayTitle =
        landing?.template_config?.title ?? landing?.domain_name ?? "";
    const displaySubtitle = landing?.template_config?.subtitle ?? "";

    // Determine if background image should be enabled (default true if image exists)
    const bgImage = landing?.template_config?.background?.backgroundImage;
    const hasBackgroundImage =
        bgImage &&
        typeof bgImage === "string" &&
        (bgImage.includes("http") ||
            bgImage.includes("data:image") ||
            bgImage.startsWith("url("));
    const backgroundEnabled =
        landing?.template_config?.background?.backgroundEnabled ??
        hasBackgroundImage;

    const initialUser: UserProfile = {
        name: landing?.name || "", // Internal name (not displayed)
        handle: landing?.domain_name || landing?.slug || "",
        avatar:
            landing?.logo?.image ||
            auth.user.avatar ||
            "/images/logos/logo-icon.webp",
        title: displayTitle,
        subtitle: displaySubtitle,
        showTitle: landing?.template_config?.showTitle ?? true,
        showSubtitle: landing?.template_config?.showSubtitle ?? true,

        theme:
            (landing?.template_config?.background?.bgName as any) || "custom",

        customDesign: {
            backgroundColor:
                landing?.template_config?.background?.backgroundColor ||
                "#ffffff",
            backgroundImage:
                landing?.template_config?.background?.backgroundImage ||
                undefined,
            backgroundEnabled: backgroundEnabled,
            backgroundSize:
                landing?.template_config?.background?.backgroundSize ||
                undefined,
            backgroundPosition:
                landing?.template_config?.background?.backgroundPosition ||
                undefined,
            backgroundRepeat:
                landing?.template_config?.background?.backgroundRepeat ||
                undefined,
            backgroundAttachment:
                landing?.template_config?.background?.backgroundAttachment ||
                undefined,
            // Legacy background editor props (colors, opacity, scale)
            backgroundProps:
                landing?.template_config?.background?.props || undefined,
            backgroundControls:
                landing?.template_config?.background?.controls || undefined,
            buttonStyle: landing?.template_config?.buttons?.style || "solid",
            buttonShape: landing?.template_config?.buttons?.shape || "rounded",
            buttonColor:
                landing?.template_config?.buttons?.backgroundColor || "#000000",
            buttonTextColor:
                landing?.template_config?.buttons?.textColor || "#ffffff",
            buttonBorderColor:
                landing?.template_config?.buttons?.borderColor || undefined,
            // Button icon options
            showButtonIcons:
                landing?.template_config?.buttons?.showIcons ?? true,
            buttonIconAlignment:
                landing?.template_config?.buttons?.iconAlignment || "left",
            // Show URL/link text under button titles
            showLinkSubtext: landing?.template_config?.showLinkSubtext ?? false,
            fontPair: landing?.template_config?.fontPair || "modern",
            // Text color for landing content (auto-calculated if not set)
            textColor: landing?.template_config?.textColor || undefined,
            roundedAvatar:
                landing?.template_config?.header?.roundedAvatar ?? true,
            avatarFloating:
                landing?.template_config?.header?.avatarFloating ?? true,
        },

        // Saved custom themes (max 2)
        savedCustomThemes: landing?.template_config?.savedCustomThemes || [],

        // Last custom design backup
        lastCustomDesign:
            landing?.template_config?.lastCustomDesign || undefined,

        // SEO - new structure: options.meta.*, with legacy fallback
        seoTitle:
            landing?.options?.meta?.title || landing?.options?.title || "",
        seoDescription:
            landing?.options?.meta?.description ||
            landing?.options?.description ||
            "",

        // Analytics - new structure: options.analytics.*, with legacy fallback
        googleAnalyticsId:
            landing?.options?.analytics?.google_code ||
            landing?.options?.google_analytics_id ||
            "",
        facebookPixelId:
            landing?.options?.analytics?.facebook_pixel ||
            landing?.options?.facebook_pixel_id ||
            "",

        // Privacy
        isPrivate: landing?.options?.is_private || false,

        // Verification & Legacy
        isVerified: landing?.verify || false,
        isLegacy: !!landing?.mongo_id,
    };

    // Serialize server social links to frontend format
    const initialSocialLinks: SocialLink[] = serverSocialLinks.map(
        (link: any) => ({
            id: link.id.toString(),
            url: link.link || "",
            icon: link.icon || undefined,
            active: link.state ?? true,
            clicks: link.visited || 0,
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
            <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pt-32 md:pt-8 overflow-y-auto h-screen hide-scrollbar relative">
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
                                    onClick={() => setCurrentLinkType("blocks")}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                        currentLinkType === "blocks"
                                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                    }`}
                                >
                                    BLOQUES
                                </button>
                                <button
                                    onClick={() => setCurrentLinkType("social")}
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
                    {/* Auto-save status, preview button, and manual save */}
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
                </header>

                {/* Mobile Title */}
                <div className="md:hidden mb-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white capitalize">
                            {activeTab === "dashboard" ? "Resumen" : activeTab}
                        </h1>
                        <button
                            onClick={() => openPreview("mobile")}
                            className="p-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                            aria-label="Vista previa"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                    <div className="mt-2">
                        <AutoSaveBadge />
                    </div>
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
                    <DesignTab user={user} onUpdateUser={handleUpdateUser} />
                )}

                {activeTab === "settings" && (
                    <SettingsTab user={user} onUpdateUser={handleUpdateUser} />
                )}

                {activeTab === "profile" && <ProfileTab user={auth.user} />}
            </div>

            {/* Right: Live Preview (Desktop Sticky - Only Mobile Mode) */}
            <div className="w-[440px] hidden xl:flex flex-col items-center justify-center gap-4 py-6 sticky top-0 h-screen bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border-l border-neutral-200/50 dark:border-neutral-800/50">
                {/* Live Preview Badge */}
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full shrink-0">
                    Vista previa
                </span>

                {/* Phone Component Container - Scales based on available height */}
                <div className="flex-1 flex items-center justify-center min-h-0 w-full overflow-hidden">
                    <div className="transform scale-[0.65] sm:scale-[0.70] 2xl:scale-[0.75] origin-center transition-transform duration-500">
                        <PhonePreview
                            user={user}
                            links={links}
                            socialLinks={socialLinks}
                            device="mobile"
                        />
                    </div>
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

            {/* Fullscreen Responsive Preview Modal */}
            <DevicePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                user={user}
                links={links}
                socialLinks={socialLinks}
                initialDevice={initialPreviewDevice}
            />

            {/* What's New Modal - Shows on first visit */}
            <WhatsNewModal
                isOpen={whatsNewModal.isOpen}
                onClose={whatsNewModal.close}
            />
        </>
    );
}

Dashboard.layout = (page: any) => (
    <PanelLayout user={page.props.auth.user} title={page.props.title}>
        {page}
    </PanelLayout>
);
