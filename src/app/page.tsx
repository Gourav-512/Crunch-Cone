import FlavorList from '@/components/flavors/FlavorList';
import FlavorRecommendations from '@/components/ai/FlavorRecommendations';
import { placeholderFlavors } from '@/lib/data';
import type { IceCreamFlavor } from '@/types';
import { Separator } from '@/components/ui/separator';

// Simulate fetching data. In a real app, this would be an API call.
async function getFlavors(): Promise<IceCreamFlavor[]> {
  // Add a small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 100)); 
  return placeholderFlavors;
}

interface GroupedFlavors {
  [category: string]: IceCreamFlavor[];
}

export default async function HomePage() {
  const flavors = await getFlavors();

  const groupedFlavors = flavors.reduce((acc, flavor) => {
    const category = flavor.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(flavor);
    return acc;
  }, {} as GroupedFlavors);

  const categoryOrder = ['Cups', 'Cones', 'Sticks', 'Sorbets', 'Tubs', 'Family Packs', 'Uncategorized'];
  
  // Filter out empty categories and sort them
  const sortedCategories = categoryOrder.filter(cat => groupedFlavors[cat] && groupedFlavors[cat].length > 0);
  if (!groupedFlavors['Uncategorized'] || groupedFlavors['Uncategorized'].length === 0) {
    const uncategorizedIndex = sortedCategories.indexOf('Uncategorized');
    if (uncategorizedIndex > -1) {
      sortedCategories.splice(uncategorizedIndex, 1);
    }
  }


  return (
    <div className="space-y-12">
      <section aria-labelledby="flavors-main-heading">
        <h1 id="flavors-main-heading" className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-10 text-center">
          Discover Our Delicious Ice Creams
        </h1>
        <p className="text-center text-lg text-muted-foreground mb-12">
          Handcrafted flavors for every craving. Explore by category!
        </p>
      </section>

      {sortedCategories.map((category, index) => (
        <section key={category} aria-labelledby={`category-heading-${category.toLowerCase().replace(/\s+/g, '-')}`}>
          <h2 
            id={`category-heading-${category.toLowerCase().replace(/\s+/g, '-')}`} 
            className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-6"
          >
            {category}
          </h2>
          <FlavorList flavors={groupedFlavors[category]} />
          {index < sortedCategories.length - 1 && <Separator className="my-12 h-px bg-border/50" />}
        </section>
      ))}
      
      <section aria-labelledby="recommendations-heading" className="mt-16">
         <Separator className="my-12 h-px bg-border/50" />
        {/* FlavorRecommendations is a client component and will handle its own visibility */}
        <FlavorRecommendations />
      </section>
    </div>
  );
}
