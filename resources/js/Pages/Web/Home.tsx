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

interface HomeProps {
    featuredLandings: FeaturedLanding[];
}

export default function Home({ featuredLandings }: HomeProps) {
    return (
        <WebLayout title="Linkea - Todos tus enlaces en un solo lugar">
            {/* Hero + Stats */}
            <HeroSection landings={featuredLandings} />
            <StatsSection />

            {/* NEW: Features highlight from 2.0 - replaces PremiumAlertSection */}
            <FeaturesHighlightSection />

            {/* How it works - moved up after benefits */}
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
