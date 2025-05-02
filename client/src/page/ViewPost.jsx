import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostSection from '@/components/PostSection';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL_DEV;

function ViewPost() {
        const { id } = useParams();
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
                const fetchPost = async () => {
                        setLoading(true);
                        try {
                                console.log("Fetching post with ID:", id);
                                const response = await axios.get(`${API_BASE_URL}/api/posts/${id}`);
                                console.log("Post data received:", response.data);
                                
                                const postData = response.data;
                                
                                if (!postData.content_format && postData.content) {
                                    const markdownIndicators = [
                                        '##', '**', '__', '```', '>', '[', '![', '- ', '1. ', '|', '\n\n'
                                    ];
                                    
                                    const couldBeMarkdown = markdownIndicators.some(indicator => 
                                        postData.content.includes(indicator)
                                    );
                                    
                                    if (couldBeMarkdown) {
                                        postData.content_format = 'markdown';
                                    } else {
                                        postData.content_format = 'html';
                                    }
                                }
                                
                                setData(postData);
                            } catch (error) {
                                console.error('Error fetching post:', error);
                                setError('Failed to load the article. Please try again later.');
                            } finally {
                                setLoading(false);
                            }
                };

                if (id) {
                        fetchPost();
                } else {
                        setError("Invalid blog post ID");
                        setLoading(false);
                }
        }, [id]);

        const handleGoBack = () => {
                navigate('/');
        };

        if (loading) {
                return (
                        <>
                                <Navbar />
                                <div className="container mx-auto min-h-[60vh] flex items-center justify-center">
                                        <Loader2 className="h-12 w-12 text-gray-500 animate-spin" />
                                </div>
                                <Footer />
                        </>
                );
        }

        if (error || !data) {
                return (
                        <>
                                <Navbar />
                                <div className="container mx-auto min-h-[60vh] flex items-center justify-center">
                                        <div className="bg-red-50 p-8 rounded-lg text-center max-w-md">
                                                <h2 className="text-red-600 text-xl font-bold mb-2">
                                                        {!data ? "Article Not Found" : "Error"}
                                                </h2>
                                                <p className="text-gray-700 mb-4">
                                                        {error || "The article you're looking for doesn't exist or has been removed."}
                                                </p>
                                                <button
                                                        onClick={handleGoBack}
                                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
                                                >
                                                        Back to Blog
                                                </button>
                                        </div>
                                </div>
                                <Footer />
                        </>
                );
        }

        return (
                <>
                        <Navbar />
                        <div className="bg-gray-50 min-h-screen py-8">
                                <PostSection data={data} />
                        </div>
                        <Footer />
                </>
        );
}

export default ViewPost;
