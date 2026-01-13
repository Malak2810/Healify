// src/pages/Home.jsx
import React from "react";
import styled from "styled-components";
import img from "../assets/healthcare-illustration.png";

const Home = () => {
  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroOverlay>
          <HeroContent>
            <Title>Welcome to Healify</Title>
            <Subtitle>
              Connecting patients and doctors seamlessly. Find the care you need, when you need it.
            </Subtitle>
            <CTAButton>Get Started</CTAButton>
          </HeroContent>
        </HeroOverlay>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <Feature>
          <FeatureIcon>🩺</FeatureIcon>
          <FeatureTitle>Find Doctors</FeatureTitle>
          <FeatureDesc>Search and book appointments with the best specialists in your city.</FeatureDesc>
        </Feature>
        <Feature>
          <FeatureIcon>📅</FeatureIcon>
          <FeatureTitle>Easy Scheduling</FeatureTitle>
          <FeatureDesc>Manage your appointments with our simple and user-friendly calendar.</FeatureDesc>
        </Feature>
        <Feature>
          <FeatureIcon>💬</FeatureIcon>
          <FeatureTitle>Chat & Consult</FeatureTitle>
          <FeatureDesc>Ask questions and get advice from certified doctors directly.</FeatureDesc>
        </Feature>
      </FeaturesSection>

      {/* Services Section */}
      <Section id="services">
        <SectionTitle>Our Services</SectionTitle>
        <SectionDesc>
          Healify offers comprehensive healthcare services delivered by experienced medical professionals through secure video consultations. Our main services include:
        </SectionDesc>
        <ServiceList>
          <ServiceItem>General Consultation – Get advice from certified doctors on common health issues.</ServiceItem>
          <ServiceItem>Specialist Consultation – Book appointments with cardiologists, dermatologists, and more.</ServiceItem>
          <ServiceItem>Medical Checkups – Schedule complete health checkups conveniently from home.</ServiceItem>
          <ServiceItem>Prescription Management – Receive and manage prescriptions digitally.</ServiceItem>
        </ServiceList>
      </Section>

      {/* About Section */}
      <Section id="about" bg="#f0f4f8">
        <SectionTitle>About Healify</SectionTitle>
        <SectionDesc>
          Healify is dedicated to bridging the gap between patients and doctors, making healthcare more accessible and convenient for everyone. 
          We believe in leveraging technology to simplify healthcare and ensure timely medical assistance for all.
        </SectionDesc>
      </Section>

      {/* Contact Section */}
      {/* Contact Section */}
      <ContactSection id="contact">
        <SectionTitle>Get in Touch</SectionTitle>
        <SectionDesc>
          If you have any questions, need support, or want to book a consultation,
          feel free to contact us anytime. We’re here to help you.
        </SectionDesc>

        <StyledWrapper>
          <form className="form">
            <div className="title">Contact us</div>

            <input type="text" placeholder="Your email" className="input" />

            <textarea placeholder="Your message" />

            <button>Submit</button>
          </form>
        </StyledWrapper>
      </ContactSection>

    </Container>
  );
};

export default Home;

// ---------------- Styled Components ----------------

/* in src/pages/Home.jsx */
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
  background: #f5f8ff;
+  padding-top: 92px; /* space for fixed navbar (nav height 72px + 20px offset) */
`;


const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 140px 20px;
  position: relative;
  min-height: 80vh;
  background: url(${img}) center/cover no-repeat;
  background-size: cover;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.4)
    );
    z-index: 1;
  }
`;

const HeroOverlay = styled.div`
  position: relative;
  z-index: 3;
  background: rgba(255, 255, 255, 0.1);
  padding: 60px 40px;
  border-radius: 20px;
`;

const HeroContent = styled.div`
  color: #fff;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);

  @media (min-width: 768px) { font-size: 3.8rem; }
  @media (min-width: 1024px) { font-size: 4.5rem; }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 32px;
  line-height: 1.6;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);

  @media (min-width: 768px) { font-size: 1.5rem; }
  @media (min-width: 1024px) { font-size: 1.7rem; }
`;

const CTAButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 14px 32px;
  border: 2px solid #fff;
  border-radius: 50px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-4px) scale(1.05);
  }
`;

const FeaturesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 100px 20px;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Feature = styled.div`
  background: #ffffff;
  padding: 40px 28px;
  border-radius: 20px;
  text-align: center;
  flex: 1;
  max-width: 300px;
  transition: all 0.4s ease;
  box-shadow: 0 8px 25px rgba(20, 40, 80, 0.08);

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 15px 35px rgba(20, 40, 80, 0.12);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 18px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #1e293b;
`;

const FeatureDesc = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
`;

/* in src/pages/Home.jsx */
const Section = styled.section`
  padding: 100px 20px;
  text-align: center;
  background: ${({ bg }) => bg || "transparent"};
+  scroll-margin-top: 110px; /* ensures anchors scroll below the navbar */
`;


const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: #1e293b;
`;

const SectionDesc = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 40px auto;
  color: #475569;
  line-height: 1.6;
`;

const ServiceList = styled.ul`
  list-style: none;
  max-width: 600px;
  margin: 0 auto;
  padding: 0;
  text-align: left;
`;

const ServiceItem = styled.li`
  padding: 12px 0;
  font-size: 1.1rem;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
`;

/* ---------------- Contact Form Styles ---------------- */
const ContactSection = styled.section`
  padding: 100px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
  text-align: center;
`;

const StyledWrapper = styled.div`
  margin-top: 30px;

  .form {
    position: relative;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    width: 350px;
    background-color: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 30px 30px -30px rgba(27, 26, 26, 0.3);
  }

  .form .title {
    color: royalblue;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
  }

  .form input {
    outline: none;
    border: 1px solid rgb(219, 213, 213);
    padding: 10px 14px;
    border-radius: 8px;
    width: 100%;
    height: 45px;
  }

  .form textarea {
    border-radius: 8px;
    height: 120px;
    width: 100%;
    resize: none;
    outline: none;
    padding: 10px 14px;
    border: 1px solid rgb(219, 213, 213);
  }

  .form button {
    align-self: flex-end;
    padding: 10px 18px;
    outline: none;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    background-color: royalblue;
    color: white;
    cursor: pointer;
  }
`;
