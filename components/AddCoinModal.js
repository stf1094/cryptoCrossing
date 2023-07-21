import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useRef } from 'react';

const AddCoinModal = ({showAddCoinModal, setShowAddCoinModal, coinsList, seeValue}) => {
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [coinIndex, setIndex] = useState(0);

    const closeAddCoinModal = (event) => {
          setShowAddCoinModal(false);
      };
    const handleChange = (event) => setInputValue(event.target.value);

    const handleSelectChange = (event) => {
          setSelectValue(event.target.value);
          const index = event.target.selectedIndex;
          setIndex(index);
    }
      
    const handleClick = () => {
         // addACoin(inputValue, modalCoinId);
         // seeValue(inputValue, selectValue, coinIndex);
          seeValue(inputValue, coinIndex);
          //close modal
          setInputValue('');
          setShowAddCoinModal(false);
    }

    return (
        <>
        <Transition appear show={showAddCoinModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeAddCoinModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h1"
                            className="text-lg font-medium leading-6 text-gray-900"
                        >
                            Add New Coin
                        </Dialog.Title>
                        <div className="flex flex-column mt-2">
                          <select className="select-coin mt-2 focus:ring-sky-300" value={selectValue} onChange={handleSelectChange}>
                            { coinsList && coinsList.map(item => <option label={item.name} key={item.id}>{item.name}</option>) }  
                          </select>
                          <input placeholder='enter amount' className="input-amount mt-2 focus:ring-sky-400 active:ring-sky-200" type="text" value={inputValue} onChange={handleChange} />  
                          </div>
                         <div className="mt-4">
                            <button
                            type="button"
                            className="inline-flex mr-2 justify-center rounded-md border border-transparent bg-sky-300 px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                            onClick={handleClick}
                            >
                            Add coin
                            </button>
                            <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                            onClick={() => closeAddCoinModal()}
                            >
                            cancel
                            </button>
                        </div> 
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>
            </>
    )
}

export default AddCoinModal;