import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Wallet } from 'lucide-react';
import { Button } from '@/app/components/atoms/Button';
import { formatAddress } from '@/app/utils/formatters';

interface NavbarProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  walletAddress, 
  onConnectWallet,
  onDisconnectWallet
}) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/auctions', label: 'Auctions' },
    { path: '/create', label: 'Create', requiresWallet: true },
    { path: '/my-nfts', label: 'My NFTs', requiresWallet: true },
    { path: '/all-nfts', label: 'All NFTs' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled 
          ? 'py-3 backdrop-blur-xl bg-black/40 border-b border-purple-500/20 shadow-[0_8px_32px_rgba(139,92,246,0.15)]' 
          : 'py-5 bg-transparent'
        }
      `}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-purple-500 group-hover:text-cyan-400 transition-colors duration-300" />
              <div className="absolute inset-0 blur-xl bg-purple-500/30 group-hover:bg-cyan-400/30 transition-colors duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              NFT Marketplace
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const canAccess = !link.requiresWallet || walletAddress;
              
              return (
                <Link
                  key={link.path}
                  to={canAccess ? link.path : '#'}
                  className={`
                    relative text-sm transition-all duration-300
                    ${isActive(link.path)
                      ? 'text-purple-400'
                      : canAccess 
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 cursor-not-allowed'
                    }
                  `}
                  onClick={(e) => {
                    if (!canAccess) {
                      e.preventDefault();
                    }
                  }}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {walletAddress ? (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
                  <span className="text-sm text-purple-300">
                    {formatAddress(walletAddress)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDisconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onConnectWallet}
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
