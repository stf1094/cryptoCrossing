import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updatePortfolioItem } from '../store/actions/portfolioAction';

const UpdateCoinModal = ({showUpdateModal, setShowUpdateModal, modalCoin, modalAmount, modalCoinId}) => {
    const modalRef = useRef();;
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();

    const closeUpdateModal = e => {
        if (modalRef.current === e.target) {
          setShowUpdateModal(false);
        }
      };
    const handleChange = (event) => setInputValue(event.target.value);
      
    const handleClick = () => {
        //send the new value with the id to firebase
        dispatch(updatePortfolioItem(inputValue, modalCoinId));
        //close modal
        setInputValue('');
        setShowUpdateModal(false);
    }

    return (
        <>
        <Transition appear show={showUpdateModal} as={Fragment} ref={modalRef}>
                <Dialog as="div" className="relative z-10" onClose={closeUpdateModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h2"
                            className="text-lg font-medium leading-6 text-gray-900"
                        >
                            Update {modalCoin}
                        </Dialog.Title>
                        <div>
                           <h3>Current: {modalAmount}</h3>
                           <label> New: 
                             <input className="input-amount" placeholder="enter new amount" type="text" value={inputValue} onChange={handleChange} />
                           </label>
                           <button className="btn btn-primary mt-2" onClick={handleClick}>update</button>
                        </div>
                       {/*  <div className="mt-4">
                            <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={() => setShowAddCoinModal(prev => !prev)}
                            >
                            Got it, thanks!
                            </button>
                        </div> */}
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>
            </>
    )
}

export default UpdateCoinModal;