import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostSection from '@/components/PostSection';
import InteractionBar from '@/components/ui/InteractionBar';
import Footer from '@/components/Footer';

function ViewPost() {
    const { id } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`https://blog-post-project-api.vercel.app/posts/${id}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            }
        };

        fetchPosts();
    }, [id]);

    return (
        <>
            <div className='container mx-auto'>
                <Navbar />
                <PostSection data={data} />
            </div>
                <Footer />
        </>
    );
}

export default ViewPost;