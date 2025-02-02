import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Client, Databases, ID, Query, Account } from 'appwrite';
import { marked } from 'marked';
import { AppVariables } from '../utils/AppVariables';
import { updateDocumentPermissions } from '../utils/addPermission';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(AppVariables.API_ENDPOINT)
  .setProject(AppVariables.PROJECT_ID);
const databases = new Databases(client);
const account = new Account(client);

async function getUserID() {
  try {
    const user = await account.get();
    return user.$id;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

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
    if (postId) {
      const fetchPost = async () => {
        try {
          const response = await databases.getDocument(
            AppVariables.DATABASE,
            AppVariables.COLLECTION_ID,
            postId
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
      };
      fetchPost();
    }
  }, [postId]);

  useEffect(() => {
    if (title) {
      const generatedSlug = title.toLowerCase().trim().replace(/\s+/g, '-');
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
      setSlug(response.total > 0 ? `${generatedSlug}-${response.total}` : generatedSlug);
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = await getUserID();
    if (!userId) {
      setMessage({ text: 'User authentication required.', isError: true });
      return;
    }
    try {
      const htmlContent = marked(content);
      const postData = { title, slug, content: htmlContent, excerpt, topic, isPrivate };
      let documentId;
      if (postId) {
        const result = await databases.updateDocument(
          AppVariables.DATABASE,
          AppVariables.COLLECTION_ID,
          postId,
          postData,
          [`user:${userId}`]
        );
        documentId = result.$id;
      } else {
        const result = await databases.createDocument(
          AppVariables.DATABASE,
          AppVariables.COLLECTION_ID,
          ID.unique(),
          postData,
          [`user:${userId}`]
        );
        documentId = result.$id;
      }
      await updateDocumentPermissions(documentId, userId);
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

const FormContainer = styled.form`
  display: flex;
  background-color: darkslategray;
  color: white;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: auto;
`;

const MessageContainer = styled.div`
  padding: 0.5rem;
  /* background-color: ${(props) => (props.$isError ? 'red' : 'green')};  */
  background-color: darkslategray;
  color: white;
  border-radius: 5px;
  text-align: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  background-color: darkslategray;
  color: white;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  background-color: darkslategray;
  color: white;
`;

const Input = styled.input`
  padding: 0.5rem;
  width: 80vw;
  background-color: darkslategray;
  color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  background-color: darkslategray;
  color: white;
  border-radius: 5px;
  min-height: 20rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;


export default CreateAPost;
