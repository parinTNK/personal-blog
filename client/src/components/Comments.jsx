import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator"
import PopupModal from './ui/PopupModal';

function Comments() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const comments = [
    {
      id: 1,
      name: 'Jacob Lash',
      date: '12 September 2024 at 18:30',
      avatar: 'https://via.placeholder.com/40', // Replace with actual avatar URL
      text: 'I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.',
    },
    {
      id: 2,
      name: 'Ahri',
      date: '12 September 2024 at 18:30',
      avatar: 'https://via.placeholder.com/40', // Replace with actual avatar URL
      text: 'Such a great read! I’ve always wondered why my cat slow blinks at me—now I know it’s her way of showing trust!',
    },
    {
      id: 3,
      name: 'Mimi mama',
      date: '12 September 2024 at 18:30',
      avatar: 'https://via.placeholder.com/40', // Replace with actual avatar URL
      text: 'This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!',
    },
  ];

  return (
    <>
      <div className="space-y-6" >
        {/* Comment Input */}
        <div onClick={handleOpenModal}>
          <h3 className="text-lg font-semibold mb-2">Comment</h3>
          <div className="flex flex-col space-y-2">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
              rows="3"
              placeholder="What are your thoughts?"
            ></textarea>
            <button className="self-end bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
              Send
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id}>
              <div className="flex space-x-4">
                <img
                  src={comment.avatar}
                  alt={`${comment.name}'s avatar`}
                  className="w-10 h-10 rounded-full bg-gray-300"
                />
                <div>
                  <h4 className="font-semibold">{comment.name}</h4>
                  <p className="text-sm text-gray-500">{comment.date}</p>
                  <p className=" text-gray-700 mt-4">{comment.text}</p>
                </div>
              </div>
              <Separator className="my-8" />
            </div>
          ))}
        </div>
      </div>

      <PopupModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default Comments;