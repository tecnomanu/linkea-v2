import { useEffect, useRef, useState } from "react";

interface Screenshot {
    name: string;
    img: string;
    url: string;
}

export default function PreviewPagesSection() {
    const screenshots: Screenshot[] = [
        {
            name: "Valeria Esther",
            img: "/assets/images/screenshots/screen1.webp",
            url: "https://linkea.ar/valeriaesther",
        },
        {
            name: "Decoparadise",
            img: "/assets/images/screenshots/screen2.webp",
            url: "https://linkea.ar/decoparadiseve",
        },
        {
            name: "TSM Integral",
            img: "/assets/images/screenshots/screen3.webp",
            url: "https://linkea.ar/tsmintegral",
        },
        {
            name: "Mundo Essa",
            img: "/assets/images/screenshots/screen4.webp",
            url: "https://linkea.ar/mundoessa",
        },
        {
            name: "Hindu Club",
            img: "/assets/images/screenshots/screen5.webp",
            url: "https://linkea.ar/hinduclub",
        },
        {
            name: "Esguerra Deportes",
            img: "/assets/images/screenshots/screen6.webp",
            url: "https://linkea.ar/esquerradeportes",
        },
        {
            name: "Aporteventura",
            img: "/assets/images/screenshots/screen7.webp",
            url: "https://linkea.ar/aporteventura",
        },
    ];

    const [isPaused, setIsPaused] = useState(false);
    const [offset, setOffset] = useState(0);
    const [itemWidth, setItemWidth] = useState(160);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // Responsive item width
    useEffect(() => {
        const updateItemWidth = () => {
            const width = window.innerWidth;
            if (width >= 1280) setItemWidth(140);
            else if (width >= 1024) setItemWidth(150);
            else if (width >= 640) setItemWidth(160);
            else setItemWidth(180);
        };

        updateItemWidth();
        window.addEventListener("resize", updateItemWidth);
        return () => window.removeEventListener("resize", updateItemWidth);
    }, []);

    // Continuous smooth animation
    useEffect(() => {
        const speed = 0.03; // pixels per ms
        const gap = 20;
        const totalWidth = (itemWidth + gap) * screenshots.length;

        const animate = (timestamp: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const delta = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            if (!isPaused && !isDragging) {
                setOffset((prev) => {
                    const newOffset = prev + speed * delta;
                    return newOffset >= totalWidth
                        ? newOffset - totalWidth
                        : newOffset;
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused, isDragging, itemWidth, screenshots.length]);

    // Duplicate items for infinite scroll effect
    const duplicatedScreenshots = [
        ...screenshots,
        ...screenshots,
        ...screenshots,
    ];

    // Touch/Mouse drag handlers
    const handleDragStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
        setDragOffset(0);
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return;
        const diff = startX - clientX;
        setDragOffset(diff);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        // Apply drag offset to main offset
        setOffset((prev) => {
            const gap = 20;
            const totalWidth = (itemWidth + gap) * screenshots.length;
            let newOffset = prev + dragOffset;
            // Normalize
            while (newOffset < 0) newOffset += totalWidth;
            while (newOffset >= totalWidth) newOffset -= totalWidth;
            return newOffset;
        });
        setDragOffset(0);
    };

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleDragStart(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        handleDragMove(e.clientX);
    };

    const handleMouseUp = () => {
        handleDragEnd();
    };

    const handleMouseLeave = () => {
        if (isDragging) handleDragEnd();
    };

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => {
        handleDragStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleDragMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
    };

    const currentTransform = offset + dragOffset;

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 mb-10">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
                    Descubri lo que otros estan creando
                </h3>
                <p className="text-center text-gray-500">
                    Inspirate con diseños de nuestra comunidad
                </p>
            </div>

            {/* Infinite Scroll Container */}
            <div
                className="relative select-none"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
                {/* Fade edges */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
                    }}
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to left, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)",
                    }}
                />

                {/* Scrolling track */}
                <div
                    ref={trackRef}
                    className="flex gap-5 py-4 items-start"
                    style={{
                        transform: `translateX(-${currentTransform}px)`,
                        width: "max-content",
                        transition: isDragging ? "none" : undefined,
                    }}
                >
                    {duplicatedScreenshots.map((screenshot, idx) => (
                        <a
                            key={idx}
                            href={screenshot.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex-shrink-0 transition-transform duration-300 hover:scale-105"
                            style={{ width: itemWidth }}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onClick={(e) => {
                                // Prevent click if we were dragging
                                if (Math.abs(dragOffset) > 5) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                                {/* Fixed aspect ratio container */}
                                <div
                                    className="relative w-full"
                                    style={{ paddingBottom: "200%" }}
                                >
                                    <img
                                        src={screenshot.img}
                                        alt={screenshot.name}
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://placehold.co/200x400/f5f5f5/999?text=${screenshot.name}`;
                                        }}
                                    />
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-center">
                                        <span className="text-white font-semibold text-sm block mb-1">
                                            {screenshot.name}
                                        </span>
                                        <span className="text-white/70 text-xs flex items-center justify-center gap-1">
                                            <svg
                                                className="w-3 h-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                            Ver Linkea
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
