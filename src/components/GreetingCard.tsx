
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Gift } from 'lucide-react';

interface Greeting {
  id: string;
  name: string;
  message: string;
  amount?: number;
  image?: string;
  timestamp: string;
}

interface GreetingCardProps {
  greeting: Greeting;
}

const GreetingCard: React.FC<GreetingCardProps> = ({ greeting }) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {greeting.name ? greeting.name.charAt(0).toUpperCase() : ''}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{greeting.name}</h3>
              <p className="text-sm text-gray-500">{formatDate(greeting.timestamp)}</p>
            </div>
          </div>
          
          {greeting.amount && greeting.amount > 0 && (
            <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <Gift className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">₹{greeting.amount}</span>
            </div>
          )}
        </div>

        {greeting.image && (
          <div className="mb-4">
            <img 
              src={greeting.image} 
              alt="Greeting attachment" 
              className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-300">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {greeting.message}
          </p>
        </div>

        <div className="flex items-center justify-end mt-4">
          <Heart className="w-4 h-4 text-pink-400 mr-1" />
          <span className="text-sm text-gray-500">Sent with love</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GreetingCard;
