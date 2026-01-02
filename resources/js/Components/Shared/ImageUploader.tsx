import {
    Check,
    FlipHorizontal,
    FlipVertical,
    Loader2,
    Move,
    RotateCcw,
    RotateCw,
    Upload,
    X,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Types
// ============================================================================

export interface ImageUploaderProps {
    /** Current image URL or base64 */
    value?: string;
    /** Callback when image changes - receives base64 string */
    onChange: (imageData: { base64: string; type: string } | null) => void;
    /** Optional callback after successful upload/crop */
    onSuccess?: () => void;
    /** Placeholder image when no image is set */
    placeholder?: string;
    /** Whether the image preview should be rounded */
    rounded?: boolean;
    /** Size of the preview in pixels or string (e.g. "100%") */
    size?: number | string;
    /** Aspect ratio for cropping (width/height). Use 1 for square. */
    aspectRatio?: number;
    /** Maximum file size in KB */
    maxSizeKB?: number;
    /** Accepted file types */
    accept?: string;
    /** Whether upload is disabled */
    disabled?: boolean;
    /** Output image format */
    outputFormat?: "png" | "jpeg" | "webp";
    /** Output image quality (0-1) for jpeg/webp */
    outputQuality?: number;
    /** Resize width for output */
    resizeWidth?: number;
    /** Custom class name for the container */
    className?: string;
    /** Show delete button */
    canDelete?: boolean;
    /** Label text below the image */
    label?: string;
    /** Show success indicator after upload */
    showSuccessIndicator?: boolean;
    /** Hide the preview image (make it transparent) but keep functionality. Useful for overlays. */
    hidePreview?: boolean;
}

interface CropState {
    scale: number;
    rotation: number;
    flipH: boolean;
    flipV: boolean;
    position: { x: number; y: number }; // 0-1 normalized, 0.5 = center
}

// ============================================================================
// ImageUploader Component
// ============================================================================

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    onSuccess,
    placeholder = "/images/logos/logo-icon.webp",
    rounded = true,
    size = 112,
    aspectRatio = 1,
    maxSizeKB = 4000,
    accept = ".jpg,.jpeg,.png,.webp",
    disabled = false,
    outputFormat = "png",
    outputQuality = 0.9,
    resizeWidth = 400,
    className = "",
    canDelete = true,
    label,
    showSuccessIndicator = true,
    hidePreview = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const [cropState, setCropState] = useState<CropState>({
        scale: 1,
        rotation: 0,
        flipH: false,
        flipV: false,
        position: { x: 0.5, y: 0.5 },
    });

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

    const displayImage = value || placeholder;

    // Load image when originalImage changes
    useEffect(() => {
        if (originalImage) {
            setIsLoadingImage(true);
            const img = new Image();
            img.onload = () => {
                setIsLoadingImage(false);
            };
            img.onerror = () => {
                setIsLoadingImage(false);
            };
            img.src = originalImage;
        }
    }, [originalImage]);

    // Handle file selection
    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file size
            const sizeKB = file.size / 1024;
            if (sizeKB > maxSizeKB) {
                const sizeText =
                    maxSizeKB >= 1000
                        ? `${maxSizeKB / 1000}MB`
                        : `${maxSizeKB}KB`;
                alert(`No se puede cargar imágenes mayores a ${sizeText}`);
                return;
            }

            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Por favor seleccione una imagen válida");
                return;
            }

            setIsLoadingFile(true);
            setIsModalOpen(true);

            const reader = new FileReader();
            reader.onload = (event) => {
                setOriginalImage(event.target?.result as string);
                setCropState({
                    scale: 1,
                    rotation: 0,
                    flipH: false,
                    flipV: false,
                    position: { x: 0.5, y: 0.5 },
                });
                setIsLoadingFile(false);
            };
            reader.readAsDataURL(file);

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [maxSizeKB]
    );

    // Handle click on preview
    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle delete
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    // ========================================================================
    // Drag/Pan handlers
    // ========================================================================

    const handleDragStart = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault();
            setIsDragging(true);

            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

            dragStartRef.current = {
                x: clientX,
                y: clientY,
                posX: cropState.position.x,
                posY: cropState.position.y,
            };
        },
        [cropState.position]
    );

    const handleDragMove = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!isDragging || !previewContainerRef.current) return;

            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

            const containerRect =
                previewContainerRef.current.getBoundingClientRect();
            const containerSize = Math.min(
                containerRect.width,
                containerRect.height
            );

            // Calculate movement as percentage of container
            const deltaX = (clientX - dragStartRef.current.x) / containerSize;
            const deltaY = (clientY - dragStartRef.current.y) / containerSize;

            // Apply sensitivity based on zoom level (more zoom = more precise movement)
            const sensitivity = 1 / cropState.scale;

            // Calculate new position (inverted because we're moving the image, not the viewport)
            let newX = dragStartRef.current.posX - deltaX * sensitivity;
            let newY = dragStartRef.current.posY - deltaY * sensitivity;

            // Clamp position based on scale (allow more movement when zoomed in)
            const maxOffset = Math.max(
                0,
                (cropState.scale - 1) / (2 * cropState.scale) + 0.5
            );
            const minOffset = 1 - maxOffset;

            newX = Math.max(minOffset, Math.min(maxOffset, newX));
            newY = Math.max(minOffset, Math.min(maxOffset, newY));

            setCropState((s) => ({
                ...s,
                position: { x: newX, y: newY },
            }));
        },
        [isDragging, cropState.scale]
    );

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Attach global mouse/touch listeners for drag
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleDragMove);
            window.addEventListener("mouseup", handleDragEnd);
            window.addEventListener("touchmove", handleDragMove);
            window.addEventListener("touchend", handleDragEnd);

            return () => {
                window.removeEventListener("mousemove", handleDragMove);
                window.removeEventListener("mouseup", handleDragEnd);
                window.removeEventListener("touchmove", handleDragMove);
                window.removeEventListener("touchend", handleDragEnd);
            };
        }
    }, [isDragging, handleDragMove, handleDragEnd]);

    // ========================================================================
    // Crop controls
    // ========================================================================

    const rotateLeft = () =>
        setCropState((s) => ({ ...s, rotation: s.rotation - 90 }));
    const rotateRight = () =>
        setCropState((s) => ({ ...s, rotation: s.rotation + 90 }));
    const flipHorizontal = () =>
        setCropState((s) => ({ ...s, flipH: !s.flipH }));
    const flipVertical = () => setCropState((s) => ({ ...s, flipV: !s.flipV }));
    const zoomIn = () =>
        setCropState((s) => ({ ...s, scale: Math.min(s.scale + 0.1, 3) }));
    const zoomOut = () =>
        setCropState((s) => ({ ...s, scale: Math.max(s.scale - 0.1, 1) }));
    const resetTransform = () =>
        setCropState({
            scale: 1,
            rotation: 0,
            flipH: false,
            flipV: false,
            position: { x: 0.5, y: 0.5 },
        });

    // ========================================================================
    // Process and save the image
    // ========================================================================

    const handleSave = useCallback(() => {
        if (!originalImage || !canvasRef.current) return;

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext("2d")!;

            // Calculate output dimensions
            const outputWidth = resizeWidth;
            const outputHeight = outputWidth / aspectRatio;

            canvas.width = outputWidth;
            canvas.height = outputHeight;

            // Clear canvas
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, outputWidth, outputHeight);

            // Calculate dimensions to cover the canvas
            const imgAspect = img.width / img.height;
            const canvasAspect = aspectRatio;
            let drawWidth, drawHeight;

            if (imgAspect > canvasAspect) {
                drawHeight = outputHeight;
                drawWidth = drawHeight * imgAspect;
            } else {
                drawWidth = outputWidth;
                drawHeight = drawWidth / imgAspect;
            }

            // Apply scale
            drawWidth *= cropState.scale;
            drawHeight *= cropState.scale;

            // Calculate offset based on position (0.5 = center)
            const offsetX =
                (cropState.position.x - 0.5) * (drawWidth - outputWidth);
            const offsetY =
                (cropState.position.y - 0.5) * (drawHeight - outputHeight);

            // Apply transformations
            ctx.save();
            ctx.translate(outputWidth / 2, outputHeight / 2);
            ctx.rotate((cropState.rotation * Math.PI) / 180);
            ctx.scale(cropState.flipH ? -1 : 1, cropState.flipV ? -1 : 1);

            ctx.drawImage(
                img,
                -drawWidth / 2 - offsetX,
                -drawHeight / 2 - offsetY,
                drawWidth,
                drawHeight
            );
            ctx.restore();

            // Get base64
            const mimeType = `image/${outputFormat}`;
            const base64 = canvas.toDataURL(mimeType, outputQuality);

            onChange({
                base64,
                type: outputFormat,
            });

            setIsModalOpen(false);
            setOriginalImage(null);

            // Show success indicator
            if (showSuccessIndicator) {
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 2000);
            }

            // Call success callback if provided
            if (onSuccess) {
                onSuccess();
            }
        };
        img.src = originalImage;
    }, [
        originalImage,
        cropState,
        aspectRatio,
        outputFormat,
        outputQuality,
        resizeWidth,
        onChange,
        onSuccess,
        showSuccessIndicator,
    ]);

    // Close modal
    const handleCancel = () => {
        setIsModalOpen(false);
        setOriginalImage(null);
    };

    // Calculate image transform for preview
    const getImageTransform = () => {
        const offsetX = (cropState.position.x - 0.5) * 100 * cropState.scale;
        const offsetY = (cropState.position.y - 0.5) * 100 * cropState.scale;

        return `
            translate(${-offsetX}%, ${-offsetY}%)
            scale(${cropState.flipH ? -cropState.scale : cropState.scale}, ${
            cropState.flipV ? -cropState.scale : cropState.scale
        })
            rotate(${cropState.rotation}deg)
        `;
    };

    const isLoading = isLoadingFile || isLoadingImage;

    return (
        <>
            {/* Preview and Upload Trigger */}
            <div className={`flex flex-col items-center gap-2 ${className}`}>
                <div
                    className={`
                        relative group cursor-pointer overflow-hidden
                        transition-all duration-300
                        ${rounded ? "rounded-full" : "rounded-xl"}
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    style={{ width: size, height: size }}
                    onClick={handleClick}
                >
                    {/* Image */}
                    <img
                        src={displayImage}
                        alt="Preview"
                        className={`
                            w-full h-full object-cover
                            ${
                                hidePreview
                                    ? "opacity-0"
                                    : "border-4 border-neutral-50 shadow-md"
                            }
                            transition-all duration-300
                            ${rounded ? "rounded-full" : "rounded-xl"}
                            ${
                                !disabled && !hidePreview
                                    ? "group-hover:opacity-80"
                                    : ""
                            }
                        `}
                    />

                    {/* Overlay on hover */}
                    {!disabled && (
                        <div
                            className={`
                            absolute inset-0 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-all duration-300
                            bg-black/40
                            ${rounded ? "rounded-full" : "rounded-xl"}
                        `}
                        >
                            <div className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
                                <Upload
                                    size={18}
                                    className="text-neutral-700"
                                />
                            </div>
                        </div>
                    )}

                    {/* Delete button */}
                    {canDelete && value && !disabled && (
                        <button
                            onClick={handleDelete}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <X size={14} />
                        </button>
                    )}

                    {/* Success indicator - centered for visibility */}
                    {uploadSuccess && showSuccessIndicator && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 animate-in fade-in duration-200 z-10">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200 border-2 border-white">
                                <Check size={24} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Label */}
                {label && (
                    <span className="text-xs text-neutral-400">{label}</span>
                )}

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={disabled}
                />
            </div>

            {/* Crop Modal - High z-index to ensure visibility over all other elements */}
            {isModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleCancel}
                        />

                        {/* Modal */}
                        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                            {/* Header */}
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                                <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl">
                                    <Upload
                                        size={20}
                                        className="text-brand-600 dark:text-brand-400"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 dark:text-white">
                                        Herramienta de corte
                                    </h3>
                                    <p className="text-sm text-neutral-500">
                                        Ajuste su imagen antes de guardar
                                    </p>
                                </div>
                            </div>

                            {/* Image Preview Area */}
                            <div className="p-6">
                                {isLoading ? (
                                    /* Loading State */
                                    <div
                                        className={`
                                        mx-auto flex items-center justify-center bg-neutral-100 dark:bg-neutral-800
                                        ${
                                            rounded
                                                ? "rounded-full"
                                                : "rounded-xl"
                                        }
                                    `}
                                        style={{
                                            width: 280,
                                            height: 280 / aspectRatio,
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2
                                                size={32}
                                                className="text-brand-500 animate-spin"
                                            />
                                            <span className="text-sm text-neutral-500">
                                                Cargando imagen...
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    /* Crop Preview */
                                    <div
                                        ref={previewContainerRef}
                                        className={`
                                        relative mx-auto overflow-hidden bg-neutral-100 dark:bg-neutral-800
                                        ${
                                            rounded
                                                ? "rounded-full"
                                                : "rounded-xl"
                                        }
                                        ${
                                            isDragging
                                                ? "cursor-grabbing"
                                                : "cursor-grab"
                                        }
                                    `}
                                        style={{
                                            width: 280,
                                            height: 280 / aspectRatio,
                                        }}
                                        onMouseDown={handleDragStart}
                                        onTouchStart={handleDragStart}
                                    >
                                        <img
                                            src={originalImage!}
                                            alt="Crop preview"
                                            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                                            style={{
                                                transform: getImageTransform(),
                                                transformOrigin: "center",
                                            }}
                                            draggable={false}
                                        />

                                        {/* Drag hint overlay */}
                                        {cropState.scale > 1 && !isDragging && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                                                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-neutral-700">
                                                    <Move size={14} />
                                                    Arrastre para mover
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="px-6 pb-4">
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    <ToolButton
                                        icon={RotateCcw}
                                        onClick={rotateLeft}
                                        tooltip="Rotar izquierda"
                                        disabled={isLoading}
                                    />
                                    <ToolButton
                                        icon={RotateCw}
                                        onClick={rotateRight}
                                        tooltip="Rotar derecha"
                                        disabled={isLoading}
                                    />
                                    <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
                                    <ToolButton
                                        icon={FlipHorizontal}
                                        onClick={flipHorizontal}
                                        tooltip="Voltear horizontal"
                                        active={cropState.flipH}
                                        disabled={isLoading}
                                    />
                                    <ToolButton
                                        icon={FlipVertical}
                                        onClick={flipVertical}
                                        tooltip="Voltear vertical"
                                        active={cropState.flipV}
                                        disabled={isLoading}
                                    />
                                    <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />
                                    <ToolButton
                                        icon={ZoomOut}
                                        onClick={zoomOut}
                                        tooltip="Alejar"
                                        disabled={
                                            isLoading || cropState.scale <= 1
                                        }
                                    />
                                    <ToolButton
                                        icon={ZoomIn}
                                        onClick={zoomIn}
                                        tooltip="Acercar"
                                        disabled={
                                            isLoading || cropState.scale >= 3
                                        }
                                    />
                                </div>

                                {/* Zoom slider */}
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="text-xs text-neutral-500 w-12">
                                        Zoom
                                    </span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={cropState.scale}
                                        onChange={(e) =>
                                            setCropState((s) => ({
                                                ...s,
                                                scale: parseFloat(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                        className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                        disabled={isLoading}
                                    />
                                    <span className="text-xs text-neutral-500 w-12 text-right">
                                        {Math.round(cropState.scale * 100)}%
                                    </span>
                                </div>

                                {/* Hint text */}
                                {cropState.scale > 1 && !isLoading && (
                                    <p className="text-xs text-center text-neutral-400 mt-3">
                                        Arrastre la imagen para reposicionar
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                                <button
                                    onClick={resetTransform}
                                    disabled={isLoading}
                                    className="px-4 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50"
                                >
                                    Resetear
                                </button>
                                <div className="flex-1" />
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 text-sm font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Check size={16} />
                                    )}
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
        </>
    );
};

// ============================================================================
// Helper Components
// ============================================================================

interface ToolButtonProps {
    icon: React.ComponentType<{ size?: number }>;
    onClick: () => void;
    tooltip: string;
    disabled?: boolean;
    active?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
    icon: Icon,
    onClick,
    tooltip,
    disabled,
    active,
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
        className={`
            w-10 h-10 flex items-center justify-center rounded-xl transition-all
            ${
                active
                    ? "bg-brand-500 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }
            ${
                disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 active:scale-95"
            }
        `}
    >
        <Icon size={18} />
    </button>
);

export default ImageUploader;
