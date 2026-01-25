import React from 'react';
import { Creator } from '@/app/utils/mockData';
import { formatNumber } from '@/app/utils/formatters';
import { Badge } from '@/app/components/atoms/Badge';
import { Users } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
  rank?: number;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, rank }) => {
  return (
    <div className="relative group">
      <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_8px_32px_rgba(139,92,246,0.25)] transition-all duration-300">
        {/* Rank Badge */}
        {rank && (
          <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
            {rank}
          </div>
        )}

        {/* Creator Info */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img 
              src={creator.avatar} 
              alt={creator.name}
              className="w-20 h-20 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300"
            />
            {creator.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-background">
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-purple-400 transition-colors">
            {creator.name}
          </h3>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-purple-500/10">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
              <p className="text-lg font-bold text-foreground">
                {creator.totalSales} <span className="text-sm text-purple-400">ETH</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Followers</p>
              <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-cyan-400" />
                {formatNumber(creator.followers)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
