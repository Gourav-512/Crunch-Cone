import FlavorList from '@/components/flavors/FlavorList';
import FlavorRecommendations from '@/components/ai/FlavorRecommendations';
import { placeholderFlavors } from '@/lib/data';
import type { IceCreamFlavor } from '@/types';

// Simulate fetching data. In a real app, this would be an API call.
async function getFlavors(): Promise<IceCreamFlavor[]> {
  // Add a small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 100)); 
  return placeholderFlavors;
}

export default async function HomePage() {
  const flavors = await getFlavors();

  return (
    <div className="space-y-12">
      <section aria-labelledby="flavors-heading">
        <h1 id="flavors-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8 text-center">
          Our Delicious Flavors
        </h1>
        <FlavorList flavors={flavors} />
      </section>
      
      <section aria-labelledby="recommendations-heading">
        {/* FlavorRecommendations is a client component and will handle its own visibility */}
        <FlavorRecommendations />
      </section>
    </div>
  );
}
