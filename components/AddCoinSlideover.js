import { Fragment, useState } from 'react'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify';

export default function AddCoinSlideover({showAddCoinSlide, setShowAddCoinSlide, coinsList, seeValue}) {
    const [inputValue, setInputValue] = useState('');
    // const [selectValue, setSelectValue] = useState('');
    const [selected, setSelected] = useState(null);
    const [coinIndex, setIndex] = useState(0);

    const closeAddCoinSlide = (event) => {
        setInputValue('');
        setSelected(null);
        setShowAddCoinSlide(false);
    };
  
    const clearSelection = () => {
      setSelected(null);
    }

  const handleChange = (event) => setInputValue(event.target.value);

  const handleSelectChange = (id, index) => {
        console.log(id, index);
        setSelected(id);
        // const index = event.target.selectedIndex;
        setIndex(index);
  }
    
  const handleClick = () => {
     if (inputValue === '' || inputValue === null || inputValue === 0) {
      toast.error('Please enter a valid number in the amount field');
     } else {
      console.log(selected);
      console.log(coinIndex);
       // addACoin(inputValue, modalCoinId);
       // seeValue(inputValue, selectValue, coinIndex);
       seeValue(inputValue, coinIndex);
        //close modal
       setInputValue('');
       setShowAddCoinSlide(false);
     }
  }

  return (
    <Transition.Root show={showAddCoinSlide} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeAddCoinSlide}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => closeAddCoinSlide()}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col bg-white py-6 shadow-xl overflow-y-scroll">
                    <div className="px-4 sm:px-6 h-1/12">
                      <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 mb-1">
                        Add Coin
                      </Dialog.Title>
                    </div>


                    <div className="relative basis-10/12 px-3 sm:px-5 h-10/12 overflow-y-scroll mt-3 ml-3">
                    <div className="flex flex-column overflow-y-scroll">
                      <RadioGroup value={selected} onChange={setSelected}>
                        <RadioGroup.Label className="sr-only">Coin List</RadioGroup.Label>
                        <div className="space-y-2">
                            {coinsList && coinsList.map((item, index) => (
                            <RadioGroup.Option
                                key={item.id}
                                onClick={() => setIndex(index)}
                                value={item}
                                className={({ active, checked }) =>
                                `${
                                    active
                                    ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300 hover:bg-sky-900'
                                    : ''
                                }
                                ${
                                    checked ? 'bg-sky-900 bg-opacity-75 text-white hover:bg-sky-900 hover:bg-opacity-75' : 'bg-white'
                                }
                                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none hover:bg-sky-100`
                                }
                            >
                                {({ active, checked }) => (
                                <>
                                    <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                    <img src={item.image} alt="coin-logo" className="h-7 w-7 mr-4" />
                                        <div className="text-sm">
                                        <RadioGroup.Label
                                            as="p"
                                            className={`font-medium  ${
                                            checked ? 'text-white' : 'text-gray-900'
                                            }`}
                                        >
                                            {item.name}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                            as="span"
                                            className={`inline ${
                                            checked ? 'text-sky-100' : 'text-gray-500'
                                            }`}
                                        >
                                            <span>
                                            {item.symbol.toUpperCase()} - ${item.current_price}
                                            </span>{' '}
                                        </RadioGroup.Description>
                                        </div>
                                    </div>
                                    {checked && (
                                        <div className="shrink-0 text-white">
                                        <CheckIcon className="h-6 w-6" />
                                        </div>
                                    )}
                                    </div>
                                </>
                                )}
                            </RadioGroup.Option>
                            ))}
                        </div>
                        </RadioGroup>
                           {/*  {coinsList && coinsList.map((item, index) => (
                            <div id={index} onClick={() => handleSelectChange(item.id, index)} className="flex flex-row justify-between mx-2 py-4 px-1 border-b border-slate-400 hover:bg-sky-50 hover:cursor-pointer" key={item.id}>
                                <div className="flex flex-row">
                                  <img src={item.image} alt="coin-logo" className="h-8 w-8" />
                                  <div className="coin-title-amount mt-1">
                                    <span className="coin-title">{item.name}</span>
                                  </div>
                                  <span className="mt-1 ml-4 font-sm text-sm text-slate-400">{item.symbol.toUpperCase()}</span>
                                </div>
                                <div>${item.current_price}</div>
                            </div>
                            ))
                            } */}
                        
                            {/*   <select className="select-coin mt-2 focus:ring-sky-300" value={selectValue} onChange={handleSelectChange}>
                                { coinsList && coinsList.map(item => <option label={item.name} key={item.id}>{item.name}</option>) }  
                            </select> */}
                        </div>
                    </div>


                    <div className='basis-2/12 mt-1 px-4 flex flex-col'>
                    <input placeholder='enter amount' className="input-amount mt-2 focus:ring-sky-400 active:ring-sky-200" type="number" value={inputValue} onChange={handleChange} />  
                    <button
                        type="button"
                        className="inline-flex my-2 mx-3 justify-center rounded-md border border-transparent bg-sky-300 py-4 text-sm font-medium text-sky-800 hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                        onClick={handleClick}
                        >
                        Add coin
                    </button>
                    <button
                        type="button"
                        className="inline-flex my-2 mx-3 justify-center rounded-md border border-transparent bg-gray-200 py-4 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                       /*  onClick={() => closeAddCoinSlide()} */
                        onClick={() => clearSelection()}
                        >
                        clear selection
                    </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

/*         <RadioGroup value={selected} onChange={setSelected}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
            {coinsList.map((item) => (
              <RadioGroup.Option
                key={item.id}
                value={coin}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                      : ''
                  }
                  ${
                    checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                     <img src={item.image} alt="coin-logo" className="h-7 w-7" />
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {item.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-sky-100' : 'text-gray-500'
                            }`}
                          >
                            <span>
                              {item.symbol.toUpperCase()}/{item.current_price}
                            </span>{' '}
                            <span aria-hidden="true">&middot;</span>{' '}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup> */

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
