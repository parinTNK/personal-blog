import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

function SocialShareLinks({ url, title }) {
  // ถ้าไม่มี URL (ซึ่งไม่ควรเกิดขึ้น) ให้ใช้ URL ปัจจุบัน
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  // สร้าง URLs สำหรับการแชร์
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  // ฟังก์ชันเปิด Popup สำหรับการแชร์
  const handleShare = (shareUrl) => {
    window.open(shareUrl, 'share-popup', 'height=500,width=600');
    return false;
  };

  return (
    <div className="flex items-center space-x-4 my-6">
      <span className="text-gray-600 font-medium">Share:</span>
      <div className="flex space-x-2">
        <button 
          onClick={() => handleShare(facebookShareUrl)}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          aria-label="Share on Facebook"
        >
          <FaFacebookF size={16} />
        </button>
        <button 
          onClick={() => handleShare(twitterShareUrl)}
          className="bg-sky-400 text-white p-2 rounded-full hover:bg-sky-500"
          aria-label="Share on Twitter"
        >
          <FaTwitter size={16} />
        </button>
        <button 
          onClick={() => handleShare(linkedinShareUrl)}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
          aria-label="Share on LinkedIn" 
        >
          <FaLinkedinIn size={16} />
        </button>
      </div>
    </div>
  );
}

export default SocialShareLinks;