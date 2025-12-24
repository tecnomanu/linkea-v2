import { router } from "@inertiajs/react";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

// Store for pending changes by section (API format for saving)
export interface PendingChanges {
    links?: any;
    socialLinks?: any;
    design?: any;
    settings?: any;
}

// UI State store - persists while navigating within panel
export interface UiState {
    links?: any[];
    socialLinks?: any[];
    user?: any;
}

interface AutoSaveContextType {
    // Auto-save toggle
    autoSaveEnabled: boolean;
    setAutoSaveEnabled: (enabled: boolean) => void;

    // Save status
    isSaving: boolean;
    lastSaved: Date | null;
    hasChanges: boolean;

    // Pending changes (API payloads)
    pendingChanges: PendingChanges;
    setPendingChanges: (section: keyof PendingChanges, data: any) => void;
    clearPendingChanges: (section?: keyof PendingChanges) => void;

    // Navigation confirmation
    showNavigationDialog: boolean;
    pendingNavigation: string | null;
    confirmNavigation: () => void;
    cancelNavigation: () => void;

    // Landing management
    landingId: string | null;
    setLandingId: (id: string | null) => void;

    // Save function
    saveAllChanges: () => Promise<void>;

    // UI State persistence (for panel navigation)
    uiState: UiState;
    setUiState: (section: keyof UiState, data: any) => void;
}

const AutoSaveContext = createContext<AutoSaveContextType | undefined>(
    undefined
);

export function AutoSaveProvider({ children }: { children: ReactNode }) {
    // Auto-save preference
    const [autoSaveEnabled, setAutoSaveEnabledState] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("autoSave");
            return saved !== "false";
        }
        return true;
    });

    // Save status
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Pending changes (API format)
    const [pendingChanges, setPendingChangesState] = useState<PendingChanges>(
        {}
    );

    // Navigation
    const [showNavigationDialog, setShowNavigationDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(
        null
    );

    // Landing ID tracking
    const [landingId, setLandingIdState] = useState<string | null>(null);
    const prevLandingIdRef = useRef<string | null>(null);

    // UI State - persists while navigating within panel
    const [uiState, setUiStateInternal] = useState<UiState>({});

    // Initial state for comparison (baseline after save)
    const initialStateRef = useRef<Record<string, string>>({});

    // Track if navigation was confirmed (to allow it through)
    const navigationConfirmedRef = useRef(false);

    // =========================================================================
    // LANDING ID MANAGEMENT
    // =========================================================================

    const setLandingId = useCallback((id: string | null) => {
        // Only reset state when landing actually changes
        if (id !== prevLandingIdRef.current) {
            // Clear all state for new landing
            setUiStateInternal({});
            setPendingChangesState({});
            setHasChanges(false);
            initialStateRef.current = {};
            prevLandingIdRef.current = id;
        }
        setLandingIdState(id);
    }, []);

    // =========================================================================
    // UI STATE MANAGEMENT (persists during panel navigation)
    // =========================================================================

    const setUiState = useCallback((section: keyof UiState, data: any) => {
        setUiStateInternal((prev) => ({
            ...prev,
            [section]: data,
        }));
    }, []);

    // =========================================================================
    // PENDING CHANGES MANAGEMENT
    // =========================================================================

    const setPendingChanges = useCallback(
        (section: keyof PendingChanges, data: any) => {
            const currentDataStr = JSON.stringify(data);

            // Establish baseline on first call for this section
            if (initialStateRef.current[section] === undefined) {
                initialStateRef.current[section] = currentDataStr;
                return; // First call = baseline, no changes yet
            }

            const isChanged =
                currentDataStr !== initialStateRef.current[section];

            setPendingChangesState((prev) => {
                if (isChanged) {
                    return { ...prev, [section]: data };
                }
                // No change from baseline - remove from pending
                const { [section]: _, ...rest } = prev;
                return rest;
            });

            // Update hasChanges based on all sections
            setPendingChangesState((current) => {
                const willHaveChanges = isChanged
                    ? true
                    : Object.keys(current).filter((k) => k !== section).length >
                      0;
                setHasChanges(willHaveChanges);
                return current;
            });
        },
        []
    );

    const clearPendingChanges = useCallback(
        (section?: keyof PendingChanges) => {
            if (section) {
                setPendingChangesState((prev) => {
                    const { [section]: _, ...rest } = prev;
                    setHasChanges(Object.keys(rest).length > 0);
                    return rest;
                });
            } else {
                setPendingChangesState({});
                setHasChanges(false);
            }
        },
        []
    );

    // =========================================================================
    // AUTO-SAVE PREFERENCE
    // =========================================================================

    const setAutoSaveEnabled = useCallback((enabled: boolean) => {
        setAutoSaveEnabledState(enabled);
        localStorage.setItem("autoSave", enabled.toString());
    }, []);

    // =========================================================================
    // API HELPERS
    // =========================================================================

    const getCsrfToken = useCallback((): string => {
        return (
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || ""
        );
    }, []);

    const refreshCsrfToken = useCallback(async () => {
        try {
            await fetch("/sanctum/csrf-cookie", {
                method: "GET",
                credentials: "include",
            });
            const response = await fetch("/api/csrf-token", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                const metaTag = document.querySelector(
                    'meta[name="csrf-token"]'
                );
                if (metaTag && data.token) {
                    metaTag.setAttribute("content", data.token);
                }
            }
        } catch (e) {
            console.error("Failed to refresh CSRF token:", e);
        }
    }, []);

    const authenticatedFetch = useCallback(
        async (
            url: string,
            options: RequestInit = {},
            retryOnCsrf = true
        ): Promise<Response> => {
            const response = await fetch(url, {
                ...options,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                    ...options.headers,
                },
            });

            if (response.status === 419 && retryOnCsrf) {
                console.warn("CSRF mismatch, refreshing and retrying...");
                await refreshCsrfToken();
                return authenticatedFetch(url, options, false);
            }

            return response;
        },
        [getCsrfToken, refreshCsrfToken]
    );

    // =========================================================================
    // SAVE ALL CHANGES
    // =========================================================================

    const saveAllChanges = useCallback(async () => {
        if (!landingId || Object.keys(pendingChanges).length === 0) return;

        setIsSaving(true);

        try {
            const endpoints: Record<keyof PendingChanges, string> = {
                links: `/api/panel/links/${landingId}`,
                socialLinks: `/api/panel/social-links/${landingId}`,
                design: `/api/panel/design/${landingId}`,
                settings: `/api/panel/settings/${landingId}`,
            };

            const savePromises = Object.entries(pendingChanges)
                .filter(([_, data]) => data !== undefined)
                .map(([section, data]) =>
                    authenticatedFetch(
                        endpoints[section as keyof PendingChanges],
                        {
                            method: "POST",
                            body: JSON.stringify(data),
                        }
                    )
                );

            const responses = await Promise.all(savePromises);
            const failed = responses.find((r) => !r.ok);

            if (failed) {
                const errorData = await failed.json().catch(() => ({}));
                throw new Error(errorData.message || "Error al guardar");
            }

            // Update baseline to saved state
            for (const [section, data] of Object.entries(pendingChanges)) {
                if (data !== undefined) {
                    initialStateRef.current[section] = JSON.stringify(data);
                }
            }

            setLastSaved(new Date());
            setPendingChangesState({});
            setHasChanges(false);
        } catch (error) {
            console.error("Error saving changes:", error);
        } finally {
            setIsSaving(false);
        }
    }, [landingId, pendingChanges, authenticatedFetch]);

    // =========================================================================
    // NAVIGATION HANDLERS
    // =========================================================================

    const isPanelRoute = useCallback((url: string): boolean => {
        try {
            const pathname = new URL(url, window.location.origin).pathname;
            return pathname === "/panel" || pathname.startsWith("/panel/");
        } catch {
            return false;
        }
    }, []);

    const confirmNavigation = useCallback(() => {
        setShowNavigationDialog(false);

        if (pendingNavigation) {
            // Clear all state when leaving panel
            setPendingChangesState({});
            setHasChanges(false);
            initialStateRef.current = {};
            setUiStateInternal({});

            // Mark navigation as confirmed and navigate
            navigationConfirmedRef.current = true;
            router.visit(pendingNavigation, { preserveState: false });
        }
        setPendingNavigation(null);
    }, [pendingNavigation]);

    const cancelNavigation = useCallback(() => {
        setShowNavigationDialog(false);
        setPendingNavigation(null);
    }, []);

    // =========================================================================
    // NAVIGATION INTERCEPTION
    // =========================================================================

    useEffect(() => {
        const removeListener = router.on("before", (event) => {
            // Skip if navigation was already confirmed
            if (navigationConfirmedRef.current) {
                navigationConfirmedRef.current = false;
                return true;
            }

            // No changes = allow navigation
            if (!hasChanges) return true;

            const targetUrl = event.detail.visit.url.href;

            // Allow free navigation within panel
            if (isPanelRoute(targetUrl)) return true;

            // Block navigation outside panel - show dialog
            event.preventDefault();
            setPendingNavigation(targetUrl);
            setShowNavigationDialog(true);
            return false;
        });

        return () => removeListener();
    }, [hasChanges, isPanelRoute]);

    // Browser beforeunload warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue =
                    "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?";
                return e.returnValue;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasChanges]);

    // =========================================================================
    // CONTEXT VALUE
    // =========================================================================

    return (
        <AutoSaveContext.Provider
            value={{
                autoSaveEnabled,
                setAutoSaveEnabled,
                isSaving,
                lastSaved,
                hasChanges,
                pendingChanges,
                setPendingChanges,
                clearPendingChanges,
                showNavigationDialog,
                pendingNavigation,
                confirmNavigation,
                cancelNavigation,
                landingId,
                setLandingId,
                saveAllChanges,
                uiState,
                setUiState,
            }}
        >
            {children}
        </AutoSaveContext.Provider>
    );
}

export function useAutoSaveContext() {
    const context = useContext(AutoSaveContext);
    if (context === undefined) {
        throw new Error(
            "useAutoSaveContext must be used within an AutoSaveProvider"
        );
    }
    return context;
}
