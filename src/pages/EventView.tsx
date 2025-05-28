
import React from 'react';
import { useEventData } from '@/hooks/useEventData';
import { useGreetingForm } from '@/hooks/useGreetingForm';
import EventHeader from '@/components/EventHeader';
import EventStats from '@/components/EventStats';
import GreetingForm from '@/components/GreetingForm';
import GreetingWall from '@/components/GreetingWall';
import EventError from '@/components/EventError';
import EventLoading from '@/components/EventLoading';

const EventView = () => {
  const { eventData, setEventData, loading, error, isRecipient, eventId, refetchEventData } = useEventData();
  const { greetingForm, imagePreview, submitting, handleInputChange, handleImageUpload, handleSubmit } = useGreetingForm();

  const getDaysLeft = () => {
    if (!eventData?.end_date) return null;
    const end = new Date(eventData.end_date);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getDisplayedGreetings = () => {
    if (!eventData?.greetings) return [];
    
    if (isRecipient) {
      return eventData.greetings.filter((greeting: any) => !greeting.is_recipient);
    } else {
      return eventData.greetings;
    }
  };

  const getTotalContributions = () => {
    return eventData?.totalContributions || 0;
  };

  const getContributorsCount = () => {
    const displayedGreetings = getDisplayedGreetings();
    return displayedGreetings.filter((g: any) => g.amount > 0).length;
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, eventData, setEventData, eventId, isRecipient, refetchEventData);
  };

  if (loading) {
    return <EventLoading />;
  }

  if (error) {
    return <EventError error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <EventHeader title={eventData.title} description={eventData.description} />

      <div className="container mx-auto px-4 py-8">
        <EventStats
          eventData={eventData}
          isRecipient={isRecipient}
          getDisplayedGreetings={getDisplayedGreetings}
          getTotalContributions={getTotalContributions}
          getContributorsCount={getContributorsCount}
          getDaysLeft={getDaysLeft}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <GreetingForm
              greetingForm={greetingForm}
              imagePreview={imagePreview}
              isRecipient={isRecipient}
              submitting={submitting}
              handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload}
              handleSubmit={onSubmit}
            />
          </div>

          <div>
            <GreetingWall
              greetings={getDisplayedGreetings()}
              isRecipient={isRecipient}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventView;
