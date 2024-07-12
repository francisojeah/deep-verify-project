import ContactUsSection from "../../components/ContactUsSection";
import DesktopScreen from "../../components/DesktopScreen";
import FAQSection from "../../components/FAQSection";
import FeaturesSection from "../../components/FeaturesSection";
import HeroSection from "../../components/HeroSection";
import HowItWorksSection from "../../components/HowItWorksSection";
import UseCasesSection from "../../components/UseCasesSection";
import GameSection from "../../components/GameSection";
import HomeBanner from "../../components/HomeBanner";
import PageLayout from "../../components/PageLayout";
import MetaTags from "../../components/MetaTags";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <PageLayout>
      <>
        <MetaTags />
        <div className="w-full flex flex-col gap-16">
          <Suspense fallback={null}>
            <HeroSection />
          </Suspense>
          <Suspense fallback={null}>
            <FeaturesSection />
          </Suspense>
          <Suspense fallback={null}>
            <DesktopScreen />
          </Suspense>
          <Suspense fallback={null}>
            <HowItWorksSection />
          </Suspense>
          <Suspense fallback={null}>
            <GameSection />
          </Suspense>
          <Suspense fallback={null}>
            <UseCasesSection />
          </Suspense>
          <Suspense fallback={null}>
            <FAQSection />
          </Suspense>
          <Suspense fallback={null}>
            <HomeBanner />
          </Suspense>
          <Suspense fallback={null}>
            <ContactUsSection />
          </Suspense>
        </div>
      </>
    </PageLayout>
  );
};

export default HomePage;
