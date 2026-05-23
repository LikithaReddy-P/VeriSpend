import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeatureCards } from "@/components/landing/feature-cards";
import { AuditPreview } from "@/components/landing/audit-preview";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <FeatureCards />
        <AuditPreview />
      </main>
      <Footer />
    </>
  );
}
