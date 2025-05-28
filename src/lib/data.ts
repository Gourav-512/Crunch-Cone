import type { IceCreamFlavor } from '@/types';

export const placeholderFlavors: IceCreamFlavor[] = [
  {
    id: '1',
    name: 'Vanilla Bean Bliss',
    description: 'Classic rich vanilla bean ice cream, smooth and creamy.',
    price: 4.99,
    image: 'https://placehold.co/600x400.png',
    category: 'Cups',
    rating: 4.5,
    stock: 100,
  },
  {
    id: '2',
    name: 'Chocolate Decadence',
    description: 'Deep, dark chocolate indulgence for true chocoholics.',
    price: 5.49,
    image: 'https://placehold.co/600x400.png',
    category: 'Cups',
    rating: 4.8,
    stock: 80,
  },
  {
    id: '3',
    name: 'Strawberry Swirl Sensation',
    description: 'Sweet strawberries swirled into creamy goodness.',
    price: 5.29,
    image: 'https://placehold.co/600x400.png',
    category: 'Tricone',
    rating: 4.6,
    stock: 90,
  },
  {
    id: '4',
    name: 'Minty Choco Chip',
    description: 'Refreshing mint ice cream with generous chocolate chips.',
    price: 5.49,
    image: 'https://placehold.co/600x400.png',
    category: 'Tubs',
    rating: 4.7,
    stock: 70,
  },
  {
    id: '5',
    name: 'Caramel Crunch Delight',
    description: 'Smooth caramel ice cream with crunchy toffee pieces.',
    price: 5.99,
    image: 'https://placehold.co/600x400.png',
    category: 'Jumbo Cups',
    rating: 4.9,
    stock: 60,
  },
  {
    id: '6',
    name: 'Cookies & Cream Dream',
    description: 'Classic cookies and cream, a fan favorite.',
    price: 5.49,
    image: 'https://placehold.co/600x400.png',
    category: 'Packs',
    rating: 4.7,
    stock: 120,
  },
  {
    id: '7',
    name: 'Peanut Butter Passion',
    description: 'Creamy peanut butter ice cream with chocolate swirls.',
    price: 5.79,
    image: 'https://placehold.co/600x400.png',
    category: 'Sticks',
    rating: 4.6,
    stock: 50,
  },
  {
    id: '8',
    name: 'Mango Tango Sorbet',
    description: 'Refreshing and tangy mango sorbet, dairy-free.',
    price: 4.99,
    image: 'https://placehold.co/600x400.png',
    category: 'Cups',
    rating: 4.4,
    stock: 75,
  },
];

// Add data-ai-hint to images in placeholderFlavors
placeholderFlavors.forEach(flavor => {
  const hint = flavor.name.toLowerCase().split(' ')[0] + " icecream"; // e.g., "vanilla icecream"
  flavor.image = `${flavor.image}?data-ai-hint=${encodeURIComponent(hint.substring(0,20))}`;
});
