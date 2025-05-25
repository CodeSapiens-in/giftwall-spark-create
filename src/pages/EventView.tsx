
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Gift, Heart, Upload, Calendar, Target, Users, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GreetingCard from '@/components/GreetingCard';

const EventView = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greetingForm, setGreetingForm] = useState({
    name: '',
    message: '',
    amount: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

        // Add a timeout to prevent infinite loading
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
  }, [eventId]);

  const handleInputChange = (field: string, value: string) => {
    setGreetingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGreetingForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!greetingForm.name.trim() || !greetingForm.message.trim()) {
      toast({
        title: "Please fill required fields",
        description: "Name and message are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newGreeting = {
        id: Date.now().toString(),
        name: greetingForm.name,
        message: greetingForm.message,
        amount: greetingForm.amount ? parseFloat(greetingForm.amount) : 0,
        image: imagePreview,
        timestamp: new Date().toISOString()
      };

      const updatedEvent = {
        ...eventData,
        greetings: [...(eventData.greetings || []), newGreeting],
        totalContributions: (eventData.totalContributions || 0) + (newGreeting.amount || 0)
      };

      localStorage.setItem(`event_${eventId}`, JSON.stringify(updatedEvent));
      setEventData(updatedEvent);

      // Reset form
      setGreetingForm({ name: '', message: '', amount: '', image: null });
      setImagePreview(null);

      // Simulate UPI payment flow
      if (greetingForm.amount && parseFloat(greetingForm.amount) > 0) {
        toast({
          title: "UPI Payment Initiated",
          description: `Opening UPI app for payment of ₹${greetingForm.amount}...`,
        });
      } else {
        toast({
          title: "Greeting Added!",
          description: "Your message has been added to the greeting wall.",
        });
      }
    } catch (err) {
      console.error('Error submitting greeting:', err);
      toast({
        title: "Error",
        description: "Failed to add your greeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const calculateProgress = () => {
    if (!eventData.targetAmount) return 0;
    return Math.min((eventData.totalContributions || 0) / parseFloat(eventData.targetAmount) * 100, 100);
  };

  const getDaysLeft = () => {
    if (!eventData.endDate) return null;
    const end = new Date(eventData.endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Header */}
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
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unable to Load Event</AlertTitle>
              <AlertDescription className="mt-2">
                {error}
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">Event Not Available</h1>
              <p className="text-gray-600">
                We couldn't load the event you're looking for. This could be because:
              </p>
              <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                <li>• The event link is incorrect or expired</li>
                <li>• The event has been deleted</li>
                <li>• There's a temporary issue with loading the data</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <span>Try Again</span>
                </Button>
                <Link to="/">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Create New Event
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
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
              {eventData.title}
            </h1>
            {eventData.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {eventData.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Section */}
        {(eventData.targetAmount || eventData.endDate) && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  {eventData.targetAmount && (
                    <div>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">Target</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">₹{eventData.targetAmount}</p>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress()}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        ₹{eventData.totalContributions || 0} collected ({calculateProgress().toFixed(0)}%)
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-700">Contributors</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {eventData.greetings?.filter((g: any) => g.amount > 0).length || 0}
                    </p>
                    <p className="text-sm text-gray-600">people contributed</p>
                  </div>

                  {eventData.endDate && (
                    <div>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">Time Left</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {getDaysLeft()} days
                      </p>
                      <p className="text-sm text-gray-600">until event ends</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contribution Form */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-600">
                  <Heart className="w-6 h-6" />
                  <span>Leave Your Greeting & Contribute</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={greetingForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message *</Label>
                    <Textarea
                      id="message"
                      value={greetingForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Write your heartfelt message..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Upload an Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="image" className="cursor-pointer">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="mx-auto max-h-32 rounded-lg" />
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-600">Click to upload a photo</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Contribution Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={greetingForm.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="Enter amount (optional)"
                      min="0"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-full text-lg font-semibold transition-all duration-300"
                  >
                    {greetingForm.amount && parseFloat(greetingForm.amount) > 0 
                      ? `Pay ₹${greetingForm.amount} with UPI & Add Greeting`
                      : 'Add Greeting'
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Greeting Wall */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-600" />
              <span>Greeting Wall</span>
              <span className="text-lg font-normal text-gray-600">
                ({eventData.greetings?.length || 0} messages)
              </span>
            </h2>
            
            <div className="space-y-6">
              {eventData.greetings && eventData.greetings.length > 0 ? (
                eventData.greetings.map((greeting: any) => (
                  <GreetingCard key={greeting.id} greeting={greeting} />
                ))
              ) : (
                <Card className="bg-white/60 border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Be the first to leave a greeting!
                    </h3>
                    <p className="text-gray-500">
                      Your message will appear here for everyone to see.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventView;
