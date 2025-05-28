
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GreetingFormData {
  name: string;
  message: string;
  amount: string;
  image: File | null;
}

const generateUPIDeeplink = (upiId: string, amount: number, name: string) => {
  const params = new URLSearchParams({
    pa: upiId, // payee address
    am: amount.toString(), // amount
    tn: `Gift contribution ${name ? `from ${name}` : ''}`, // transaction note
    cu: 'INR' // currency
  });
  
  return `upi://pay?${params.toString()}`;
};

export const useGreetingForm = () => {
  const [greetingForm, setGreetingForm] = useState<GreetingFormData>({
    name: '',
    message: '',
    amount: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (
    e: React.FormEvent,
    eventData: any,
    setEventData: (data: any) => void,
    eventId: string | undefined,
    isRecipient: boolean,
    refetchEventData?: () => void
  ) => {
    e.preventDefault();
    
    // Validate that at least one field is filled or amount is provided
    const hasGreeting = greetingForm.name.trim() || greetingForm.message.trim();
    const hasAmount = greetingForm.amount && parseFloat(greetingForm.amount) > 0;
    
    if (!hasGreeting && !hasAmount) {
      toast({
        title: "Please provide input",
        description: "Either add a greeting message or specify an amount to contribute.",
        variant: "destructive"
      });
      return;
    }

    if (!eventId) {
      toast({
        title: "Error",
        description: "Event ID is missing.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Insert greeting into database
      const { error } = await supabase
        .from('greetings')
        .insert({
          event_id: eventId,
          name: greetingForm.name.trim() || null,
          message: greetingForm.message.trim() || null,
          amount: greetingForm.amount ? parseFloat(greetingForm.amount) : 0,
          image_url: imagePreview || null,
          is_recipient: isRecipient
        });

      if (error) {
        console.error('Error submitting greeting:', error);
        toast({
          title: "Error",
          description: "Failed to add your greeting. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Handle UPI payment if amount is provided and user is not the recipient
      if (!isRecipient && greetingForm.amount && parseFloat(greetingForm.amount) > 0) {
        const amount = parseFloat(greetingForm.amount);
        const upiId = eventData.upi_id;
        
        if (upiId) {
          const upiLink = generateUPIDeeplink(upiId, amount, greetingForm.name);
          
          // Try to open UPI app
          window.location.href = upiLink;
          
          toast({
            title: "UPI Payment Initiated",
            description: `Opening UPI app for payment of ₹${amount} to ${upiId}`,
          });
        } else {
          toast({
            title: "UPI ID not found",
            description: "Unable to process payment. UPI ID is missing.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Greeting Added!",
          description: hasGreeting ? "Your message has been added to the greeting wall." : "Your contribution has been recorded.",
        });
      }

      // Refresh the event data
      if (refetchEventData) {
        refetchEventData();
      }

      resetForm();
    } catch (err) {
      console.error('Error submitting greeting:', err);
      toast({
        title: "Error",
        description: "Failed to add your greeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    greetingForm,
    imagePreview,
    submitting,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
    resetForm
  };
};
