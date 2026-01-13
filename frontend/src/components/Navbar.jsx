// src/components/Navbar.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbar({ userType, userName, setUser }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isGuest = !userType;

  const handleLogout = () => {
    setUser(null); // clears localStorage + App state
    navigate("/login");
  };

  const getDashboardLink = () => {
    switch (userType) {
      case "patient":
        return "/patient/dashboard";
      case "medecin":
        return "/doctor/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <Nav>
      <Inner>
        {/* Logo */}
        <BrandLink to={getDashboardLink()}>
          <LogoMark>H</LogoMark>
          <BrandText>Healify</BrandText>
        </BrandLink>

        {/* Center links */}
        <Center>
          {isGuest && (
            <NavLinks>
              <NavLink href="#services">Services</NavLink>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#contact">Contact</NavLink>
            </NavLinks>
          )}
        </Center>

        {/* Right */}
        <Right>
          {!isGuest && (
            <DesktopActions>
              {userName && <UserName>{userName}</UserName>}
              <GhostButton onClick={handleLogout}>
                <LogOutIcon />
                Logout
              </GhostButton>
            </DesktopActions>
          )}

          {isGuest && (
            <DesktopActions>
              <GhostButtonLink to="/login">Login</GhostButtonLink>
              <PrimaryButton to="/signup">Sign Up</PrimaryButton>
            </DesktopActions>
          )}

          <MobileToggle onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </MobileToggle>
        </Right>
      </Inner>

      {/* Mobile menu */}
      {mobileOpen && (
        <MobileMenu>
          {!isGuest ? (
            <>
              {userName && <MobileUser>{userName}</MobileUser>}
              <MobileButton
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
              >
                <LogOutIcon />
                Logout
              </MobileButton>
            </>
          ) : (
            <>
              <MobileLink href="#services" onClick={() => setMobileOpen(false)}>
                Services
              </MobileLink>
              <MobileLink href="#about" onClick={() => setMobileOpen(false)}>
                About
              </MobileLink>
              <MobileLink href="#contact" onClick={() => setMobileOpen(false)}>
                Contact
              </MobileLink>
              <MobileLink to="/signup" as={Link} onClick={() => setMobileOpen(false)}>
                Sign Up
              </MobileLink>
              <MobileLink to="/login" as={Link} onClick={() => setMobileOpen(false)}>
                Login
              </MobileLink>
            </>
          )}
        </MobileMenu>
      )}
    </Nav>
  );
}

/* ---------------- Styled Components ---------------- */
const Nav = styled.header`
  position: sticky;
  top: 10px;
  left: 50%;
  transform: translateX(-5%);
  width: 90%;
  max-width: 1400px;
  z-index: 100;
  background: #ffffff;
  border-radius: 40px;
  padding: 14px 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BrandLink = styled(Link)`
  display: flex;
  gap: 12px;
  align-items: center;
  text-decoration: none;
`;

const LogoMark = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #2a6df6, #4f46e5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
`;

const BrandText = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #2a6df6, #4f46e5);
  -webkit-background-clip: text;
  color: transparent;
`;

const Center = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 32px;
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #2a6df6;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const DesktopActions = styled.div`
  display: none;
  gap: 14px;
  align-items: center;
  @media (min-width: 768px) {
    display: flex;
  }
`;

const UserName = styled.span`
  color: #475569;
  font-weight: 500;
`;

const GhostButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 12px;
  font-weight: 600;

  &:hover {
    background: #e0e0e0;
  }
`;

const GhostButtonLink = styled(Link)`
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  background: #f5f5f5;
  color: #0f172a;

  &:hover {
    background: #e0e0e0;
  }
`;

const PrimaryButton = styled(Link)`
  padding: 10px 22px;
  border-radius: 25px;
  font-weight: 700;
  background: linear-gradient(135deg, #2a6df6, #4f46e5);
  color: white;
  text-decoration: none;

  &:hover {
    opacity: 0.9;
  }
`;

const MenuIcon = styled(Menu)`
  width: 28px;
  height: 28px;
`;
const XIcon = styled(X)`
  width: 28px;
  height: 28px;
`;
const LogOutIcon = styled(LogOut)`
  width: 18px;
  height: 18px;
`;

const MobileToggle = styled.button`
  display: flex;
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 8px;
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #ffffff;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
`;

const MobileUser = styled.p`
  font-weight: 600;
  color: #111827;
`;

const MobileButton = styled.button`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  &:hover {
    background: #e0e0e0;
  }
`;

const MobileLink = styled(Link)`
  padding: 12px;
  border-radius: 12px;
  background: #f5f5f5;
  text-decoration: none;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
  &:hover {
    background: #e0e0e0;
  }
`;
