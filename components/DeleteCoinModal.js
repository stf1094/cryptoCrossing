import { deleteACoin } from '@/store/actions/portfolioAction';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

const DeleteCoinModal = ({coinToDeleteId, coinToDeleteName, coinToDeleteAmount, setShowDeleteCoinModal, showDeleteCoinModal}) => {
    const dispatch = useDispatch();

    const closeModal = () => {
        setShowDeleteCoinModal(false);
    };
      
    const handleClick = () => {
        dispatch(deleteACoin(coinToDeleteId));
        //close modal
        setShowDeleteCoinModal(false);
    }

    return (
        <>
        <Transition appear show={showDeleteCoinModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h1"
                            className="text-lg font-medium leading-6 text-gray-900"
                        >
                            Are you sure you want to delete? 
                        </Dialog.Title>
                        <div className="flex flex-column mt-2">
                         <div>{coinToDeleteName} - {coinToDeleteAmount}</div>
                        </div>
                         <div className="mt-4">
                            <button
                            type="button"
                            className="inline-flex mr-2 justify-center rounded-md border border-transparent bg-sky-300 px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                            onClick={handleClick}
                            >
                            Delete coin
                            </button>
                            <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                            onClick={() => closeModal()}
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

export default DeleteCoinModal;