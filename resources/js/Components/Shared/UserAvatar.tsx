import React from "react";

interface UserAvatarProps {
    avatar?: string;
    avatarThumb?: string; // Thumbnail version (128x128) for better performance
    name?: string;
    size?: "sm" | "md" | "lg";
    variant?: "panel" | "admin";
    className?: string;
}

const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
};

const variantClasses = {
    panel: {
        border: "border-brand-500/20",
        bg: "bg-brand-100 dark:bg-brand-500/20",
        text: "text-brand-600 dark:text-brand-400",
    },
    admin: {
        border: "border-red-500/20",
        bg: "bg-red-100 dark:bg-red-500/20",
        text: "text-red-600 dark:text-red-400",
    },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
    avatar,
    avatarThumb,
    name,
    size = "sm",
    variant = "panel",
    className = "",
}) => {
    const sizeClass = sizeClasses[size];
    const variantClass = variantClasses[variant];

    // Use thumbnail if available, otherwise fall back to full avatar
    const imageSrc = avatarThumb || avatar;

    return (
        <div
            className={`rounded-full overflow-hidden border-2 ${variantClass.border} flex-shrink-0 ${sizeClass} ${className}`}
        >
            {imageSrc ? (
                <img
                    src={imageSrc}
                    alt={name || "User"}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div
                    className={`w-full h-full ${variantClass.bg} flex items-center justify-center ${variantClass.text} font-bold`}
                >
                    {name?.charAt(0).toUpperCase() || "U"}
                </div>
            )}
        </div>
    );
};
