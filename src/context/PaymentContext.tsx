// PaymentContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface PaymentContextType {
  orderId: string;
  setOrderId: (orderId: string) => void;
  merchantId: string;
  setMerchantId: (merchantId: string) => void;
  customerId: string;
  setCustomerId: (customerId: string) => void;
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  secretKey: string;
  setSecretKey: (secretKey: string) => void;
  // Add other properties here as needed
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [orderId, setOrderId] = useState<string>('');
  const [merchantId, setMerchantId] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  // Add other state variables and setters here as needed

  return (
    <PaymentContext.Provider value={{ orderId, setOrderId, merchantId, setMerchantId, customerId, setCustomerId, apiKey, setApiKey, secretKey, setSecretKey }}>
      {children}
    </PaymentContext.Provider>
  );
};
