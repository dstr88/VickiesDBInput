import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Client, Databases } from 'appwrite';
import styled from 'styled-components';
import { AppVariables } from '../utils/AppVariables'; // Import AppVariables class

const client = new Client()
  .setEndpoint(AppVariables.API_ENDPOINT) // Dynamically set the endpoint
  .setProject(AppVariables.PROJECT_ID);  // Dynamically set the project ID

const databases = new Databases(client);

const ContentWrapper = styled.div`
  background-color: darkslategray !important;
  color: white;  
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const BlogContent = styled.div`
  background-color: darkslategray !important;
  color: white; 
  padding: 15px;
  border-radius: 5px;
`;

const PostTitle = styled.h1`
  background-color: darkslategray !important;
  color: white;
  line-height: 1.6;
  font-size: 24px;
`;



const PostContent = styled.div`
  background-color: darkslategray !important;
  color: white;
  line-height: 1.6;
  font-size: 16px;

  * {
    background-color: darkslategray !important;
    color: white !important;
    max-width: 100%
  }

  pre, code {
    white-space: pre-wrap;
    word-break: break-all;
    overflow-x: auto;
    img{
        max-width: 100%;
        height: auto;
    }
  }
`;

const ViewThatPost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchPost = async () => {
          try {
              const response = await databases.getDocument(
                  AppVariables.DATABASE,      // Dynamically fetch the database ID
                  AppVariables.COLLECTION_ID, // Dynamically fetch the collection ID
                  postId                      // Use the provided postId
              );
              setPost(response);
          } catch (error) {
              console.error('Error fetching post:', error);
              setError('Post not found');
          }
      };
  
      fetchPost();
  }, [postId]);
  
  if (error) return <p>{error}</p>;
  if (!post) return <p>Loading...</p>;
  
  return (
      <ContentWrapper>
          <PostTitle>{post.title}</PostTitle>
          <BlogContent>
              <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />
          </BlogContent>
      </ContentWrapper>
  );
};

export default ViewThatPost;