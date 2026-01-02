import SEOHead from "@/Components/Shared/SEOHead";
import FeaturesHighlightSection from "../../Components/Web/Home/FeaturesHighlightSection";
import FeaturesSection from "../../Components/Web/Home/FeaturesSection";
import HeroSection, {
    FeaturedLanding,
} from "../../Components/Web/Home/HeroSection";
import HowItWorksSection from "../../Components/Web/Home/HowItWorksSection";
import PreviewPagesSection from "../../Components/Web/Home/PreviewPagesSection";
import StatsSection from "../../Components/Web/Home/StatsSection";
import TestimonialsSection from "../../Components/Web/Home/TestimonialsSection";
import WebLayout from "../../Layouts/WebLayout";

interface Stats {
    landings: number;
    blocks: number;
    clicks: number;
}

interface HomeProps {
    featuredLandings: FeaturedLanding[];
    stats?: Stats;
}

export default function Home({ featuredLandings, stats }: HomeProps) {
    return (
        <WebLayout>
            {/* SEO for client-side navigation (server-side handled by withViewData in WebController) */}
            <SEOHead
                title="Linkea - Todos tus enlaces en un solo lugar | Link in Bio Argentina"
                description="Crea tu Linkea gratis en minutos: links, botones y diseño personalizable. Sin tarjeta, fácil de actualizar."
                canonical="/"
            />
            {/* Hero + Stats */}
            <HeroSection landings={featuredLandings} />
            <StatsSection stats={stats} />

            {/* NEW: Features highlight from 2.0 */}
            <FeaturesHighlightSection />

            {/* How it works */}
            <HowItWorksSection />

            {/* Social proof: community previews */}
            <PreviewPagesSection />

            {/* Available blocks */}
            <FeaturesSection />

            {/* Testimonials */}
            <TestimonialsSection />
        </WebLayout>
    );
}
