
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import GreetingCard from '@/components/GreetingCard';

interface GreetingWallProps {
  greetings: any[];
  isRecipient: boolean;
}

const GreetingWall: React.FC<GreetingWallProps> = ({ greetings, isRecipient }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Heart className="w-6 h-6 text-pink-600" />
        <span>{isRecipient ? 'Messages for You' : 'Greeting Wall'}</span>
        <span className="text-lg font-normal text-gray-600">
          ({greetings.length} messages)
        </span>
      </h2>
      
      <div className="space-y-6">
        {greetings.length > 0 ? (
          greetings.map((greeting: any) => (
            <GreetingCard key={greeting.id} greeting={greeting} />
          ))
        ) : (
          <Card className="bg-white/60 border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {isRecipient ? 'No messages yet!' : 'Be the first to leave a greeting!'}
              </h3>
              <p className="text-gray-500">
                {isRecipient 
                  ? 'Messages from your friends will appear here.'
                  : 'Your message will appear here for everyone to see.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GreetingWall;
