
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Gift, Copy, Users, Heart, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ManageEvent = () => {
  const { manageId } = useParams();
  const [eventData, setEventData] = useState<any>(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    finalMessage: ''
  });
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Find event by manageId in localStorage
    const allKeys = Object.keys(localStorage);
    const eventKey = allKeys.find(key => {
      if (key.startsWith('event_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          return data.manageId === manageId;
        }
      }
      return false;
    });

    if (eventKey) {
      const stored = localStorage.getItem(eventKey);
      if (stored) {
        const data = JSON.parse(stored);
        setEventData(data);
        setEditData({
          title: data.title,
          description: data.description || '',
          finalMessage: data.finalMessage || ''
        });
        setIsClosed(data.isClosed || false);
      }
    }
  }, [manageId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    });
  };

  const handleSaveChanges = () => {
    if (eventData) {
      const updatedData = {
        ...eventData,
        title: editData.title,
        description: editData.description,
        finalMessage: editData.finalMessage,
        isClosed
      };
      localStorage.setItem(`event_${eventData.eventId}`, JSON.stringify(updatedData));
      setEventData(updatedData);
      toast({
        title: "Changes saved!",
        description: "Your event details have been updated.",
      });
    }
  };

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The management link you're using is invalid or the event doesn't exist.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/event/${eventData.eventId}`;
  const manageUrl = `${window.location.origin}/manage/${eventData.manageId}`;
  const totalContributions = eventData.contributions?.reduce((sum: number, contrib: any) => sum + (contrib.amount || 0), 0) || 0;
  const greetingsCount = eventData.greetings?.length || 0;

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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              Manage Event: {eventData.title}
            </h1>
            <p className="text-gray-600">Control your event settings and view contributions</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">₹{totalContributions}</h3>
                <p className="text-gray-600">Total Collected</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{greetingsCount}</h3>
                <p className="text-gray-600">Greetings Received</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{isClosed ? 'Closed' : 'Active'}</h3>
                <p className="text-gray-600">Event Status</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Quick Links */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-600">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Public Event URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={publicUrl} readOnly className="text-sm" />
                    <Button 
                      size="sm" 
                      onClick={() => copyToClipboard(publicUrl, "Public URL")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Management URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={manageUrl} readOnly className="text-sm" />
                    <Button 
                      size="sm" 
                      onClick={() => copyToClipboard(manageUrl, "Management URL")}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-600">Event Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Event Status</Label>
                    <p className="text-xs text-gray-500">Close event to stop new contributions</p>
                  </div>
                  <Switch 
                    checked={!isClosed} 
                    onCheckedChange={(checked) => setIsClosed(!checked)} 
                  />
                </div>
                <Link to={`/event/${eventData.eventId}`}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    View Public Page
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Edit Event Details */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-600">Edit Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">Event Title</Label>
                <Input
                  id="edit-title"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Event Description</Label>
                <Textarea
                  id="edit-description"
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="final-message" className="text-sm font-medium text-gray-700">Final Message for Receiver</Label>
                <Textarea
                  id="final-message"
                  value={editData.finalMessage}
                  onChange={(e) => setEditData(prev => ({ ...prev, finalMessage: e.target.value }))}
                  placeholder="Custom message to show with the final gift amount..."
                  rows={2}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleSaveChanges}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageEvent;
