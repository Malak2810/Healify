// src/components/Footer.jsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

// Floating animation for social icons
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Logo>Healify</Logo>
        <SocialIcons>
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaLinkedinIn /></a>
        </SocialIcons>

        <Copyright>© 2025 Malak Zouaidi. All rights reserved.</Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

// Styled Components
const FooterContainer = styled.footer`
  position: relative;
  bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, #2a6df6, #4f46e5);
  color: #fff;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
  animation: ${fadeIn} 0.8s ease forwards;

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(to right, #2a6df6, #4f46e5, #2a6df6);
    filter: blur(10px);
    opacity: 0.6;
  }
`;

const FooterContent = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  @media (min-width: 680px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Logo = styled.h2`
  font-size: 1.7rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.2);
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;

  a {
    color: #fff;
    font-weight: 500;
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;

    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      left: 0;
      bottom: -4px;
      background: #fff;
      transition: width 0.3s ease;
    }

    &:hover:after {
      width: 100%;
    }

    &:hover {
      color: #d1d5db; // light grey
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 18px;
  justify-content: center;

  a {
    color: #fff;
    font-size: 1.4rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
      color: #a600ffff; // golden highlight
      transform: scale(1.2);
      animation: ${float} 0.6s ease-in-out infinite;
    }
  }
`;

const Copyright = styled.p`
  font-size: 0.85rem;
  margin: 0;
  color: #e0e7ff;
  text-align: center;
  @media (min-width: 680px) {
    text-align: right;
  }
`;
