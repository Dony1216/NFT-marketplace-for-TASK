import React from 'react';
import { Sparkles, Mail, Twitter, Github, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-purple-500/10 bg-black/20 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                NFT Marketplace
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              The premier destination for discovering, collecting, and selling extraordinary NFTs. 
              Join the future of digital ownership.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/5 border border-purple-500/20 flex items-center justify-center hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-300"
              >
                <Twitter className="w-4 h-4 text-purple-400" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/5 border border-purple-500/20 flex items-center justify-center hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 text-purple-400" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/5 border border-purple-500/20 flex items-center justify-center hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-300"
              >
                <Github className="w-4 h-4 text-purple-400" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Marketplace</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/all-nfts" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  All NFTs
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/auctions" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Create NFT
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-purple-500/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 NFT Marketplace. Built with passion for the Web3 community.
            </p>
            <a 
              href="mailto:contact@nftmarketplace.com" 
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              contact@nftmarketplace.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
