import React from 'react';
import BankingImg from '../components/assets/banking.svg';
import CardsImg from '../components/assets/cards.svg';
import WalletImg from '../components/assets/wallet.svg';
import BitcoinImg from '../components/assets/Bitcoin.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePayment } from '@/context/PaymentContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SelectCurrency = () => {
    const router = useRouter();

    const { merchantId, customerId } = usePayment();
    const handleClick = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subwallets/${merchantId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId }),
            });

            const data = await response.json();
            if (!response.ok) {
                if (data.message === 'Your wallets are already created') {
                    toast.success(data.message);
                    await router.push('./SelectPaymentAmount');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col gap-8 justify-center items-center h-full w-full absolute">
            <p className="mx-[10%] sm:m-[unset] text-4xl leading-[48px]">
                Choose a payment method
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:min-w-[433px] min-w-[80%] gap-4">
                <div
                    onClick={handleClick}
                    className="h-32 border border-[#cdcdcd81] hover:shadow-lg rounded-lg gap-4 cursor-pointer flex flex-col justify-center items-center"
                >
                    <Image src={BitcoinImg} alt="Logo" />
                    <p>Cryptocurrency</p>
                </div>
                <div className="h-32 border border-[#cdcdcd81] rounded-lg flex justify-center items-center">
                    <Image src={BankingImg} alt="Logo" />
                </div>
                <div className="h-32 border border-[#cdcdcd81] rounded-lg flex justify-center items-center">
                    <Image src={CardsImg} alt="Logo" />
                </div>
                <div className="h-32 border border-[#cdcdcd81] rounded-lg flex justify-center items-center">
                    <Image src={WalletImg} alt="Logo" />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SelectCurrency;
