
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface GreetingFormData {
  name: string;
  message: string;
  amount: string;
  image: File | null;
}

export const useGreetingForm = () => {
  const [greetingForm, setGreetingForm] = useState<GreetingFormData>({
    name: '',
    message: '',
    amount: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const resetForm = () => {
    setGreetingForm({ name: '', message: '', amount: '', image: null });
    setImagePreview(null);
  };

  const handleSubmit = (
    e: React.FormEvent,
    eventData: any,
    setEventData: (data: any) => void,
    eventId: string | undefined,
    isRecipient: boolean
  ) => {
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

      resetForm();

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

  return {
    greetingForm,
    imagePreview,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
    resetForm
  };
};
