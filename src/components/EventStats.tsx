
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, Calendar, Users } from 'lucide-react';

interface EventStatsProps {
  eventData: any;
  isRecipient: boolean;
  getDisplayedGreetings: () => any[];
  getTotalContributions: () => number;
  getContributorsCount: () => number;
  getDaysLeft: () => number | null;
}

const EventStats: React.FC<EventStatsProps> = ({
  eventData,
  isRecipient,
  getDisplayedGreetings,
  getTotalContributions,
  getContributorsCount,
  getDaysLeft
}) => {
  const totalContributions = getTotalContributions();
  const contributorsCount = getContributorsCount();
  const daysLeft = getDaysLeft();

  // Only show stats if there are contributions or for non-recipients
  if (totalContributions === 0 && isRecipient) {
    return null;
  }

  return (
    <div className="mb-8">
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 text-center">
            {/* Only show total contributions if > 0 */}
            {totalContributions > 0 && (
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-700">Total Collected</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">₹{totalContributions}</p>
                <p className="text-sm text-gray-600">from contributions</p>
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-700">Contributors</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {contributorsCount}
              </p>
              <p className="text-sm text-gray-600">people contributed</p>
            </div>

            {eventData.endDate && (
              <div className={totalContributions > 0 ? "md:col-span-2" : ""}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-700">Time Left</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {daysLeft} days
                </p>
                <p className="text-sm text-gray-600">until event ends</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventStats;
