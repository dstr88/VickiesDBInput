import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const HeaderContainer = styled.div`
  background-color: darkslategray;
  border-top: 2px;
  width: 100%vw;
  color: white;
  padding: 10px 20px;
  font-family: Arial, sans-serif;
  max-width: 100%;
`;

const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  background-color: darkslategray;
  border-bottom: 2px solid white;
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

const NavContainer = styled.nav`
  display: flex;
  background-color: darkslategray;
  border-top: 2px;
  width: 100%vw;
  gap: 20px;
  background-color: darkslategray;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  background-color: darkslategray;
  padding: 10px 0;
`;

const NavLink = styled(Link)`
  background-color: darkslategray;
  color: white;
  text-decoration: none;
  font-size: large;
  padding: 10px 20px;
  border: 2px solid white;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    color: darkslategray;
  }
`;

const Button = styled.button`
  background-color: darkslategray;
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

const Header = ({  showPosts, showCreatePost, togglePosts, toggleCreatePost, onLogout  }) => {
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
        <NavLink as="button" onClick={toggleCreatePost}>
          {showCreatePost ? 'Hide Create Post' : 'Create Post'}
        </NavLink>
        <Button onClick={onLogout}> view titles </Button>
      </ButtonContainer>
    </HeaderContainer>
  );
};

export default Header;