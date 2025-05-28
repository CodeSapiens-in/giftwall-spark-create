
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useEventData = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecipient, setIsRecipient] = useState(false);

  const fetchEventData = async () => {
    if (!eventId) {
      setError('Invalid event URL. Event ID is missing.');
      setLoading(false);
      return;
    }

    try {
      // Fetch event details
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (eventError) {
        if (eventError.code === 'PGRST116') {
          setError('Event not found. The event may have been deleted or the link is incorrect.');
        } else {
          setError('Failed to load event. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Fetch greetings for this event
      const { data: greetings, error: greetingsError } = await supabase
        .from('greetings')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (greetingsError) {
        console.error('Error fetching greetings:', greetingsError);
        // Continue with event data even if greetings fail
      }

      // Calculate total contributions
      const totalContributions = greetings?.reduce((sum, greeting) => sum + (greeting.amount || 0), 0) || 0;

      const eventWithGreetings = {
        ...event,
        greetings: greetings || [],
        totalContributions
      };

      setEventData(eventWithGreetings);
      
      // Check if user is recipient
      const urlParams = new URLSearchParams(window.location.search);
      const recipientView = urlParams.get('recipient') === 'true';
      setIsRecipient(recipientView);
      
    } catch (err) {
      console.error('Error loading event:', err);
      setError('An unexpected error occurred while loading the event.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const refetchEventData = () => {
    setLoading(true);
    setError(null);
    fetchEventData();
  };

  return {
    eventData,
    setEventData,
    loading,
    error,
    isRecipient,
    eventId,
    refetchEventData
  };
};
