import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function NewAppointment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    specialty: "",
    doctor: "",
    date: "",
    time: "",
    duree: 30,
    notes: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const minDate = new Date().toISOString().split("T")[0];

  // Fetch all doctors and extract specialties
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/patient/medecins"); // fetch all doctors
        const allDoctors = Array.isArray(res.data) ? res.data : [];
        setDoctors(allDoctors);

        // Extract unique specialties from doctors
        const uniqueSpecialties = [...new Set(allDoctors.map(d => d.specialite).filter(Boolean))];
        setSpecialties(uniqueSpecialties);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors by selected specialty
  const filteredDoctors = doctors.filter(d => d.specialite === formData.specialty);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const { specialty, doctor, date, time, duree, notes } = formData;
  if (!specialty || !doctor || !date || !time || !duree) {
    setError("Please fill in all required fields.");
    return;
  }

  setIsLoading(true);

  try {
    // Minimal, defensive payload — send both English & French keys + ISO datetime
    const payload = {
      medecinId: doctor,
      date,
      time,
      duration: Number(duree),
      notes
    };



    console.log("Appointment payload:", payload);
    await api.post("/patient/rendez-vous", payload);
    navigate("/patient/appointments");
  } catch (err) {
    // Improved logging so you can see exact server response
    console.error("Full error object:", err);
    console.error("Response data:", err.response?.data);
    console.error("Response status:", err.response?.status);
    setError(err.response?.data?.message || `Failed to book appointment (status ${err.response?.status || "unknown"})`);
  } finally {
    setIsLoading(false);
  }
};



  return (
    <Page>
      <Top>
        <Title>Book an Appointment</Title>
        <Subtitle>Select a doctor and an available time slot</Subtitle>
        <BackLink to="/patient/appointments">← Back to appointments</BackLink>
      </Top>

      <Card>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorBox>{error}</ErrorBox>}

          <Row>
            <Label>Medical Specialty *</Label>
            <Select
              value={formData.specialty}
              onChange={e => setFormData(f => ({ ...f, specialty: e.target.value, doctor: "" }))}
            >
              <option value="">Select a specialty</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Row>

          <Row>
            <Label>Doctor *</Label>
            <Select
              value={formData.doctor}
              onChange={e => setFormData(f => ({ ...f, doctor: e.target.value }))}
              disabled={!formData.specialty}
            >
              <option value="">
                {formData.specialty ? "Select a doctor" : "Choose a specialty first"}
              </option>
              {filteredDoctors.map(d => (
                <option key={d._id} value={d._id}>
                  {d.firstName} {d.lastName}
                </option>
              ))}
            </Select>
          </Row>

          <RowGrid>
            <Field>
              <Label>Preferred Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                min={minDate}
                required
              />
            </Field>

            <Field>
              <Label>Preferred Time *</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
                required
              />
            </Field>

            <Field>
              <Label>Duration (minutes) *</Label>
              <Input
                type="number"
                value={formData.duree}
                min={10}
                max={180}
                onChange={e => setFormData(f => ({ ...f, duree: e.target.value }))}
                required
              />
            </Field>
          </RowGrid>

          <Row>
            <Label>Additional Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
              placeholder="Optional notes"
            />
          </Row>

          <Actions>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Booking..." : "Book Appointment"}
            </PrimaryButton>
            <SecondaryButton type="button" onClick={() => navigate(-1)}>Cancel</SecondaryButton>
          </Actions>
        </Form>
      </Card>
    </Page>
  );
}

/* ---------------------- Styled Components ---------------------- */
const Page = styled.div`padding: 2rem; max-width: 800px; margin: auto;`;
const Top = styled.div`margin-bottom: 1.5rem;`;
const Title = styled.h1`font-size: 1.8rem; margin-bottom: 0.5rem;`;
const Subtitle = styled.p`color: #555; margin-bottom: 0.5rem;`;
const BackLink = styled(Link)`color: #007bff; text-decoration: none; &:hover { text-decoration: underline; }`;
const Card = styled.div`background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);`;
const Form = styled.form`display: flex; flex-direction: column; gap: 1rem;`;
const Row = styled.div`display: flex; flex-direction: column;`;
const RowGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;`;
const Field = styled.div`display: flex; flex-direction: column;`;
const Label = styled.label`font-weight: 500; margin-bottom: 0.25rem;`;
const Input = styled.input`padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;`;
const Textarea = styled.textarea`padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;`;
const Select = styled.select`padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;`;
const Actions = styled.div`display: flex; gap: 1rem; margin-top: 1rem;`;
const PrimaryButton = styled.button`background-color: #007bff; color: #fff; border: none; padding: 0.6rem 1rem; border-radius: 4px; cursor: pointer;`;
const SecondaryButton = styled.button`background-color: #f0f0f0; color: #333; border: none; padding: 0.6rem 1rem; border-radius: 4px; cursor: pointer;`;
const ErrorBox = styled.div`background-color: #ffe0e0; color: #900; padding: 0.5rem 1rem; border-radius: 4px;`;
