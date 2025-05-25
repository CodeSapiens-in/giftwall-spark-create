
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const useEventData = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecipient, setIsRecipient] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!eventId) {
          setError('Invalid event URL. Event ID is missing.');
          setLoading(false);
          return;
        }

        const timeoutId = setTimeout(() => {
          if (loading) {
            setError('Loading timeout. Please try refreshing the page.');
            setLoading(false);
          }
        }, 5000);

        const stored = localStorage.getItem(`event_${eventId}`);
        
        if (!stored) {
          setError('Event not found. The event may have been deleted or the link is incorrect.');
          setLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        try {
          const parsedData = JSON.parse(stored);
          if (!parsedData || !parsedData.title) {
            setError('Event data is corrupted. Please contact the event organizer.');
            setLoading(false);
            clearTimeout(timeoutId);
            return;
          }
          
          setEventData(parsedData);
          
          const urlParams = new URLSearchParams(window.location.search);
          const recipientView = urlParams.get('recipient') === 'true';
          setIsRecipient(recipientView);
          
        } catch (parseError) {
          console.error('Error parsing event data:', parseError);
          setError('Unable to load event data. The data may be corrupted.');
        }

        clearTimeout(timeoutId);
        setLoading(false);
      } catch (err) {
        console.error('Error loading event:', err);
        setError('An unexpected error occurred while loading the event.');
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, loading]);

  return {
    eventData,
    setEventData,
    loading,
    error,
    isRecipient,
    eventId
  };
};
