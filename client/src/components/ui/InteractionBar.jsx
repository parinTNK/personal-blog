import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FiCopy, FiMessageSquare } from "react-icons/fi";
import { Heart, Loader2 } from "lucide-react";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
// import CommentModal from './CommentModal';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function InteractionBar({ postId }) {
  const { currentUser } = useUser();
  // const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId && !isNaN(parseInt(postId))) {
      fetchLikesCount();
      if (currentUser) {
        checkUserLike();
      }
    }
  }, [postId, currentUser]);

  const fetchLikesCount = async () => {
    if (!postId) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}/likes-count`);
      setLikesCount(response.data.likesCount || 0);
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  };

  const checkUserLike = async () => {
    if (!currentUser || !postId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}/check-like`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Please login to like this post');
      return;
    }

    if (!postId) {
      toast.error("Cannot like this post at the moment");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = liked 
        ? `${API_BASE_URL}/api/posts/${postId}/unlike`
        : `${API_BASE_URL}/api/posts/${postId}/like`;
      
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLiked(!liked);
      setLikesCount(response.data.likesCount || 0);
      
      toast.success(liked ? 'You unliked this post' : 'You liked this post');
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Could not update like status');
    } finally {
      setLoading(false);
    }
  };

  // const handleOpenCommentModal = () => {
  //   if (!currentUser) {
  //     toast.error('Please login to comment');
  //     return;
  //   }
    
  //   if (!postId) {
  //     toast.error("Cannot comment on this post at the moment");
  //     return;
  //   }
    
  //   setIsCommentModalOpen(true);
  // };

  const handleShare = (platform) => {
    const url = window.location.href;
    let shareUrl = '';

    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=450');
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <div className="border-t border-b py-6 my-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center space-x-2 ${
              liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            } transition-colors`}
            onClick={handleLike}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Heart 
                className={liked ? "fill-red-500" : ""} 
                size={20} 
              />
            )}
            <span>{likesCount}</span>
          </button>
          
          {/* <button 
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={handleOpenCommentModal}
          >
            <FiMessageSquare size={20} />
            <span>Comment</span>
          </button> */}
        </div>

        <div className="flex items-center space-x-3">
          <button 
            className="text-gray-600 hover:text-gray-900 transition-colors"
            onClick={handleCopyLink}
            title="Copy link"
          >
            <FiCopy size={20} />
          </button>
          
          <button 
            className="text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => handleShare('facebook')}
            title="Share to Facebook"
          >
            <FaFacebookF size={20} />
          </button>
          
          <button 
            className="text-blue-400 hover:text-blue-600 transition-colors"
            onClick={() => handleShare('twitter')}
            title="Share to Twitter"
          >
            <FaTwitter size={20} />
          </button>
          
          <button 
            className="text-blue-700 hover:text-blue-900 transition-colors"
            onClick={() => handleShare('linkedin')}
            title="Share to LinkedIn"
          >
            <FaLinkedinIn size={20} />
          </button>
        </div>
      </div>

      {/* {postId && (
        <CommentModal 
          isOpen={isCommentModalOpen} 
          onClose={() => setIsCommentModalOpen(false)} 
          postId={postId} 
        />
      )} */}
    </div>
  );
}

export default InteractionBar;