import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import SelectPaymentAmount from './SelectPaymentAmount';
import { usePayment } from '../context/PaymentContext';

const Home = () => {
  const router = useRouter();
  const { orderId, setOrderId, merchantId, setMerchantId, customerId, setCustomerId, apiKey, setApiKey, secretKey, setSecretKey } = usePayment();
  const [errors, setErrors] = useState({
    merchantId: '',
    customerId: '',
    orderId: '',
    apiKey: '',
    secretKey: ''
  });

  const validateFields = () => {
    const newErrors = { merchantId: '', customerId: '', orderId: '', apiKey: '', secretKey: '' };
    if (merchantId.trim() === '') {
      newErrors.merchantId = 'Merchant ID is required';
    }
    if (customerId.trim() === '') {
      newErrors.customerId = 'Customer ID is required';
    }
    if (orderId.trim() === '') {
      newErrors.orderId = 'This field is required';
    }
    if (apiKey.trim() === '') {
      newErrors.apiKey = 'Api Key is required';
    }
    if (secretKey.trim() === '') {
      newErrors.secretKey = 'Secret Key is required';
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleClick = () => {
    if (validateFields()) {
      router.push('./selectcurrency');
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full w-full absolute bg-[#F9F9F9]">
      <p className="text-4xl leading-[30px]">Details</p>

      <div className="p-8 bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] rounded-lg sm:min-w-[433px] min-w-[80%] gap-8 flex justify-center flex-col items-center">
        <div className="mx-auto w-[90%]">
          <p className="mb-2">Merchant ID</p>
          <div className="border-[#cdcdcd] border rounded-lg w-full flex justify-between p-2">
            <input
              id="merchant"
              placeholder="0tjs....."
              type="number"
              value={merchantId}
              onChange={(e) => {
                setMerchantId(e.target.value);
                setErrors(prev => ({ ...prev, merchantId: '' }));
              }}
              className={`text-base outline-none w-full ${errors.merchantId ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.merchantId && <p className="text-red-500 text-sm mt-1">{errors.merchantId}</p>}
        </div>
        <div className="mx-auto w-[90%]">
          <p className="mb-2">Customer ID</p>
          <div className="border-[#cdcdcd] border rounded-lg w-full flex justify-between p-2">
            <input
              id="customer"
              placeholder="0tjs....."
              type="number"
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                setErrors(prev => ({ ...prev, customerId: '' }));
              }}
              className={`text-base outline-none w-full ${errors.customerId ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.customerId && <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>}
        </div>
        <div className="mx-auto w-[90%]">
          <p className="mb-2">Order Id</p>
          <div className="border-[#cdcdcd] border rounded-lg w-full flex justify-between p-2">
            <input
              id="orderId"
              placeholder="0tjs....."
              type="string"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setErrors(prev => ({ ...prev, orderId: '' }));
              }}
              className={`text-base outline-none w-full ${errors.orderId ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.orderId && <p className="text-red-500 text-sm mt-1">{errors.orderId}</p>}
        </div>
        <div className="mx-auto w-[90%]">
          <p className="mb-2">Api Key</p>
          <div className="border-[#cdcdcd] border rounded-lg w-full flex justify-between p-2">
            <input
              id="Api Key"
              placeholder="0tjs....."
              type="string"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setErrors(prev => ({ ...prev, apiKey: '' }));
              }}
              className={`text-base outline-none w-full ${errors.apiKey ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.apiKey && <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>}
        </div>
        <div className="mx-auto w-[90%]">
          <p className="mb-2">Secret Key</p>
          <div className="border-[#cdcdcd] border rounded-lg w-full flex justify-between p-2">
            <input
              id="Secret Key"
              placeholder="0tjs....."
              type="string"
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                setErrors(prev => ({ ...prev, secretKey: '' }));
              }}
              className={`text-base outline-none w-full ${errors.secretKey ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.secretKey && <p className="text-red-500 text-sm mt-1">{errors.secretKey}</p>}
        </div>
        <div className="bg-[#f7f9f9] rounded-lg mx-auto w-[90%]">
          <button
            className="bg-[#C2912E] text-white px-6 py-3 w-full rounded"
            onClick={handleClick}
          >
            Continue
          </button>
        </div>
      </div>

    </div>
  );
};

export default Home;
