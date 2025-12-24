import { useAutoSaveContext } from "@/contexts/AutoSaveContext";
import axios from "axios";
import { useCallback, useEffect, useRef } from "react";

interface UseAutoSaveOptions {
    endpoint: string;
    data: any;
    enabled?: boolean;
    debounceMs?: number;
    onSuccess?: (response: any) => void;
}

export function useAutoSave({
    endpoint,
    data,
    enabled = true,
    debounceMs = 500,
    onSuccess,
}: UseAutoSaveOptions) {
    const { autoSaveEnabled, setIsSaving, setLastSaved, setHasChanges } = useAutoSaveContext();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const previousDataRef = useRef<string>(JSON.stringify(data));
    const initialDataRef = useRef<string>(JSON.stringify(data));
    const abortControllerRef = useRef<AbortController | null>(null);
    const onSuccessRef = useRef(onSuccess);
    
    // Keep onSuccess ref updated without triggering re-renders
    onSuccessRef.current = onSuccess;

    const save = useCallback(async () => {
        if (!enabled || !endpoint) return;

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setIsSaving(true);

        try {
            const response = await axios.post(endpoint, data, {
                signal: abortControllerRef.current.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            setIsSaving(false);
            setLastSaved(new Date());
            setHasChanges(false);
            // Update initial data ref after successful save
            initialDataRef.current = JSON.stringify(data);
            
            // Call onSuccess callback with response data
            if (onSuccessRef.current) {
                onSuccessRef.current(response.data);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                // Request was cancelled, ignore
                return;
            }
            console.error('Auto-save error:', error);
            setIsSaving(false);
        }
    }, [endpoint, data, enabled, setIsSaving, setLastSaved, setHasChanges]);

    useEffect(() => {
        const currentData = JSON.stringify(data);

        // Only trigger if data actually changed
        if (currentData === previousDataRef.current) {
            return;
        }

        previousDataRef.current = currentData;
        
        // Mark as having changes if different from initial
        const hasPendingChanges = currentData !== initialDataRef.current;
        setHasChanges(hasPendingChanges);

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Schedule save with debounce only if auto-save is enabled
        if (autoSaveEnabled && enabled && hasPendingChanges) {
            timeoutRef.current = setTimeout(() => {
                save();
            }, debounceMs);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, autoSaveEnabled, enabled, debounceMs, save, setHasChanges]);

    // Cleanup abort controller on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Manual save function (for when auto-save is disabled)
    const manualSave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        save();
    }, [save]);

    return { manualSave };
}
