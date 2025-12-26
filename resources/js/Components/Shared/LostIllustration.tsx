/**
 * Lost Illustration - SVG of a person looking lost/confused
 * Used in 404 page and other error states
 */

interface LostIllustrationProps {
    className?: string;
}

export function LostIllustration({ className = "" }: LostIllustrationProps) {
    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Background Circle */}
            <circle cx="100" cy="100" r="90" fill="currentColor" fillOpacity="0.05" />
            <circle cx="100" cy="100" r="70" fill="currentColor" fillOpacity="0.05" />
            
            {/* Person Body */}
            <ellipse cx="100" cy="165" rx="25" ry="8" fill="currentColor" fillOpacity="0.1" />
            
            {/* Legs */}
            <path
                d="M90 140 L85 160 L82 160"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M110 140 L115 160 L118 160"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            
            {/* Body */}
            <path
                d="M85 100 Q100 110 115 100 L112 140 L88 140 Z"
                fill="currentColor"
                fillOpacity="0.2"
            />
            
            {/* Arms */}
            <path
                d="M85 105 L60 120 L55 115"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M115 105 L140 120 L145 115"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            
            {/* Head */}
            <circle cx="100" cy="70" r="28" fill="currentColor" fillOpacity="0.15" />
            <circle cx="100" cy="70" r="25" fill="white" stroke="currentColor" strokeWidth="2" />
            
            {/* Hair */}
            <path
                d="M78 55 Q80 45 90 42 Q100 38 110 42 Q120 45 122 55"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M75 60 Q75 50 85 45"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            
            {/* Eyes - Confused look */}
            <circle cx="90" cy="68" r="4" fill="currentColor" />
            <circle cx="110" cy="68" r="4" fill="currentColor" />
            
            {/* Eyebrows - One raised */}
            <path
                d="M84 60 Q90 57 96 60"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M104 58 Q110 55 116 58"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            
            {/* Mouth - Confused */}
            <path
                d="M92 82 Q100 80 108 82"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            
            {/* Question marks floating around */}
            <text
                x="45"
                y="55"
                fontSize="20"
                fill="currentColor"
                fillOpacity="0.4"
                fontFamily="sans-serif"
                fontWeight="bold"
            >
                ?
            </text>
            <text
                x="150"
                y="50"
                fontSize="16"
                fill="currentColor"
                fillOpacity="0.3"
                fontFamily="sans-serif"
                fontWeight="bold"
            >
                ?
            </text>
            <text
                x="55"
                y="95"
                fontSize="14"
                fill="currentColor"
                fillOpacity="0.25"
                fontFamily="sans-serif"
                fontWeight="bold"
            >
                ?
            </text>
            <text
                x="140"
                y="90"
                fontSize="18"
                fill="currentColor"
                fillOpacity="0.35"
                fontFamily="sans-serif"
                fontWeight="bold"
            >
                ?
            </text>
            
            {/* Map/paper in hand */}
            <rect
                x="48"
                y="108"
                width="15"
                height="12"
                rx="1"
                fill="white"
                stroke="currentColor"
                strokeWidth="1.5"
                transform="rotate(-15 55 114)"
            />
            <line
                x1="51"
                y1="112"
                x2="60"
                y2="110"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.5"
            />
            <line
                x1="52"
                y1="116"
                x2="61"
                y2="114"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.5"
            />
        </svg>
    );
}

