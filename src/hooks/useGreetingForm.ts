
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GreetingFormData {
  name: string;
  message: string;
  amount: string;
  image: File | null;
}

const detectBrowserAndPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes('android');
  const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
  const isChrome = userAgent.includes('chrome');
  const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
  
  return { isAndroid, isIOS, isChrome, isSafari };
};

const generateUPIDeeplink = (upiId: string, amount: number, name: string) => {
  const { isAndroid, isIOS, isChrome } = detectBrowserAndPlatform();
  
  const params = new URLSearchParams({
    pa: upiId, // payee address
    am: amount.toString(), // amount
    tn: `Gift contribution ${name ? `from ${name}` : ''}`, // transaction note
    cu: 'INR' // currency
  });
  
  // For Android Chrome, use Intent URL to show app chooser
  if (isAndroid && isChrome) {
    const intentParams = new URLSearchParams({
      'S.pa': upiId,
      'S.am': amount.toString(),
      'S.tn': `Gift contribution ${name ? `from ${name}` : ''}`,
      'S.cu': 'INR'
    });
    
    return `intent://pay?${intentParams.toString()}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
  }
  
  // For iOS, use standard UPI scheme
  if (isIOS) {
    return `upi://pay?${params.toString()}`;
  }
  
  // For other browsers, use standard UPI scheme
  return `upi://pay?${params.toString()}`;
};

const openUPIApp = (upiLink: string, amount: number, upiId: string) => {
  const { isAndroid, isChrome } = detectBrowserAndPlatform();
  
  if (isAndroid && isChrome) {
    // For Android Chrome, try to open the intent URL
    try {
      window.location.href = upiLink;
    } catch (error) {
      // Fallback to regular UPI scheme if intent fails
      const fallbackParams = new URLSearchParams({
        pa: upiId,
        am: amount.toString(),
        tn: `Gift contribution`,
        cu: 'INR'
      });
      window.location.href = `upi://pay?${fallbackParams.toString()}`;
    }
  } else {
    // For other platforms, use direct link
    window.location.href = upiLink;
  }
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
    
    // Allow submission if user has either greeting content OR amount
    const hasGreeting = greetingForm.name.trim() || greetingForm.message.trim() || greetingForm.image;
    const hasAmount = greetingForm.amount && parseFloat(greetingForm.amount) > 0;
    
    if (!hasGreeting && !hasAmount) {
      toast({
        title: "Please provide input",
        description: "Either add a greeting message/image or specify an amount to contribute.",
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
          
          // Use browser-specific opening method
          openUPIApp(upiLink, amount, upiId);
          
          toast({
            title: "UPI Payment Initiated",
            description: `Opening UPI app for payment of ₹${amount}. If no app opens, please use any UPI app with ID: ${upiId}`,
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
