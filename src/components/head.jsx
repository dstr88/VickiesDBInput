// Header.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';

const HeaderContainer = styled.div`
  background-color: darkslategray;
  color: white;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: darkslategray;
  border-bottom: 2px solid white;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  height: 80px;
  background-color: darkslategray;
`;

const Greeting = styled.h1`
  font-size: 3rem;
  margin: 0;
  background-color: darkslategray;
`;

const Time = styled.p`
  font-size: 1.5rem;
  margin: 0;
  background-color: darkslategray;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  background-color: darkslategray;
`;

const Button = styled.button`
  background-color: transparent;
  color: white;
  border: 2px solid white;
  padding: 10px 20px;
  font-size: large;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    color: darkslategray;
  }
`;

const Header = ({ activeComponent, togglePosts, toggleCreatePost }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <HeaderContainer>
      <Banner>
        <Logo src={logo} alt="Logo" />
        <Greeting>Hello Vickie</Greeting>
        <Time>{currentTime.toLocaleTimeString()}</Time>
      </Banner>
      <ButtonContainer>
        
        <Button onClick={toggleCreatePost}>
          {activeComponent === 'Create a Post'}
        </Button>
        <Button>view List</Button>
      </ButtonContainer>
    </HeaderContainer>
  );
};

export default Header;