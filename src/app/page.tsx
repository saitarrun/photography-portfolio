import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { getLocationsData, getProfileData } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [locations, profile] = await Promise.all([
    getLocationsData(),
    getProfileData(),
  ]);

  const heroImage = locations[0]?.cover_image_url ?? undefined;

  return (
    <>
      <HeroSection imageUrl={heroImage} />

      {profile && <AboutSection profile={profile} />}

      <WorkSection locations={locations} />

      {profile && <ExperienceSection experiences={profile.experience as any[]} />}

      <ContactSection />
    </>
  );
}
