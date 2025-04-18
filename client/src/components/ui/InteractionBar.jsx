import React, { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { CiFaceMeh } from "react-icons/ci";
import { FiCopy } from "react-icons/fi";
import PopupModal from './PopupModal';

function InteractionBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="bg-gray-100 p-4 rounded-lg flex justify-between items-center my-10"
        onClick={handleOpenModal}
      >
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-200">
            <CiFaceMeh className="text-lg" />
            <span>321</span>
          </button>
        </div>

        <div className="flex items-center space-x-5">
          <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-200">
            <FiCopy className="text-lg" />
            <span>Copy link</span>
          </button>

          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700">
              <FaFacebookF />
            </button>
            <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
              <FaLinkedinIn />
            </button>
            <button className="bg-sky-400 text-white rounded-full p-2 hover:bg-sky-500">
              <FaTwitter />
            </button>
          </div>
        </div>
      </div>

      <PopupModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default InteractionBar;