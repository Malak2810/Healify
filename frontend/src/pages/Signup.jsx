import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlinePhone,
  AiOutlineCalendar,
  AiOutlineHome,
  AiOutlineIdcard,
} from "react-icons/ai";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    cin: "",
    phone: "",
    birthDate: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setApiError("");
    if (submitted) setErrors(validate({ ...form, [name]: value }));
  };

  const validate = (values = form) => {
    const e = {};
    if (!values.firstName.trim()) e.firstName = "First name is required";
    if (!values.lastName.trim()) e.lastName = "Last name is required";
    if (!values.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = "Invalid email";
    if (!values.password) e.password = "Password is required";
    else if (values.password.length < 6) e.password = "Password must be at least 6 characters";
    if (values.password !== values.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!values.phone.trim()) e.phone = "Phone is required";
    if (!values.cin.trim()) e.cin = "CIN is required";
    if (!values.birthDate) e.birthDate = "Birthdate is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    try {
      setSubmitting(true);

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        cin: form.cin,
        email: form.email,
        password: form.password,
        telephone: form.phone,
        birthDate: form.birthDate,
        address: form.address,
      };

      const res = await api.post("/auth/signup/patient", payload); // Removed /api
      const returned = res.data || {};

      const token =
        returned.token ||
        returned.accessToken ||
        returned.data?.token ||
        returned?.user?.token ||
        null;

      const name =
        (returned.user && (returned.user.name || returned.user.fullName)) ||
        returned.name ||
        `${payload.firstName} ${payload.lastName}` ||
        null;

      const rawType =
        (returned.user && (returned.user.role || returned.user.type)) ||
        returned.role ||
        returned.userType ||
        null;

      const type = rawType ? String(rawType).toLowerCase() : "patient";

      if (token) {
        const userData = { name, type, token };

        if (typeof setUser === "function") setUser(userData);
        else localStorage.setItem("user", JSON.stringify(userData));

        if (type === "patient") navigate("/patient/dashboard");
        else if (type === "medecin") navigate("/medecin/dashboard"); // fixed
        else if (type === "admin") navigate("/admin/dashboard");
        else navigate("/");
        return;
      }

      const msg = returned.message || "Account created successfully. Please login.";
      navigate("/login", { replace: true, state: { successMessage: msg } });
    } catch (err) {
      console.error("signup error:", err);
      setApiError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <FormWrapper onSubmit={handleSubmit} noValidate>
        {apiError && <ApiError>{apiError}</ApiError>}

        <Row>
          <Field>
            <Label>First Name</Label>
            <InputWrap>
              <Icon><AiOutlineUser /></Icon>
              <Input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
            </InputWrap>
            {submitted && errors.firstName && <FieldError>{errors.firstName}</FieldError>}
          </Field>

          <Field>
            <Label>Last Name</Label>
            <InputWrap>
              <Icon><AiOutlineUser /></Icon>
              <Input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
            </InputWrap>
            {submitted && errors.lastName && <FieldError>{errors.lastName}</FieldError>}
          </Field>
        </Row>

        <Row>
          <Field>
            <Label>Phone</Label>
            <InputWrap>
              <Icon><AiOutlinePhone /></Icon>
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
            </InputWrap>
            {submitted && errors.phone && <FieldError>{errors.phone}</FieldError>}
          </Field>

          <Field>
            <Label>Birthdate</Label>
            <InputWrap>
              <Icon><AiOutlineCalendar /></Icon>
              <Input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
            </InputWrap>
            {submitted && errors.birthDate && <FieldError>{errors.birthDate}</FieldError>}
          </Field>
        </Row>

        <Field>
          <Label>CIN</Label>
          <InputWrap>
            <Icon><AiOutlineIdcard /></Icon>
            <Input name="cin" value={form.cin} onChange={handleChange} placeholder="CIN" />
          </InputWrap>
          {submitted && errors.cin && <FieldError>{errors.cin}</FieldError>}
        </Field>

        <Field>
          <Label>Email</Label>
          <InputWrap>
            <Icon><AiOutlineMail /></Icon>
            <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
          </InputWrap>
          {submitted && errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>

        <Row>
          <Field>
            <Label>Password</Label>
            <InputWrap>
              <Icon><AiOutlineLock /></Icon>
              <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
            </InputWrap>
            {submitted && errors.password && <FieldError>{errors.password}</FieldError>}
          </Field>

          <Field>
            <Label>Confirm Password</Label>
            <InputWrap>
              <Icon><AiOutlineLock /></Icon>
              <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
            </InputWrap>
            {submitted && errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
          </Field>
        </Row>

        <Field>
          <Label>Address</Label>
          <InputWrap>
            <Icon><AiOutlineHome /></Icon>
            <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
          </InputWrap>
        </Field>

        <SubmitRow>
          <Submit type="submit" disabled={submitting}>
            {submitting ? <><Loader size={18} />&nbsp;Creating...</> : "Sign up"}
          </Submit>
        </SubmitRow>

        <FooterText>
          Already have an account? <Link to="/login">Sign in</Link>
        </FooterText>
      </FormWrapper>
    </Container>
  );
};

export default Signup;

/* Styled components (unchanged) */
const Container = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #f5f8ff 0%, #eef6ff 100%);
  padding: 32px;
  box-sizing: border-box;
`;

const FormWrapper = styled.form`
  width: 100%;
  max-width: 720px;
  background: #fff;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(20,40,80,0.06);
  animation: ${fadeIn} 300ms ease both;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  width: 100%;
  @media (max-width: 680px) { flex-direction: column; }
`;

const Field = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  color: #475569;
  margin-bottom: 6px;
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e6eefb;
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff;
`;

const Icon = styled.div`
  color: #2a6df6;
  font-size: 1.1rem;
  margin-right: 8px;
  flex-shrink: 0;
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 0.95rem;
  width: 100%;
  background: transparent;
  color: #0f172a;
  &::placeholder { color: #94a3b8; }
`;

const FieldError = styled.span`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 6px;
`;

const ApiError = styled.div`
  background: #fff1f2;
  color: #7f1d1d;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid rgba(220,38,38,0.08);
`;

const SubmitRow = styled.div`
  margin-top: 10px;
`;

const Submit = styled.button`
  width: 100%;
  background: linear-gradient(90deg,#2a6df6,#4f46e5);
  color: #fff;
  border: none;
  padding: 12px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const FooterText = styled.p`
  margin-top: 12px;
  text-align: center;
  color: #64748b;
  a { color: #2a6df6; text-decoration: underline; }
`;
