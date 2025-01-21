// ./components/viewAllPosts.jsx
import React, { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppVariables } from '../utils/AppVariables';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(AppVariables.API_ENDPOINT) // Use variables from AppVariables
  .setProject(AppVariables.PROJECT_ID);
const databases = new Databases(client);

// Styles
const LoadingMessage = styled.p`
  color: white;
  font-size: 18px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 18px;
  text-align: center;
`;

const PageContainer = styled.div`
  background-color: #2f4f4f;
  color: white;
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 100%;
  margin: 0 auto;
`;

const Table = styled.table`
  width: 100%;
  max-width: 1200px;
  background-color: darkslategreen;
  border-collapse: collapse; /* Ensures borders collapse for rows and columns */
  margin: 20px auto;
  border: 5px solid darkslategray; /* Outer table border */
`;

const Th = styled.th`
  background-color: darkslategreen;
  border: 5px solid darkslategray; /* Column borders */
  padding: 8px;
  text-align: left;
  color: white;
`;

const Td = styled.td`
  border: 5px solid darkslategray; /* Row borders */
  padding: 1rem;
  background-color: darkslategreen;
  line-height: 1.5rem;
`;

const PostTitle = styled.span`
  display: block;
  line-height: 1.5rem;
  padding: 1rem 0;
  border: 5px solid darkslategray; /* Border around the title */
`;

const ViewAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch posts using useEffect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await databases.listDocuments(
          AppVariables.DATABASE,
          AppVariables.COLLECTION_ID
        );
        if (response.documents.length > 0) {
          setPosts(response.documents);
        } else {
          console.warn('No posts available');
        }
      } catch (error) {
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) return <LoadingMessage>Loading posts...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      <h2>Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available. Check your data source.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Action</Th>
              <Th>Private</Th>
            </tr>
          </thead>
          <tbody>
            {posts
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <tr
                  key={post.$id}
                  style={{
                    border: '5px solid darkslategray', // Row borders
                  }}
                >
                  <Td>
                    <PostTitle>{post.title}</PostTitle>
                  </Td>
                  <Td style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => navigate(`/CreateAPost/${post.$id}`)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this post?')) {
                          setPosts(posts.filter((p) => p.$id !== post.$id));
                        }
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </Td>
                  <Td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        border: '5px solid darkslategray',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        backgroundColor: '#2e4c4c',
                      }}
                    >
                      <label style={{ margin: 0, color: 'white' }}>Private</label>
                      <input
                        type="checkbox"
                        checked={post.isPrivate}
                        onChange={async () => {
                          try {
                            const updatedPost = {
                              ...post,
                              isPrivate: !post.isPrivate,
                            };
                            await databases.updateDocument(
                              AppVariables.DATABASE,
                              AppVariables.COLLECTION_ID,
                              post.$id,
                              { isPrivate: !post.isPrivate }
                            );
                            setPosts((prev) =>
                              prev.map((p) => (p.$id === post.$id ? updatedPost : p))
                            );
                          } catch (error) {
                            console.error('Error toggling privacy:', error);
                          }
                        }}
                        style={{
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </Td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </PageContainer>
  );
};

export default ViewAllPosts;
