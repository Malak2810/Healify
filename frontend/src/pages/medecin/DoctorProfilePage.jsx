// src/pages/doctor/DoctorProfilePage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../services/api";

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    specialite: "",
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch doctor profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/medecin/profile");
        setProfile({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          telephone: res.data.telephone,
          specialite: res.data.specialite,
        });
        setOriginalProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await api.put("/medecin/profile", {
        firstName: profile.firstName,
        lastName: profile.lastName,
        telephone: profile.telephone,
        specialite: profile.specialite,
      });

      setSuccessMessage(res.data.message);
      setOriginalProfile(profile);
      setIsEditMode(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.put("/medecin/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMessage(res.data.message);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <Page>
      <Header>
        <Title>Doctor Profile</Title>
        <Subtitle>Manage your personal info and security</Subtitle>
      </Header>

      <Tabs>
        <TabButton
          active={activeTab === "personal"}
          onClick={() => setActiveTab("personal")}
        >
          Personal Info
        </TabButton>

        <TabButton
          active={activeTab === "security"}
          onClick={() => setActiveTab("security")}
        >
          Security
        </TabButton>
      </Tabs>

      {successMessage && <SuccessBox>{successMessage}</SuccessBox>}
      {error && <ErrorBox>{error}</ErrorBox>}

      {activeTab === "personal" && (
        <Card>
          <Form onSubmit={handleUpdateProfile}>
            <Field>
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                disabled={!isEditMode}
              />
            </Field>

            <Field>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                disabled={!isEditMode}
              />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input name="email" value={profile.email} disabled />
            </Field>

            <Field>
              <Label>Phone</Label>
              <Input
                name="telephone"
                value={profile.telephone}
                onChange={handleProfileChange}
                disabled={!isEditMode}
              />
            </Field>

            <Field>
              <Label>Specialty</Label>
              <Input
                name="specialite"
                value={profile.specialite}
                onChange={handleProfileChange}
                disabled={!isEditMode}
              />
            </Field>

            <Actions>
              {!isEditMode ? (
                <Primary type="button" onClick={() => setIsEditMode(true)}>
                  Edit
                </Primary>
              ) : (
                <>
                  <Primary type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Primary>
                  <Outline type="button" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Outline>
                </>
              )}
            </Actions>
          </Form>
        </Card>
      )}

      {activeTab === "security" && (
        <Card>
          <Form onSubmit={handleChangePassword}>
            <Field>
              <Label>Current Password</Label>
              <Input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                required
              />
            </Field>

            <Field>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </Field>

            <Field>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </Field>

            <Primary type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Primary>
          </Form>
        </Card>
      )}
    </Page>
  );
}

/* ---------------- Styled Components ---------------- */
const Page = styled.div`
  max-width: 900px;
  margin: 20px auto;
  font-family: "Poppins", sans-serif;
`;

const Header = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h1`
  margin: 0;
  color: #0b2b63;
`;

const Subtitle = styled.p`
  margin: 2px 0 0 0;
  color: #64748b;
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`;

const TabButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${(p) => (p.active ? "#eef2ff" : "#f5f5f5")};
  color: ${(p) => (p.active ? "#0b2b63" : "#64748b")};
  font-weight: 600;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #475569;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e6eefb;
  &:disabled {
    background: #f8fafc;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const Primary = styled.button`
  flex: 1;
  background: #4f46e5;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
`;

const Outline = styled.button`
  flex: 1;
  background: #fff;
  color: #0f172a;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e6eefb;
  cursor: pointer;
`;

const SuccessBox = styled.div`
  background: #ecfdf5;
  color: #065f46;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const ErrorBox = styled.div`
  background: #fff1f2;
  color: #7f1d1d;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
`;
