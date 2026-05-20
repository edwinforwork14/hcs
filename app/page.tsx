import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { SolutionsSection } from "@/components/solutions-section"
import { WhyHCSSection } from "@/components/why-hcs-section"
import { SocialSection } from "@/components/social-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <SolutionsSection />
      <WhyHCSSection />
      <SocialSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
