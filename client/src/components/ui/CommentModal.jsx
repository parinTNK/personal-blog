import React, { useState, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function CommentModal({ isOpen, onClose, postId }) {
  const { currentUser } = useUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}/comments`);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
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

      setComments([response.data, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
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
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Comments</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Comment form */}
        <div className="p-4 border-b">
          <form onSubmit={handleSubmitComment} className="flex flex-col">
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={currentUser ? "Write a comment..." : "Please login to comment"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!currentUser || submitting}
            />
            
            <div className="flex justify-end mt-2">
              <button 
                type="submit"
                className={`flex items-center px-4 py-2 rounded ${
                  !currentUser || submitting || !newComment.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={!currentUser || submitting || !newComment.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-0">
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
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentModal;