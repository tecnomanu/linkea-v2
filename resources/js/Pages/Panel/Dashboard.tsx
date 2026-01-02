import {
    DashboardStats,
    DashboardTab,
} from "@/Components/Panel/Dashboard/DashboardTab";
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
    LandingProfile,
    LinkBlock,
} from "@/types/index";
import { Head } from "@inertiajs/react";
import { Eye, Maximize2 } from "lucide-react";
import {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

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

// Memoized PhonePreview to avoid unnecessary re-renders
const MemoizedPhonePreview = memo(PhonePreview);

export default function Dashboard({
    landing: landingData,
    auth,
    activeTab: serverActiveTab = "dashboard",
    dashboardStats = null,
}: DashboardProps) {
    // CLIENT-SIDE TAB DETECTION: Get tab from URL query params
    const getActiveTabFromUrl = () => {
        if (typeof window === "undefined") return serverActiveTab;
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("tab") || serverActiveTab;
    };

    const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());

    // Listen for URL changes (back/forward + programmatic navigation)
    useEffect(() => {
        const handlePopState = () => {
            setActiveTab(getActiveTabFromUrl());
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);
    const initialLinks: LinkBlock[] = landingData?.links || [];

    const tc = landingData?.template_config;
    const bg = tc?.background;
    const buttons = tc?.buttons;
    const header = tc?.header;
    const opts = landingData?.options;

    const initialLandingProfile: LandingProfile = {
        name: landingData?.name || "",
        handle: landingData?.slug || landingData?.domain_name || "",
        avatar:
            landingData?.logo?.image ||
            auth.user.avatar ||
            "/images/logos/logo-icon.webp",
        avatarThumb:
            landingData?.logo?.thumb || auth.user.avatar_thumb || undefined,
        title: tc?.title || landingData?.slug || "",
        subtitle: tc?.subtitle || "",
        showTitle: tc?.showTitle ?? true,
        showSubtitle: tc?.showSubtitle ?? true,
        theme: bg?.bgName || "custom",
        customDesign: {
            backgroundColor: bg?.backgroundColor || "#fed7aa",
            backgroundImage: bg?.backgroundImage || undefined,
            backgroundEnabled: bg?.backgroundEnabled ?? true,
            backgroundSize: bg?.backgroundSize || "cover",
            backgroundPosition: bg?.backgroundPosition || "center",
            backgroundRepeat: bg?.backgroundRepeat || "no-repeat",
            backgroundAttachment: bg?.backgroundAttachment || "scroll",
            backgroundProps: bg?.props || undefined,
            backgroundControls: bg?.controls || undefined,
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
            fontPair: tc?.fontPair || "modern",
            textColor: tc?.textColor || "#1f2937",
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
        isVerified: landingData?.verify || false,
        isLegacy: !!landingData?.mongo_id,
    };

    const initialSocialLinks: SocialLink[] = (
        landingData?.socialLinks || []
    ).map((link) => ({
        id: link.id,
        url: link.url || "",
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
    }));

    const {
        uiState,
        setUiState,
        setLandingId,
        landingId: contextLandingId,
        setPendingChanges,
        saveAllChanges,
        autoSaveEnabled,
    } = useAutoSaveContext();

    const isSameLanding = contextLandingId === landingData?.id;

    const [links, setLinksInternal] = useState<LinkBlock[]>(() => {
        if (isSameLanding && uiState.links) {
            return uiState.links;
        }
        return initialLinks;
    });

    const [landing, setLandingInternal] = useState<LandingProfile>(() => {
        if (isSameLanding && uiState.landing) {
            return uiState.landing;
        }
        return initialLandingProfile;
    });

    const [socialLinks, setSocialLinksInternal] = useState<SocialLink[]>(() => {
        if (isSameLanding && uiState.socialLinks) {
            return uiState.socialLinks;
        }
        return initialSocialLinks;
    });

    const setLinks = useCallback(
        (newLinks: LinkBlock[] | ((prev: LinkBlock[]) => LinkBlock[])) => {
            setLinksInternal((prev) =>
                typeof newLinks === "function" ? newLinks(prev) : newLinks
            );
        },
        []
    );

    const setLanding = useCallback(
        (
            newLanding:
                | LandingProfile
                | ((prev: LandingProfile) => LandingProfile)
        ) => {
            setLandingInternal((prev) =>
                typeof newLanding === "function" ? newLanding(prev) : newLanding
            );
        },
        []
    );

    const setSocialLinks = useCallback(
        (newLinks: SocialLink[] | ((prev: SocialLink[]) => SocialLink[])) => {
            setSocialLinksInternal((prev) =>
                typeof newLinks === "function" ? newLinks(prev) : newLinks
            );
        },
        []
    );

    // OPTIMIZACIÓN: Batch context updates
    useEffect(() => {
        setUiState("links", links);
        setUiState("landing", landing);
        setUiState("socialLinks", socialLinks);
    }, [links, landing, socialLinks, setUiState]);

    const [currentLinkType, setCurrentLinkType] = useState<"blocks" | "social">(
        "blocks"
    );

    const whatsNewModal = useWhatsNewModal();

    useEffect(() => {
        if (landingData?.id) {
            setLandingId(landingData.id);
        }
    }, [landingData?.id, setLandingId]);

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
                headerSize: link.headerSize,
                mediaDisplayMode: link.mediaDisplayMode,
                showInlinePlayer: link.showInlinePlayer,
                autoPlay: link.autoPlay,
                startMuted: link.startMuted,
                playerSize: link.playerSize,
                phoneNumber: link.phoneNumber,
                predefinedMessage: link.predefinedMessage,
                calendarProvider: link.calendarProvider,
                calendarDisplayMode: link.calendarDisplayMode,
                emailAddress: link.emailAddress,
                emailSubject: link.emailSubject,
                emailBody: link.emailBody,
                mapAddress: link.mapAddress,
                mapQuery: link.mapQuery,
                mapZoom: link.mapZoom,
                mapDisplayMode: link.mapDisplayMode,
                mapShowAddress: link.mapShowAddress,
            })),
        }),
        [links]
    );

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

    const designPayload = useMemo(
        () => ({
            title: landing.title,
            subtitle: landing.subtitle,
            showTitle: landing.showTitle,
            showSubtitle: landing.showSubtitle,
            avatar: landing.avatar,
            theme: landing.theme,
            customDesign: {
                ...landing.customDesign,
                roundedAvatar: landing.customDesign.roundedAvatar ?? true,
                avatarFloating: landing.customDesign.avatarFloating ?? true,
            },
            savedCustomThemes: landing.savedCustomThemes,
            lastCustomDesign: landing.lastCustomDesign,
        }),
        [
            landing.title,
            landing.subtitle,
            landing.showTitle,
            landing.showSubtitle,
            landing.avatar,
            landing.theme,
            landing.customDesign,
            landing.savedCustomThemes,
            landing.lastCustomDesign,
        ]
    );

    const settingsPayload = useMemo(
        () => ({
            handle: landing.handle,
            seoTitle: landing.seoTitle,
            seoDescription: landing.seoDescription,
            googleAnalyticsId: landing.googleAnalyticsId,
            facebookPixelId: landing.facebookPixelId,
            isPrivate: landing.isPrivate,
        }),
        [
            landing.handle,
            landing.seoTitle,
            landing.seoDescription,
            landing.googleAnalyticsId,
            landing.facebookPixelId,
            landing.isPrivate,
        ]
    );

    // OPTIMIZACIÓN: Batched pending changes tracking
    useEffect(() => {
        setPendingChanges("links", linksPayload);
        setPendingChanges("socialLinks", socialLinksPayload);
        setPendingChanges("design", designPayload);
        setPendingChanges("settings", settingsPayload);
    }, [linksPayload, socialLinksPayload, designPayload, settingsPayload, setPendingChanges]);

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

    const handleManualSave = () => {
        saveAllChanges();
    };

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [initialPreviewDevice, setInitialPreviewDevice] =
        useState<DeviceMode>("mobile");

    const handleUpdateLanding = useCallback((updates: Partial<LandingProfile>) => {
        setLanding((prev) => {
            if (updates.customDesign) {
                return {
                    ...prev,
                    ...updates,
                    customDesign: {
                        ...prev.customDesign,
                        ...updates.customDesign,
                    },
                };
            }
            return { ...prev, ...updates };
        });
    }, [setLanding]);

    const openPreview = useCallback((device: DeviceMode = "mobile") => {
        setInitialPreviewDevice(device);
        setIsPreviewOpen(true);
    }, []);

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

            <div className="flex-1 w-full mx-auto p-4 md:p-8 lg:p-12 pt-32 md:pt-8 overflow-y-auto h-screen overlay-scrollbar relative">
                <div className=" max-w-5xl  mx-auto">
                    <header className="hidden md:flex justify-between items-end mb-8 sticky top-0 z-40 bg-slate-50/90 dark:bg-neutral-950/90 backdrop-blur-xl py-4 -mx-8 px-8 lg:-mx-12 lg:px-12 transition-all">
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
                        {activeTab !== "profile" && (
                            <div className="flex items-center gap-3">
                                <AutoSaveBadge />
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

                    {activeTab !== "profile" && activeTab !== "links" && (
                        <div className="sticky top-0 md:top-20 z-30 bg-slate-50/95 dark:bg-neutral-950/95 backdrop-blur-xl -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 py-4">
                            <LinkBar landing={landingData} user={auth.user} />
                        </div>
                    )}

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
                        <DesignTab
                            landing={landing}
                            onUpdateLanding={handleUpdateLanding}
                        />
                    )}

                    {activeTab === "settings" && (
                        <SettingsTab
                            landing={landing}
                            onUpdateLanding={handleUpdateLanding}
                        />
                    )}

                    {activeTab === "profile" && (
                        <ProfileTab user={auth.user} />
                    )}
                </div>
            </div>

            <div
                className={`w-[440px] ${
                    activeTab === "profile" ? "hidden" : "hidden xl:flex"
                } flex-col items-center justify-center gap-4 py-6 sticky top-0 h-screen bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border-l border-neutral-200/50 dark:border-neutral-800/50`}
            >
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full shrink-0">
                    Vista previa
                </span>

                <div className="flex-1 flex items-center justify-center min-h-0 w-full">
                    <MemoizedPhonePreview
                        landing={landing}
                        links={links}
                        socialLinks={socialLinks}
                        device="mobile"
                        scale={0.8}
                    />
                </div>

                <button
                    onClick={() => openPreview("desktop")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                    <Maximize2 size={16} />
                    <span>Vista expandida</span>
                </button>
            </div>

            {isPreviewOpen && (
                <DevicePreviewModal
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    landing={landing}
                    links={links}
                    socialLinks={socialLinks}
                    initialDevice={initialPreviewDevice}
                />
            )}

            {whatsNewModal.isOpen && (
                <WhatsNewModal
                    isOpen={whatsNewModal.isOpen}
                    onClose={whatsNewModal.close}
                />
            )}
        </>
    );
}

Dashboard.layout = (page: any) => (
    <PanelLayout user={page.props.auth.user} title={page.props.title}>
        {page}
    </PanelLayout>
);
