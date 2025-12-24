import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
    const testimonials = [
        {
            image: "https://linkea.s3.sa-east-1.amazonaws.com/logos/thumb_6385efd9955e52588e047876_1669722969.png",
            text: "Tenemos todos los enlaces en un solo lugar y con la estética personalizada, acorde a la identidad institucional. Un lujo, definitivamente lo recomendaría a cualquiera que necesite crear landings de manera rápida y sencilla!",
            author: "Hindu Club CBA",
            username: "@hinduclub",
            link: "https://linkea.ar/hinduclub",
        },
        {
            image: "https://linkea.s3.sa-east-1.amazonaws.com/logos/thumb_60e9f5d4d795d57dae628174_1665578164.png",
            text: "Estuve utilizando Linkea durante unos meses y realmente me asombra lo fácil que es de usar. Antes tenía que utilizar varias herramientas para lograr lo que Linkea me permite hacer en un solo lugar. 100% Recomendable!",
            author: "Gonzalo Banchero",
            username: "@gonbanchero",
            link: "https://linkea.ar/gonbanchero",
        },
        {
            image: "https://linkea.s3.sa-east-1.amazonaws.com/logos/thumb_6283c9bb0368741be85f89c4_1652806085.png",
            text: "Linkea es increíble! Me facilito mucho la tarea de crear mi bio landing. Ahora puedo compartir un solo link y mandar mis redes y WhatsApp todo junto. Recomendaría este sistema a cualquiera que necesite crear su bio landing con facilidad!",
            author: "Manuel Bruna",
            username: "@manubrunia",
            link: "https://linkea.ar/manubrunia",
        },
        {
            image: "https://linkea.s3.sa-east-1.amazonaws.com/logos/thumb_63aa71a85b7f19bc770d79a7_1672155632.png",
            text: "Es una herramienta muy útil para cualquiera que necesite crear landings con contenido multimedia. Ha simplificado mucho mi trabajo y me ha permitido hacerlo de manera más eficiente. Sin duda la recomendaría a cualquiera!",
            author: "Decoparadiseve",
            username: "@decoparadiseve",
            link: "https://linkea.ar/decoparadiseve",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isHovered, testimonials.length]);

    return (
        <section
            className="py-16 bg-white overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-4">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
                    Esto dicen nuestros usuarios
                </h2>

                {/* Carousel Container */}
                <div className="relative max-w-3xl mx-auto">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {testimonials.map((testimonial, idx) => (
                                <div
                                    key={idx}
                                    className="w-full flex-shrink-0 px-4"
                                >
                                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row items-start gap-5">
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.author}
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=ef5844&color=fff`;
                                                    }}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <Quote className="w-6 h-6 text-brand-500/30 mb-2" />
                                                <p className="text-gray-700 text-base leading-relaxed mb-4">
                                                    {testimonial.text}
                                                </p>

                                                {/* Author */}
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900 text-sm">
                                                        {testimonial.author}
                                                    </span>
                                                    <a
                                                        href={testimonial.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 text-sm hover:text-brand-500 transition-colors"
                                                    >
                                                        {testimonial.username}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() =>
                            setCurrentIndex((prev) =>
                                prev === 0 ? testimonials.length - 1 : prev - 1
                            )
                        }
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-brand-500 transition-colors"
                        aria-label="Anterior"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() =>
                            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-brand-500 transition-colors"
                        aria-label="Siguiente"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dots indicator - Same style as PreviewPagesSection */}
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                idx === currentIndex
                                    ? "bg-brand-500 w-6"
                                    : "bg-gray-300 hover:bg-gray-400 w-2"
                            }`}
                            aria-label={`Ir al testimonio ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
