export interface NFT {
  id: string;
  title: string;
  image: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  price: number;
  highestBid?: number;
  likes: number;
  auctionEndTime?: Date;
  category: string;
  blockchain: 'ethereum' | 'polygon' | 'solana';
  properties?: { trait: string; value: string }[];
  description?: string;
  history?: { event: string; from: string; to: string; price: number; date: Date }[];
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  totalSales: number;
  followers: number;
}

export const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'ArtMaster3000',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    verified: true,
    totalSales: 245.8,
    followers: 12400
  },
  {
    id: '2',
    name: 'CryptoPixel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    verified: true,
    totalSales: 189.3,
    followers: 9800
  },
  {
    id: '3',
    name: 'DigitalDreamer',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
    verified: true,
    totalSales: 156.7,
    followers: 7200
  },
  {
    id: '4',
    name: 'NFTWizard',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
    verified: false,
    totalSales: 98.4,
    followers: 5100
  }
];

export const mockNFTs: NFT[] = [
  {
    id: '1',
    title: 'Cosmic Dreams #001',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&h=500&fit=crop',
    creator: mockCreators[0],
    price: 2.5,
    highestBid: 2.3,
    likes: 342,
    auctionEndTime: new Date(Date.now() + 86400000 * 2), // 2 days from now
    category: 'Art',
    blockchain: 'ethereum',
    description: 'A stunning cosmic landscape that captures the beauty of the universe.',
    properties: [
      { trait: 'Background', value: 'Cosmic' },
      { trait: 'Rarity', value: 'Legendary' },
      { trait: 'Edition', value: '1/1' }
    ]
  },
  {
    id: '2',
    title: 'Neon Samurai',
    image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=500&h=500&fit=crop',
    creator: mockCreators[1],
    price: 1.8,
    highestBid: 1.6,
    likes: 289,
    auctionEndTime: new Date(Date.now() + 86400000 * 1), // 1 day from now
    category: 'Gaming',
    blockchain: 'ethereum',
    description: 'A cyberpunk warrior ready for battle in the metaverse.',
    properties: [
      { trait: 'Type', value: 'Character' },
      { trait: 'Class', value: 'Warrior' },
      { trait: 'Rarity', value: 'Epic' }
    ]
  },
  {
    id: '3',
    title: 'Abstract Emotion',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop',
    creator: mockCreators[2],
    price: 3.2,
    likes: 451,
    category: 'Art',
    blockchain: 'polygon',
    description: 'An abstract representation of human emotions through color and form.',
    properties: [
      { trait: 'Style', value: 'Abstract' },
      { trait: 'Mood', value: 'Energetic' },
      { trait: 'Palette', value: 'Vibrant' }
    ]
  },
  {
    id: '4',
    title: 'Digital Metropolis',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=500&fit=crop',
    creator: mockCreators[0],
    price: 4.1,
    highestBid: 3.9,
    likes: 567,
    auctionEndTime: new Date(Date.now() + 86400000 * 5), // 5 days from now
    category: 'Virtual Worlds',
    blockchain: 'ethereum',
    description: 'A futuristic cityscape in the digital realm.',
    properties: [
      { trait: 'Environment', value: 'Urban' },
      { trait: 'Time', value: 'Night' },
      { trait: 'Tech Level', value: 'Advanced' }
    ]
  },
  {
    id: '5',
    title: 'Ethereal Portrait',
    image: 'https://images.unsplash.com/photo-1635776062360-af423602aff3?w=500&h=500&fit=crop',
    creator: mockCreators[1],
    price: 2.9,
    likes: 398,
    category: 'Photography',
    blockchain: 'solana',
    description: 'A mesmerizing portrait that blends reality and fantasy.',
    properties: [
      { trait: 'Genre', value: 'Portrait' },
      { trait: 'Filter', value: 'Ethereal' },
      { trait: 'Mood', value: 'Mysterious' }
    ]
  },
  {
    id: '6',
    title: 'Geometric Vision',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=500&h=500&fit=crop',
    creator: mockCreators[3],
    price: 1.5,
    highestBid: 1.3,
    likes: 234,
    auctionEndTime: new Date(Date.now() + 86400000 * 3), // 3 days from now
    category: 'Art',
    blockchain: 'polygon',
    description: 'Exploring the beauty of geometric patterns and symmetry.',
    properties: [
      { trait: 'Style', value: 'Geometric' },
      { trait: 'Complexity', value: 'Medium' },
      { trait: 'Symmetry', value: 'Perfect' }
    ]
  },
  {
    id: '7',
    title: 'Futuristic Avatar',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&h=500&fit=crop',
    creator: mockCreators[2],
    price: 2.2,
    likes: 312,
    category: 'Gaming',
    blockchain: 'ethereum',
    description: 'Your next identity in the metaverse.',
    properties: [
      { trait: 'Type', value: 'Avatar' },
      { trait: 'Gender', value: 'Neutral' },
      { trait: 'Accessories', value: 'Tech Visor' }
    ]
  },
  {
    id: '8',
    title: 'Ocean Dreams',
    image: 'https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?w=500&h=500&fit=crop',
    creator: mockCreators[0],
    price: 3.7,
    highestBid: 3.5,
    likes: 489,
    auctionEndTime: new Date(Date.now() + 86400000 * 4), // 4 days from now
    category: 'Art',
    blockchain: 'ethereum',
    description: 'Dive into the depths of imagination with this aquatic masterpiece.',
    properties: [
      { trait: 'Theme', value: 'Ocean' },
      { trait: 'Color Palette', value: 'Blue & Teal' },
      { trait: 'Feeling', value: 'Serene' }
    ]
  }
];

export const categories = [
  'All',
  'Art',
  'Gaming',
  'Photography',
  'Virtual Worlds',
  'Music',
  'Collectibles'
];

export const blockchains = [
  'All',
  'Ethereum',
  'Polygon',
  'Solana'
];

export const saleTypes = [
  'All',
  'Buy Now',
  'Auction',
  'New'
];
