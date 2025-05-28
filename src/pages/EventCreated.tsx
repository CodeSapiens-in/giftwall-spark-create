
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Copy, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EventCreated = () => {
  const { eventId, manageId } = useParams();
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const publicUrl = `${window.location.origin}/event/${eventId}`;
  const manageUrl = `${window.location.origin}/manage/${manageId}`;

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('event_id', eventId)
            .single();

          if (error) {
            console.error('Error fetching event:', error);
            toast({
              title: "Error",
              description: "Failed to load event details.",
              variant: "destructive"
            });
          } else {
            setEventData(data);
          }
        } catch (err) {
          console.error('Error fetching event:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [eventId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return <div>Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              GiftWall
            </h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              🎉 Your Event Page is Ready!
            </h1>
            <p className="text-xl text-gray-600">
              Share your event link and start collecting beautiful messages and contributions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Public Share Link */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-600">
                  <ExternalLink className="w-5 h-5" />
                  <span>Share This Link</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">Send this link to your friends and family so they can leave greetings and contribute:</p>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-sm font-mono break-all text-gray-800">{publicUrl}</p>
                </div>
                <Button 
                  onClick={() => copyToClipboard(publicUrl, "Public link")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Share Link
                </Button>
              </CardContent>
            </Card>

            {/* Management Link */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg ring-2 ring-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Management Link</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-semibold text-sm mb-2">⚠️ IMPORTANT: Save this link!</p>
                  <p className="text-orange-700 text-sm">This is the only way to manage your event. Bookmark it or save it somewhere safe.</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-sm font-mono break-all text-gray-800">{manageUrl}</p>
                </div>
                <Button 
                  onClick={() => copyToClipboard(manageUrl, "Management link")}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Management Link
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/event/${eventId}`}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full transition-all duration-300">
                View Your Public Event Page
              </Button>
            </Link>
            <Link to={`/manage/${manageId}`}>
              <Button size="lg" variant="outline" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full transition-all duration-300">
                Go to Management Page
              </Button>
            </Link>
          </div>

          {/* Event Summary */}
          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-purple-100">
            <CardHeader>
              <CardTitle className="text-gray-800">Event Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Event Title</h3>
                  <p className="text-gray-600">{eventData.title}</p>
                </div>
                {eventData.description && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
                    <p className="text-gray-600">{eventData.description}</p>
                  </div>
                )}
                {eventData.target_amount && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Target Amount</h3>
                    <p className="text-gray-600">₹{eventData.target_amount}</p>
                  </div>
                )}
                {eventData.end_date && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">End Date</h3>
                    <p className="text-gray-600">{new Date(eventData.end_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventCreated;
