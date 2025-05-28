
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Upload } from 'lucide-react';

interface GreetingFormProps {
  greetingForm: {
    name: string;
    message: string;
    amount: string;
    image: File | null;
  };
  imagePreview: string | null;
  isRecipient: boolean;
  submitting?: boolean;
  handleInputChange: (field: string, value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const GreetingForm: React.FC<GreetingFormProps> = ({
  greetingForm,
  imagePreview,
  isRecipient,
  submitting = false,
  handleInputChange,
  handleImageUpload,
  handleSubmit
}) => {
  const hasGreeting = greetingForm.name.trim() || greetingForm.message.trim();
  const hasAmount = greetingForm.amount && parseFloat(greetingForm.amount) > 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-purple-600">
          <Heart className="w-6 h-6" />
          <span>
            {isRecipient ? 'Add Your Response' : 'Leave Your Greeting & Contribute'}
          </span>
        </CardTitle>
        {!isRecipient && (
          <p className="text-sm text-gray-600">
            You can add a greeting message, contribute money, or both!
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={greetingForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              value={greetingForm.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={isRecipient ? "Thank everyone for their wishes..." : "Write your heartfelt message..."}
              rows={4}
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
                placeholder="Enter amount"
                min="0"
              />
              {greetingForm.amount && parseFloat(greetingForm.amount) > 0 && (
                <p className="text-sm text-gray-600">
                  UPI payment will open after submitting
                </p>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-full text-lg font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 
              !isRecipient && hasAmount && !hasGreeting 
                ? `Pay ₹${greetingForm.amount} with UPI`
                : !isRecipient && hasAmount && hasGreeting
                ? `Pay ₹${greetingForm.amount} with UPI & Add Greeting`
                : isRecipient ? 'Add Response' : 'Add Greeting'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GreetingForm;
