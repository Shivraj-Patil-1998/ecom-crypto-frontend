import React, { useEffect, useState } from 'react';
import {
  Dialog,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import DownArrow from '../components/assets/down-arrow.svg';
import Completed from '../components/assets/complete.svg';
import Bitcoin from '../components/assets/currency/Bitcoin.svg';
import Ethereum from '../components/assets/currency/Ethernum.svg';
import USDC from '../components/assets/currency/USDC.svg';
import tethertron from '../components/assets/currency/tether-tron.svg';
import thetherusdethernum from '../components/assets/currency/thether-usd-ethernum.svg';
import usdcbsc from '../components/assets/currency/usdc(bsc).svg';
import usdcpolygon from '../components/assets/currency/usdc(polygon).svg';
import usdctrc20 from '../components/assets/currency/usdc(trc20).svg';
import usdtbsc from '../components/assets/currency/usdt(bsc).svg';
import usdtpolygon from '../components/assets/currency/usdt(polygon).svg';
import Copy from '../components/assets/copy.svg';
import Exclamatory from '../components/assets/exclamatory.svg';
import Wallet from '../components/assets/wallet1.svg';
import Close from '../components/assets/close.svg';
import Image from 'next/image';
import Timer from '@/components/Timer';
import QRCode from 'qrcode.react';
import { usePayment } from '../context/PaymentContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface People {
  id: string;
  name: string;
  icon: string;
  subname: string;
  address: string;
  asset: string;
}
// address: '',

const initialPeople: People[] = [
  {
    id: '1',
    subname: 'ETH',
    name: 'Ethereum',
    icon: Ethereum,
    address: '',
    asset: 'ETH'
  },
  {
    id: '2',
    subname: 'BTC',
    name: 'Bitcoin',
    icon: Bitcoin,
    address: '',
    asset: 'BTC'
  },
  {
    id: '3',
    subname: 'USDC',
    name: 'USDC',
    icon: USDC,
    address: '',
    asset: 'USDC'
  },
  {
    id: '4',
    subname: 'USDT',
    name: 'USDT( ERC20)',
    icon: thetherusdethernum,
    address: '',
    asset: 'USDT_ERC20'
  },
  {
    id: '5',
    subname: 'USDT',
    name: 'USDT (TRC20)',
    icon: tethertron,
    address: '',
    asset: 'USDT_TRON'
  },
  {
    id: '8',
    subname: 'USDC',
    name: 'USDC(TRC20)',
    icon: usdctrc20,
    address: '',
    asset: 'USDC_TRON'
  },
  {
    id: '6',
    subname: 'USDC',
    name: 'USDC(BSC)',
    icon: usdcbsc,
    address: '',
    asset: 'USDC_BSC'
  },
  {
    id: '9',
    subname: 'USDT',
    name: 'USDT(BSC)',
    icon: usdtbsc,
    address: '',
    asset: 'USDT_BSC'
  },
  {
    id: '7',
    subname: 'USDC',
    name: 'USDC(Polygon)',
    icon: usdcpolygon,
    address: '',
    asset: 'USDC_POLYGON'
  },
  {
    id: '10',
    subname: 'USDT',
    name: 'USDT(Polygon)',
    icon: usdtpolygon,
    address: '',
    asset: 'USDT_POLYGON'
  },
];

const SelectPaymentAmount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(initialPeople[0]);
  const [isInputVisible, setInputVisible] = useState(false);
  const [coin, setCoin] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [conversionValue, setConversionValue] = useState(0);
  const [conversionValueSingle, setConversionValueSingle] = useState(0);
  const [openBlock, setOpenBlock] = useState(false);
  const [blockData, setBlockData] = useState<any>(null);

  const handleTextClick = () => {
    setInputVisible(true);
    setIsSubmitted(false);
  };

  const handleCancelClick = () => {
    setInputVisible(false);
    setCoin('');
  };

  const handleSendClick = () => {
    // console.log('Sending coin:', coin);
    setIsSubmitted(true);
    setInputVisible(false);
    setCoin('');
  };

  const { merchantId, customerId, orderId } = usePayment();

  useEffect(() => {
    handleClick()
  }, [customerId])

  const handleClick = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subwallets/${merchantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });
      // if (!response.ok) {
      //   throw new Error('Failed to get customer assets');
      // }
      const data = await response.json();
      console.log("datadata", data?.existingCustomerWallets);

      // Extract existingCustomerWallets array from the data
      const { existingCustomerWallets } = data;

      // Update addresses in the initialPeople array
      initialPeople.forEach(person => {
        const matchedWallet = existingCustomerWallets.find((wallet: { assetId: string; }) => wallet.assetId === person.asset);
        if (matchedWallet) {
          person.address = matchedWallet.address;
        }
      });

      // Update the selectedPerson state if necessary
      const updatedSelectedPerson = initialPeople.find(person => person.id === selectedPerson.id);
      if (updatedSelectedPerson) {
        setSelectedPerson(updatedSelectedPerson);
        console.log(updatedSelectedPerson)
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleContinueClick = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId: selectedPerson.asset,
          transactionId: '1',
          transactiontype: "INCOMING",
          toAddress: selectedPerson.address,
          exactAmount: conversionValue,
          orderId,
          merchantId,
          customerId,
          orderStatus: 'PENDING',
          status: 'false',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setBlockData(data)
        setOpenBlock(true)
        setIsSecondDialogOpen(isSecondDialogOpen)
      } else {
        setIsOpen(false);
        setIsSecondDialogOpen(!isSecondDialogOpen);
        setTimeLeft(599);
      }
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }

  };

  const handleBreadcrumbClick = (person: People) => {
    setSelectedPerson(person);
  };

  const displayedPeople = initialPeople.filter((person) =>
    ['Bitcoin', 'USDT( ERC20)', 'USDC'].includes(person.name)
  );

  const handleContinue = () => {
    if (!amount) {
      setError(true);
      setErrorMsg('Please enter a valid amount');
    } else if (parseFloat(amount) <= 0) {
      setError(true);
      setErrorMsg('Amount should be greater than 0');
    } else {
      setIsOpen(true);
    }
  };

  const fetchLimitsPair = async (value: string) => {
    const pair2 = value + '/EUR';
    try {
      const response = await fetch(
        `https://api.kraken.com/0/public/Ticker?pair=${pair2}`
      );

      const data = await response.json();

      if (data.result[pair2]) {
        return data.result[pair2]?.a[0];
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchLimitsPair(selectedPerson.subname).then((result) => {
    console.log(selectedPerson.subname)
    const numericAmount = Number(amount);
    const aproxValue = numericAmount / result;
    const singleValue = 1 / result;
    const finalResult = parseFloat(aproxValue.toFixed(6));
    const finalResultSingle = parseFloat(singleValue.toFixed(6));
    setConversionValue(finalResult);
    setConversionValueSingle(finalResultSingle);
  });

  const maskAddress = (address: string): string => {
    console.log(address)
    if (address.length < 8) {
      throw new Error('Address is too short to mask');
    }
    const firstFour = address.slice(0, 4);
    const lastFour = address.slice(-4);
    const masked = `${firstFour}****${lastFour}`;
    return masked;
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(selectedPerson.address)
      .then(() => {
        alert('Address copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black">
          <div className=" w-[90%] md:w-[700px] space-y-4 border bg-[#f9fcff] p-10 rounded-lg">
            <div className="text-center">
              <p className=" text-lg  font-semibold">
                Select the payment currency
              </p>
              <p className=" text-[#898da8] text-[13px]">Amount: {amount}</p>
            </div>

            <div className=" pb-6">
              <p className="text-[#828893] text-sm font-semibold">You pay</p>
              <p className=" text-[20px] font-semibold text-[#15161b]">
                {amount} EUR ≈ {conversionValue}
              </p>
            </div>

            <Listbox value={selectedPerson} onChange={setSelectedPerson}>
              <ListboxButton className="bg-[#eff3f4] items-center flex justify-between w-full p-3 pl-4 rounded-lg text-left">
                <div className="flex gap-2">
                  <Image
                    src={selectedPerson.icon}
                    className="w-[24px]"
                    alt="icon"
                  />
                  <p>
                    {selectedPerson.name}{' '}
                    <span className="text-[#898da8] text-sm font-medium">
                      {' '}
                      . {selectedPerson.subname}
                    </span>
                  </p>
                </div>
                <Image className=" w-3 h-2" src={DownArrow} alt="down arrow" />
              </ListboxButton>
              <ListboxOptions
                className="  w-[var(--button-width)] h-[40vh] overflow-y-auto bg-white mt-3 shadow-[0px_4px_9px_0px_rgba(32,33,38,10.9)] rounded-md"
                anchor="bottom"
              >
                {initialPeople.map((person) => (
                  <ListboxOption
                    key={person.id}
                    value={person}
                    className="group hover:bg-[#F4F5FB] cursor-pointer   rounded-lg py-1.5 px-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <Image
                          src={person.icon}
                          className="w-[24px]"
                          alt="icon"
                        />
                        {person.name}
                      </div>
                      <p className=" text-[#898da8] text-sm font-medium ">
                        {person.subname}
                      </p>
                    </div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
            {/* --------------------------------------- */}
            <div className="flex flex-wrap gap-2 pb-8">
              {displayedPeople.map((person) => (
                <div
                  key={person.id}
                  className="breadcrumb text-sm border border-[#cdcdcd] rounded-3xl flex gap-2 items-center w-fit py-1 pr-2 pl-1 cursor-pointer"
                  onClick={() => handleBreadcrumbClick(person)}
                >
                  <Image
                    className="w-[24px]"
                    src={person.icon}
                    alt={person.name}
                    width={24}
                    height={24}
                  />
                  <p className=" font-medium">{person.name}</p>
                  <p className="text-[#898da8] font-semibold">
                    . {person.name}
                  </p>
                </div>
              ))}
            </div>
            {/* --------------------------------------- */}

            <button
              onClick={handleContinueClick}
              className=" bg-[#C2912E] text-white px-6 py-3 w-full rounded "
            >
              Continue
            </button>

            <div className="pt-8">
              {!isInputVisible && !isSubmitted ? (
                <p
                  className="text-base cursor-pointer w-fit text-blue-500 underline"
                  onClick={handleTextClick}
                >
                  The coin you want isn&apos;t on the list ?
                </p>
              ) : isSubmitted ? (
                <div className="flex items-center gap-2">
                  <Image src={Completed} alt="completed" />
                  <p>Thank you for the information.</p>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <label className=" w-full ">
                    <p className="">What coin would you like to pay with?</p>
                    <input
                      type="text"
                      value={coin}
                      onChange={(e) => setCoin(e.target.value)}
                      className="border-b-2 border=[#cdcdcd] p-1 w-full bg-transparent outline-none"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelClick}
                      className="ml-2 p-1  text-black"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendClick}
                      className="ml-2 px-6 py-[5px] rounded-[3px] bg-[#4285F5] text-white shadow-[0px_2px_4px_0px_rgba(67,115,195)]"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={() => setIsOpen(false)}>Deactivate</button>
            </div> */}
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isSecondDialogOpen}
        onClose={() => setIsSecondDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black">
          <div className=" relative w-[95%] md:w-[700px] h-[90vh] overflow-y-auto md:h-auto space-y-4 border bg-[#f9fcff] py-8 px-5 md:p-10 rounded-lg">
            <div className="text-center">
              <p className=" text-[32px] font-normal">Make a payment</p>

              <p className=" text-[#898da8] text-base">
                Amount: {amount} <span>EUR</span>
              </p>
            </div>
            {timeLeft > 0 ? (
              <>
                {console.log('timeLeft inside', timeLeft)}
                <div className="flex flex-col-reverse md:flex-row bg-white shadow-lg rounded-lg">
                  <div className=" md:min-w-[238px] w-full flex flex-col justify-center items-center py-4 px-2 md:p-2 border-r border-[#cdcdcd]">
                    {/* <Image
                      src={QRcodeImage}
                      alt="qr"
                      className=" w-[157px] h-[157px]"
                    /> */}
                    <QRCode value={selectedPerson.address} />
                    <p className=" w-full text-[10px] text-[#6b7192] mt-4 break-words text-center ">
                      {selectedPerson.address}
                    </p>

                    <p
                      className={`text-white  px-3 rounded-full mt-4 h-[50px] w-[50px] p-3  ${timeLeft < 120 ? 'bg-[#F74B60]' : 'bg-[#000000]'
                        }`}
                    >
                      <Timer
                        initialTime={599}
                        onTimeUp={() => setIsSecondDialogOpen(false)}
                      />
                    </p>
                  </div>
                  <div className=" md-min-w-[320px] w-full">
                    <div className="flex justify-between items-center border-b border-[#cdcdcd] p-4">
                      <div>
                        <p className="text-[#898da8] text-sm">
                          Send exact amount
                        </p>
                        <p className="text-[#15161b] text-[22px] font-semibold">
                          {conversionValue}
                          {'  '}
                          {selectedPerson.name}
                        </p>
                      </div>
                      <Image
                        className=" w-[13.33px] h-[13.33px] cursor-pointer"
                        src={Copy}
                        alt="copy"
                      />
                    </div>
                    <div className="flex justify-between items-center border-b border-[#cdcdcd] p-4">
                      <div>
                        <p className="text-[#898da8] text-sm">
                          To this {selectedPerson.name} address
                        </p>
                        <p className="text-[#15161b] text-[22px] font-semibold">
                          {maskAddress(selectedPerson.address)}
                        </p>
                      </div>
                      <Image
                        onClick={copyToClipboard}
                        className=" w-[13.33px] h-[13.33px] cursor-pointer"
                        src={Copy}
                        alt="copy"
                      />
                    </div>
                    <div className="flex justify-between items-center border-b border-[#cdcdcd] p-4">
                      <div>
                        <p className="text-[#898da8] text-sm">Chain Type</p>
                        <p className="text-[#15161b] text-[22px] font-semibold">
                          {selectedPerson.name}
                        </p>
                      </div>
                      <Image
                        className=" w-[13.33px] h-[13.33px] cursor-pointer"
                        src={Copy}
                        alt="copy"
                      />
                    </div>
                    <div className="flex justify-center lg gap-4 items-center border-b border-[#cdcdcd] p-4 cursor-pointer">
                      <Image
                        className=" cursor-pointer"
                        src={Wallet}
                        alt="copy"
                      />
                      <p>Open wallet</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="flex flex-col-reverse gap-4 md:flex-row  py-4 ">
              <div className="flex items-start gap-2 p-2 w-full md:w-1/2">
                <Image
                  src={Exclamatory}
                  alt="Exclamatory"
                  className=" w-6 h-6"
                />
                <p className=" text-[#6b7192] text-sm ">
                  Make sure you send {selectedPerson.name} within 10 minutes.
                  Afterwards the rate will expire and you will have to create a
                  new payment
                </p>
              </div>
              <div className="flex flex-col gap-4 text-[#6b7192] w-full md:w-1/2">
                <div className="flex justify-between items-center">
                  <p>Exchange rate fixed for</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Fixed rate</p>
                  <p>
                    1 {selectedPerson.name} = {conversionValueSingle} EUR
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSecondDialogOpen(false)}
              className=" absolute top-0 right-3"
            >
              <Image src={Close} alt="Close" />
            </button>
          </div>
        </div>
      </Dialog>


      <Dialog
        open={openBlock && blockData !== null}
        onClose={() => {
          setOpenBlock(false);
          setBlockData(null); // Clear error details on close
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black">
          <div className="w-[90%] md:w-[700px] space-y-4 border bg-[#f9fcff] p-10 rounded-lg">
            <p className="text-[32px] font-normal">Blocking Message</p>
            <p className="text-[#898da8] text-base">{blockData?.message}</p>
            {blockData?.blockedTransaction && (
              <div>
                <p>Transaction ID: {blockData.blockedTransaction.transactionId}</p>
                <p>Asset ID: {blockData.blockedTransaction.assetId}</p>
                <p>Amount: {blockData.blockedTransaction.amount}</p>
              </div>
            )}
            <button
              onClick={() => {
                setOpenBlock(false);
                setBlockData(null); // Clear error details on close
              }}
              className="bg-[#C2912E] text-white px-6 py-3 w-full rounded"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>



      <div className="flex flex-col gap-8 justify-center items-center h-full w-full absolute bg-[#F9F9F9]">
        <p className=" text-4xl leading-[48px]">Deposit amount</p>

        <div className=" p-8 bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]  rounded-lg sm:min-w-[433px] min-w-[80%] gap-8 flex justify-center flex-col items-center ">
          <div className=" mx-auto w-[90%]">
            <p className=" mb-2">Enter Deposite Amount</p>
            <div className="border-[#cdcdcd] border rounded-lg w-full flex justify-between p-2">
              <input
                id="amount"
                placeholder="0.00"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(false);
                }}
                className={` text-base outline-none w-full  ${error ? 'border-red-500' : ''
                  }`}
              />

              <span>EUR</span>
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
          </div>

          <div className=" bg-[#f7f9f9] rounded-lg  mx-auto w-[90%]">
            <button
              onClick={handleContinue}
              className=" bg-[#C2912E] text-white px-6 py-3 w-full rounded "
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SelectPaymentAmount;
