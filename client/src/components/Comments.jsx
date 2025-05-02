import React, { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import CommentModal from './ui/CommentModal';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function Comments({ postId }) {
  const { currentUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ดึงข้อมูล comments เมื่อ component โหลด
  useEffect(() => {
    // ตรวจสอบว่า postId มีค่าและเป็นตัวเลข
    if (postId && !isNaN(parseInt(postId))) {
      fetchComments();
    } else {
      setLoading(false);
    }
  }, [postId]);

  const fetchComments = async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}/comments`);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleOpenModal = () => {
  //   if (!postId) {
  //     toast.error("Cannot view comments for this post at the moment");
  //     return;
  //   }
  //   setIsModalOpen(true);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // รีเฟรช comments หลังจากปิด modal
    if (postId) {
      fetchComments();
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    if (!postId) {
      toast.error("Cannot comment on this post at the moment");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/${postId}/comments`,
        { comment_text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // อัพเดท comments แบบไม่ต้อง refresh หน้า
      setComments([response.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.error || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className='mt-12'>
      <h3 className='text-2xl font-bold mb-6'>Comments</h3>
      
      {/* Comment Input */}
      <div className='bg-white rounded-lg p-4 mb-8 border'>
        <form onSubmit={handleSubmitComment} className='flex flex-col'>
          <textarea
            className='w-full border border-gray-200 rounded-lg p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder={currentUser ? "What are your thoughts?" : "Please login to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!currentUser || submitting || !postId}
          />
          
          <div className='flex justify-end mt-3'>
            <button 
              type='submit'
              className={`flex items-center px-4 py-2 rounded ${
                !currentUser || submitting || !newComment.trim() || !postId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={!currentUser || submitting || !newComment.trim() || !postId}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="mr-2" size={16} />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <div className='space-y-5'>
          {comments.length > 0 ? (
            <>
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {comment.users?.profile_pic ? (
                        <img
                          src={comment.users.profile_pic}
                          alt={`${comment.users.name}'s avatar`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                          <span className="font-semibold text-gray-600">
                            {comment.users?.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{comment.users?.name || 'Anonymous'}</h4>
                        <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                      </div>
                      <p className="text-gray-800">{comment.comment_text}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* {comments.length > 3 && (
                <button 
                  className="w-full py-3 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                  onClick={handleOpenModal}
                >
                  View all comments ({comments.length})
                </button>
              )} */}
            </>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      )}

      {/* Comment Modal */}
      {postId && (
        <CommentModal isOpen={isModalOpen} onClose={handleCloseModal} postId={postId} />
      )}
    </div>
  );
}

export default Comments;