import Banner from '@/components/Banner';
import FeaturedDoctors from '@/components/FeaturedDoctors';
import Specializations from '@/components/Specializations';
import PlatformStats from '@/components/PlatformStats';
import SuccessStories from '@/components/SuccessStories';
import WhyChooseUs from '@/components/WhyChooseUs';

export const metadata = {
  title: 'MediCare Connect | Healthcare Management',
  description: 'Find and book verified doctors, manage appointments, and access quality healthcare online.',
};

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedDoctors />
      <Specializations />
      <PlatformStats />
      <SuccessStories />
      <WhyChooseUs />
    </div>
  );
}
