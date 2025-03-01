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
const RowContainer = styled.tr`
  border: 2px solid white; /* Border around the entire row */
`;

const TitleCell = styled.td`
  text-align: center; /* Centers the title */
  vertical-align: middle;
  padding: 1rem;
  width: 40%; /* Takes a portion of the row */
`;

const ActionsCell = styled.td`
  padding: 1rem;
  width: 30%;
  text-align: right; /* Push buttons to the right */
`;

const PrivateCell = styled.td`
  padding: 1rem;
  width: 30%;
  text-align: right; /* Push private toggle to the right */
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

  if (isLoading) return <p style={{ color: 'white', textAlign: 'center' }}>Loading posts...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ backgroundColor: '#2f4f4f', padding: '20px', color: 'white' }}>
      <h2>Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available. Check your data source.</p>
      ) : (
        <table style={{ width: '100%', maxWidth: '1200px', margin: '20px auto', borderCollapse: 'collapse', backgroundColor: 'darkslategreen' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '2px solid white', color: 'white' }}>Title</th>
              <th style={{ padding: '8px', border: '2px solid white', color: 'white' }}>Action</th>
              <th style={{ padding: '8px', border: '2px solid white', color: 'white' }}>Private</th>
            </tr>
          </thead>
          <tbody>
            {posts
              .slice()
              .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
              .map((post) => (
                <RowContainer key={post.$id}>
                  {/* Title Column (Centered, No Border) */}
                  <TitleCell>{post.title}</TitleCell>

                  {/* Action Buttons (Right-Aligned) */}
                  <ActionsCell>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
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
                    </div>
                  </ActionsCell>

                  {/* Private Toggle (Right-Aligned) */}
                  <PrivateCell>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.2rem',
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
                  </PrivateCell>
                </RowContainer>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAllPosts;
