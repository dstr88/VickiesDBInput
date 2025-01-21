import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import ViewAllPosts from '../components/viewAllPosts.jsx';
import CreateAPost from '../components/CreateAPost.jsx';
import ViewThatPost from '../components/ViewThePost.jsx';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: darkslategray;
  color: white;
  font-family: Arial, sans-serif;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #1a3636;
  overflow-y: auto;
  max-width: 100%;
`;

const Home = () => {
  const [activeComponent, setActiveComponent] = useState('posts');
  const navigate = useNavigate();

  const togglePosts = () => {
    setActiveComponent('posts');
    navigate('/');
  };

  const toggleCreatePost = () => {
    setActiveComponent('create');
    navigate('/CreateAPost');
  };

  const handleLogout = () => {
    // Implement logout logic
    navigate('/login');
  };

  return (
    <DashboardContainer>
      <Header 
        showPosts={activeComponent === 'posts'}
        showCreatePost={activeComponent === 'create'}
        togglePosts={togglePosts}
        toggleCreatePost={toggleCreatePost}
        onLogout={handleLogout}
      />
      <ContentContainer>
        <Routes>
          <Route path="/" element={<ViewAllPosts />} />
          <Route path="/CreateAPost" element={<CreateAPost />} />
          <Route path="/CreateAPost/:postId" element={<CreateAPost />} />
          <Route path="/post/:postId" element={<ViewThatPost />} />
        </Routes>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Home;