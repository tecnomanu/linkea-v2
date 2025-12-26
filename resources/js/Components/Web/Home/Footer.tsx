import { Link } from "@inertiajs/react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#2d2d2d] text-white mt-0">
            {/* Animated Wave SVG - like legacy */}
            <div className="w-full overflow-hidden bg-white">
                <svg
                    className="wave-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <path
                            id="gentle-wave"
                            d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
                        />
                    </defs>
                    <g className="parallax1">
                        <use xlinkHref="#gentle-wave" x="50" y="3" fill="#f97316" />
                    </g>
                    <g className="parallax2">
                        <use xlinkHref="#gentle-wave" x="50" y="0" className="fill-brand-500" />
                    </g>
                    <g className="parallax3">
                        <use xlinkHref="#gentle-wave" x="50" y="9" className="fill-brand-600" />
                    </g>
                    <g className="parallax4">
                        <use xlinkHref="#gentle-wave" x="50" y="6" fill="#2d2d2d" />
                    </g>
                </svg>
            </div>

            {/* Inline styles for wave animation */}
            <style>{`
                .wave-svg {
                    display: block;
                    width: 100%;
                    height: 60px;
                    max-height: 60px;
                    margin: 0;
                }
                .parallax1 > use {
                    animation: move-forever1 10s linear infinite;
                    animation-delay: -2s;
                }
                .parallax2 > use {
                    animation: move-forever2 8s linear infinite;
                    animation-delay: -2s;
                }
                .parallax3 > use {
                    animation: move-forever3 6s linear infinite;
                    animation-delay: -2s;
                }
                .parallax4 > use {
                    animation: move-forever4 4s linear infinite;
                    animation-delay: -2s;
                }
                @keyframes move-forever1 {
                    0% { transform: translate(85px, 0%); }
                    100% { transform: translate(-90px, 0%); }
                }
                @keyframes move-forever2 {
                    0% { transform: translate(-90px, 0%); }
                    100% { transform: translate(85px, 0%); }
                }
                @keyframes move-forever3 {
                    0% { transform: translate(85px, 0%); }
                    100% { transform: translate(-90px, 0%); }
                }
                @keyframes move-forever4 {
                    0% { transform: translate(-90px, 0%); }
                    100% { transform: translate(85px, 0%); }
                }
            `}</style>

            {/* Main footer content */}
            <div className="container mx-auto px-4 pt-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                    {/* Nosotros - Takes more space */}
                    <div className="md:col-span-5">
                        <h4 className="font-bold text-lg mb-4 text-white">Nosotros</h4>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            La herramienta que te permite mostrar todos tus links en un solo lugar. 
                            Crea tu landing multi enlaces gratis ahora. Linkea es una herramienta 
                            gratuita que te permite crear paginas de destino con multiples enlaces. 
                            Simplemente, crea tu pagina, y agrega todos tus enlaces en un solo lugar.
                        </p>
                    </div>

                    {/* Sitio Web */}
                    <div className="md:col-span-3">
                        <h4 className="font-bold text-lg mb-4 text-white">Sitio Web</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-brand-500 transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="text-gray-400 hover:text-brand-500 transition-colors text-sm">
                                    Galeria
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:hola@linkea.ar" className="text-gray-400 hover:text-brand-500 transition-colors text-sm">
                                    Contactanos
                                </a>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-brand-500 transition-colors text-sm">
                                    Politicas de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link href="/sitemap" className="text-gray-400 hover:text-brand-500 transition-colors text-sm">
                                    Sitemap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Sistema */}
                    <div className="md:col-span-4">
                        <h4 className="font-bold text-lg mb-4 text-white">Sistema</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/auth/login" className="text-gray-400 hover:text-brand-500 transition-colors text-sm">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/register" className="text-gray-400 hover:text-brand-500 transition-colors text-sm">
                                    Registrarse
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/forgot-password" className="text-gray-400 hover:text-brand-500 transition-colors text-sm">
                                    Recuperar Contrasena
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-gray-500 text-sm">
                            Copyright © {currentYear} Todo los derechos reservados{" "}
                            <Link href="/" className="text-brand-500 hover:underline">
                                Linkea
                            </Link>
                            .
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://instagram.com/linkea.ar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-colors"
                                aria-label="Instagram"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a
                                href="https://facebook.com/linkea.ar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-colors"
                                aria-label="Facebook"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a
                                href="https://www.linkedin.com/company/linkea-ar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
