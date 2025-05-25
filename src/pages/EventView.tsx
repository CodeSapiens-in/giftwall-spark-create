import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Gift, Heart, Upload, Calendar, Users, AlertCircle } from 'lucide-react';
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
          
          // Check if this is the recipient viewing the page
          // For now, we'll assume the recipient is viewing if there's a special query parameter
          // or if they're the first to view the event
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
        timestamp: new Date().toISOString(),
        isRecipient: isRecipient
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

  const getDaysLeft = () => {
    if (!eventData.endDate) return null;
    const end = new Date(eventData.endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Filter greetings based on whether this is recipient view
  const getDisplayedGreetings = () => {
    if (!eventData.greetings) return [];
    
    if (isRecipient) {
      // For recipient: show only greetings from others (not from recipient)
      return eventData.greetings.filter((greeting: any) => !greeting.isRecipient);
    } else {
      // For others: show all greetings
      return eventData.greetings;
    }
  };

  const getTotalContributions = () => {
    return eventData.totalContributions || 0;
  };

  const getContributorsCount = () => {
    const displayedGreetings = getDisplayedGreetings();
    return displayedGreetings.filter((g: any) => g.amount > 0).length;
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
        {/* Stats Section - Only show if there are contributions or for non-recipients */}
        {(getTotalContributions() > 0 || !isRecipient) && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 text-center">
                  {/* Only show total contributions if > 0 */}
                  {getTotalContributions() > 0 && (
                    <div>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Gift className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">Total Collected</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">₹{getTotalContributions()}</p>
                      <p className="text-sm text-gray-600">from contributions</p>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-700">Contributors</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {getContributorsCount()}
                    </p>
                    <p className="text-sm text-gray-600">people contributed</p>
                  </div>

                  {eventData.endDate && (
                    <div className={getTotalContributions() > 0 ? "md:col-span-2" : ""}>
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
                  <span>
                    {isRecipient ? 'Add Your Response' : 'Leave Your Greeting & Contribute'}
                  </span>
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
                      placeholder={isRecipient ? "Thank everyone for their wishes..." : "Write your heartfelt message..."}
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

                  {!isRecipient && (
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
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-full text-lg font-semibold transition-all duration-300"
                  >
                    {!isRecipient && greetingForm.amount && parseFloat(greetingForm.amount) > 0 
                      ? `Pay ₹${greetingForm.amount} with UPI & Add Greeting`
                      : isRecipient ? 'Add Response' : 'Add Greeting'
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
              <span>{isRecipient ? 'Messages for You' : 'Greeting Wall'}</span>
              <span className="text-lg font-normal text-gray-600">
                ({getDisplayedGreetings().length} messages)
              </span>
            </h2>
            
            <div className="space-y-6">
              {getDisplayedGreetings().length > 0 ? (
                getDisplayedGreetings().map((greeting: any) => (
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
        </div>
      </div>
    </div>
  );
};

export default EventView;
