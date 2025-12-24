import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React, { ReactNode } from "react";

interface LinkCardContainerProps {
    id: string;
    isEnabled: boolean;
    badge: {
        label: string;
        className: string;
    };
    children: ReactNode;
    /** Optional expandable content shown below the main content */
    expandedContent?: ReactNode;
}

export const LinkCardContainer: React.FC<LinkCardContainerProps> = ({
    id,
    isEnabled,
    badge,
    children,
    expandedContent,
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? undefined : "transform 150ms ease",
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
        position: "relative" as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group relative bg-white dark:bg-neutral-900 rounded-2xl border transition-all duration-300
                ${
                    isEnabled
                        ? "border-neutral-200 dark:border-neutral-800"
                        : "border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50"
                }
                hover:shadow-lg hover:ring-1 hover:ring-black/5 dark:hover:ring-white/5 hover:translate-y-[-2px]
                shadow-sm
            `}
        >
            {/* Floating Badge (Top Right) */}
            <div
                className={`
                    absolute -top-px -right-px z-10 px-2.5 py-1 rounded-bl-xl rounded-tr-2xl text-[9px] font-black uppercase tracking-wider select-none pointer-events-none transition-all duration-300 border-b border-l
                    ${
                        isEnabled
                            ? "border-neutral-100 dark:border-neutral-800"
                            : "border-transparent opacity-50"
                    }
                    ${badge.className}
                    opacity-70 group-hover:opacity-100
                `}
            >
                {badge.label}
            </div>

            {/* Main Content */}
            <div className="flex items-center p-4 gap-4">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-neutral-300 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-400 active:cursor-grabbing outline-none"
                >
                    <GripVertical size={20} />
                </div>

                {/* Content */}
                {children}
            </div>

            {/* Expanded Content */}
            {expandedContent}
        </div>
    );
};
