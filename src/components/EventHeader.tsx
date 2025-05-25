
import React from 'react';
import { Gift } from 'lucide-react';

interface EventHeaderProps {
  title: string;
  description?: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({ title, description }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              GiftWall
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

export default EventHeader;
