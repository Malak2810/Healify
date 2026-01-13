import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

/**
 * Safe JWT payload parser (no external dependency).
 * Returns parsed payload object or null on failure.
 */
function parseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // pad with '='
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (err) {
    console.warn("Failed to parse JWT:", err);
    return null;
  }
}

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setSubmitting(true);
    try {
      let data = null;
      const endpoints = [
        "/auth/signin/admin",
        "/auth/signin/medecin",
        "/auth/signin/patient",
      ];

      // Try endpoints in order until one succeeds
      for (const ep of endpoints) {
        try {
          const res = await api.post(ep, { email, password });
          // Expect consistent response shape: { token, user: { ...role... } }
          if (res?.data) {
            data = res.data;
            console.log(`Successful login via ${ep}`, data);
            break;
          }
        } catch (err) {
          // Log server response for debugging (don't reveal to user)
          console.warn(`Signin attempt failed for ${ep}:`, err.response?.data || err.message);
        }
      }

      if (!data) {
        setError("Invalid credentials or server error.");
        return;
      }

      // Extract token (support common names)
      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.user?.token ||
        null;

      if (!token) {
        setError("No token returned from server");
        return;
      }

      // Extract user info (prefer explicit user object)
      const userContainer = data.user || data.data || data;
      const name =
        userContainer?.name ||
        userContainer?.fullName ||
        (userContainer?.firstName && `${userContainer.firstName} ${userContainer.lastName}`) ||
        userContainer?.email ||
        "User";

      // First preference: role from returned user object
      let rawType = userContainer?.role || userContainer?.type || data.role || data.userType || null;

      // Fallback: try decoding JWT payload for role field
      if (!rawType) {
        const payload = parseJwt(token);
        if (payload?.role || payload?.type) {
          rawType = payload.role || payload.type;
          console.log("Role inferred from JWT payload:", rawType);
        }
      }

      if (!rawType) {
        console.error("Login succeeded but no role provided by server or token. Response:", data);
        setError("Login succeeded but no role information returned. Contact admin.");
        return;
      }

      const type = String(rawType).toLowerCase();

      // Save user and token
      const userData = { name, type, token };
      if (typeof setUser === "function") setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token); // for Axios interceptors

      // Navigate to the correct dashboard
      if (type === "admin") navigate("/admin/dashboard");
      else if (type === "medecin") navigate("/medecin/dashboard");
      else if (type === "patient") navigate("/patient/dashboard");
      else {
        console.warn("Unknown role:", type);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Log in to your account</Title>
        {error && <Error>{error}</Error>}

        <Field>
          <InputWrap>
            <Icon><AiOutlineMail /></Icon>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </InputWrap>
        </Field>

        <Field>
          <InputWrap>
            <Icon><AiOutlineLock /></Icon>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </InputWrap>
        </Field>

        <Button type="submit" disabled={submitting}>
          {submitting ? <><Loader size={18} />&nbsp;Logging in...</> : "Log in"}
        </Button>

        <Bottom>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Bottom>
      </Form>
    </Container>
  );
};

export default Login;

/* ---------------- Styled Components ---------------- */
const Container = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg,#f5f8ff, #eef6ff);
  padding: 28px;
`;

const Form = styled.form`
  background: #fff;
  padding: 26px;
  border-radius: 10px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 12px 30px rgba(12,32,80,0.06);
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  color: #0b2b63;
  text-align: center;
`;

const Error = styled.div`
  background: #fff1f2;
  color: #7f1d1d;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const Field = styled.div`margin-bottom: 12px;`;

const InputWrap = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  border: 1px solid #e6eefb;
  padding: 10px 12px;
  border-radius: 8px;
`;

const Icon = styled.div`color: #2a6df6; font-size: 1.15rem; flex-shrink: 0;`;

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  &::placeholder{ color: #94a3b8; }
`;

const Button = styled.button`
  margin-top: 8px;
  width: 100%;
  background: linear-gradient(90deg,#2a6df6,#4f46e5);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content:center;
  gap:8px;
  &:disabled{ opacity: 0.7; cursor: not-allowed; }
`;

const Bottom = styled.p`
  margin-top: 12px;
  text-align: center;
  color: #64748b;
  a { color: #2a6df6; text-decoration: underline; }
`;
