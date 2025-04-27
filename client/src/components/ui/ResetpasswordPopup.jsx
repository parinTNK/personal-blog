import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function ResetpasswordPopup({ isOpen, onClose, onConfirm, loading }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => !loading && onClose()}>
                <Transition.Child>
                    <div className="fixed inset-0 bg-black opacity-75 " />
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
                                    as="h3"
                                   
                                    className="text-lg font-semibold leading-6 text-gray-900 flex justify-between items-center pb-4"
                                >
                                    <span></span>
                                    Reset password
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </Dialog.Title>

                                <div className="mt-2 mb-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Do you want to reset your password?
                                    </p>
                                </div>

                                <div className="flex justify-center gap-4"> 
                                    <button
                                        type="button"
                  
                                        className="inline-flex justify-center rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50"
                                        onClick={onClose}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                  
                                        className="inline-flex justify-center rounded-full border border-transparent bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50"
                                        onClick={onConfirm}
                                        disabled={loading}
                                    >
                                        {loading ? 'Resetting...' : 'Reset'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default ResetpasswordPopup;