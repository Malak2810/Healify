// src/pages/patient/PatientProfile.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../services/api";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    cin: "",
  });

  const [originalProfile, setOriginalProfile] = useState({}); // store original profile

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  // --- Fetch patient profile on mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/patient/profile");
        const data = res.data;

        const formattedProfile = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.telephone || "",
          birthDate: data.birthDate ? data.birthDate.slice(0, 10) : "",
          address: data.address || "",
          cin: data.cin || "",
        };

        setProfile(formattedProfile);
        setOriginalProfile(formattedProfile); // set originalProfile
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  // --- Handlers ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Update Profile ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Detect changes
    const updatedData = {};
    Object.keys(profile).forEach((key) => {
      if (profile[key] !== originalProfile[key] && key !== "email" && key !== "cin") {
        updatedData[key === "phone" ? "telephone" : key] = profile[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      setError("No changes detected");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.put("/patient/profile", updatedData);
      setSuccessMessage(res.data?.message || "Profile updated successfully");

      setOriginalProfile((prev) => ({ ...prev, ...profile })); // update originalProfile
      setIsEditMode(false);

      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Change Password ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.put("/patient/change-password", {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccessMessage(res.data?.message || "Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <Container>
        <Header>
          <Heading>Patient Profile</Heading>
          <Subheading>Manage your personal information and account security</Subheading>
        </Header>

        <Tabs>
          <TabList>
            <TabButton
              active={activeTab === "personal"}
              onClick={() => { setActiveTab("personal"); setError(""); setSuccessMessage(""); }}
            >
              Personal Information
            </TabButton>
            <TabButton
              active={activeTab === "security"}
              onClick={() => { setActiveTab("security"); setError(""); setSuccessMessage(""); }}
            >
              Security
            </TabButton>
          </TabList>

          {activeTab === "personal" && (
            <TabPanel>
              {successMessage && <SuccessBox>{successMessage}</SuccessBox>}
              {error && <ErrorBox>{error}</ErrorBox>}

              <Card>
                <Form onSubmit={handleUpdateProfile}>
                  <Grid2>
                    <Field>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleProfileChange} disabled={!isEditMode} />
                    </Field>
                    <Field>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleProfileChange} disabled={!isEditMode} />
                    </Field>
                  </Grid2>

                  <Grid2>
                    <Field>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={profile.email} disabled />
                    </Field>
                    <Field>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleProfileChange} disabled={!isEditMode} />
                    </Field>
                  </Grid2>

                  <Grid2>
                    <Field>
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input id="birthDate" name="birthDate" type="date" value={profile.birthDate} onChange={handleProfileChange} disabled={!isEditMode} />
                    </Field>
                    <Field>
                      <Label htmlFor="cin">National ID (CIN)</Label>
                      <Input id="cin" name="cin" value={profile.cin} disabled />
                    </Field>
                  </Grid2>

                  <Field>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={profile.address} onChange={handleProfileChange} disabled={!isEditMode} />
                  </Field>

                  <Actions>
                    {!isEditMode ? (
                      <Primary type="button" onClick={() => setIsEditMode(true)}>Edit Profile</Primary>
                    ) : (
                      <>
                        <Primary type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Primary>
                        <Outline type="button" onClick={() => setIsEditMode(false)}>Cancel</Outline>
                      </>
                    )}
                  </Actions>
                </Form>
              </Card>
            </TabPanel>
          )}

          {activeTab === "security" && (
            <TabPanel>
              {successMessage && <SuccessBox>{successMessage}</SuccessBox>}
              {error && <ErrorBox>{error}</ErrorBox>}

              <Card>
                <Form onSubmit={handleChangePassword}>
                  <Field>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                  </Field>

                  <Field>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                  </Field>

                  <Field>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                  </Field>

                  <Actions>
                    <Primary type="submit" disabled={isLoading}>{isLoading ? "Updating..." : "Change Password"}</Primary>
                  </Actions>
                </Form>
              </Card>
            </TabPanel>
          )}
        </Tabs>
      </Container>
    </Page>
  );
}


/* ---------------- Styled Components ---------------- */

const Page = styled.main`
  width: 100%;
  max-width: 980px;
  margin: 28px auto;
  padding: 0 16px;
  font-family: "Poppins", sans-serif;
`;

const Container = styled.div``;

const Header = styled.div`
  margin-bottom: 18px;
`;

const Heading = styled.h1`
  margin: 0 0 6px 0;
  font-size: 1.6rem;
  color: #0b2b63;
`;

const Subheading = styled.p`
  margin: 0;
  color: #64748b;
`;

const Tabs = styled.div``;

const TabList = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eef2f7;
`;

const TabButton = styled.button`
  background: ${(p) => (p.active ? "#eef2ff" : "transparent")};
  color: ${(p) => (p.active ? "#0b2b63" : "#64748b")};
  padding: 8px 14px;
  border-radius: 10px 10px 0 0;
  border: none;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #f1f8ff;
  }
`;

const TabPanel = styled.div``;

const Card = styled.section`
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  border: 1px solid #e6eefb;
  box-shadow: 0 10px 25px rgba(12, 32, 80, 0.04);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6eefb;
  font-size: 0.95rem;
  outline: none;
  &:disabled {
    background: #f8fafc;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

const Primary = styled.button`
  flex: 1;
  background: linear-gradient(90deg, #2a6df6, #4f46e5);
  color: white;
  padding: 12px 14px;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Outline = styled.button`
  flex: 1;
  background: #fff;
  color: #0f172a;
  padding: 12px 14px;
  border-radius: 10px;
  font-weight: 700;
  border: 1px solid #e6eefb;
  cursor: pointer;
`;

const SuccessBox = styled.div`
  background: #ecfdf5;
  color: #065f46;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid rgba(16, 185, 129, 0.08);
`;

const ErrorBox = styled.div`
  background: #fff1f2;
  color: #7f1d1d;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid rgba(220, 38, 38, 0.08);
`;
