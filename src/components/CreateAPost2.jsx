// /src/components/CreateAPost.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Client, Databases, ID, Query } from 'appwrite';
import { marked } from 'marked';
import { AppVariables } from '../utils/AppVariables'; // Import AppVariables class

// Initialize Appwrite Client using variables
const client = new Client()
  .setEndpoint(AppVariables.API_ENDPOINT) // Your API Endpoint
  .setProject(AppVariables.PROJECT_ID); // Your project ID
const databases = new Databases(client);

// Styled components
const FormContainer = styled.form`
  background-color: darkslategray;
  color: white;
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: white;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #4a7a7a;
  color: white;
  background-color: darkslategray;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #4a7a7a;
  color: white;
  background-color: darkslategray;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  background-color: #4a7a7a;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #5a8a8a;
  }
`;

const MessageContainer = styled.div`
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.$isError ? '#f44336' : '#4caf50')};
`;

const CreateAPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [topic, setTopic] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        try {
          const response = await databases.getDocument(
            AppVariables.DATABASE,
            AppVariables.COLLECTION_ID,
            postId,
            { cache: 'no-cache' } // No cache to always fetch fresh data
          );
          setTitle(response.title || '');
          setSlug(response.slug || '');
          setContent(response.content || '');
          setExcerpt(response.excerpt || '');
          setTopic(response.topic || '');
          setIsPrivate(response.isPrivate || false);
        } catch (error) {
          console.error('Error fetching post:', error);
          setMessage({ text: 'Failed to fetch post data.', isError: true });
        }
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-');
      checkSlugUniqueness(generatedSlug);
    }
  }, [title]);

  const checkSlugUniqueness = async (generatedSlug) => {
    try {
      const response = await databases.listDocuments(
        AppVariables.DATABASE,
        AppVariables.COLLECTION_ID,
        [Query.equal('slug', generatedSlug)]
      );

      if (response.total > 0) {
        setSlug(`${generatedSlug}-${response.total}`);
      } else {
        setSlug(generatedSlug);
      }
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const htmlContent = marked(content);
      const postData = { title, slug, content: htmlContent, excerpt, topic, isPrivate };

      if (postId) {
        console.log('Updating post:', postId, postData);

        // Update document with permissions
        const result = await databases.updateDocument(
          AppVariables.DATABASE,
          AppVariables.COLLECTION_ID,
          postId,
          postData, // Updated data
          ["read('any')"] // Permissions (optional)
        );

        console.log('Update Result:', result);
      } else {
        console.log('Creating new post:', postData);
        await databases.createDocument(
          AppVariables.DATABASE,
          AppVariables.COLLECTION_ID,
          ID.unique(),
          postData
        );
      }

      setMessage({ text: 'Post saved successfully!', isError: false });
      navigate(`/view-all-posts?timestamp=${Date.now()}`);
    } catch (error) {
      console.error('Failed to save post:', error);
      setMessage({ text: `Failed to save post: ${error.message}`, isError: true });
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {message.text && (
        <MessageContainer $isError={message.isError}>{message.text}</MessageContainer>
      )}
      <FormGroup>
        <Label htmlFor="title">Title:</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="slug">Slug:</Label>
        <Input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          maxLength={255}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="content">Content (Markdown supported):</Label>
        <TextArea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={100000000}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="excerpt">Excerpt:</Label>
        <Input
          type="text"
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={255}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="topic">Topic:</Label>
        <Input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          maxLength={255}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>
          <Input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private
        </Label>
      </FormGroup>
      <SubmitButton type="submit">
        {postId ? 'Update Post' : 'Create Post'}
      </SubmitButton>
    </FormContainer>
  );
};

export default CreateAPost;
