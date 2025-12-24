import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

interface ImageCTASectionProps {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaHref?: string;
}

export default function ImageCTASection({
    title = "Tu marca, tu estilo",
    description = "Personaliza cada aspecto de tu Linkea para que refleje tu identidad unica.",
    ctaText = "Crear mi Linkea",
    ctaHref = "/auth/register",
}: ImageCTASectionProps) {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="relative w-full max-w-5xl mx-auto h-[280px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl group">
                    <img
                        src="/assets/images/girl-holding-phone.webp"
                        alt="Usuario usando Linkea"
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {title}
                                </h3>
                                <p className="text-white/80 text-lg max-w-md">
                                    {description}
                                </p>
                            </div>
                            <Link
                                href={ctaHref}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <span>{ctaText}</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

