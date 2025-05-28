import type { IceCreamFlavor } from '@/types';
import FlavorCard from './FlavorCard';

interface FlavorListProps {
  flavors: IceCreamFlavor[];
}

export default function FlavorList({ flavors }: FlavorListProps) {
  if (!flavors || flavors.length === 0) {
    return <p>No flavors available at the moment. Check back soon!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {flavors.map(flavor => (
        <FlavorCard key={flavor.id} flavor={flavor} />
      ))}
    </div>
  );
}
