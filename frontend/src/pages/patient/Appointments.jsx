// src/pages/patient/Appointments.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";
import api from "../../services/api"; // your axios instance

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/patient/rendez-vous");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "scheduled":
        return { bg: "#e6f0ff", color: "#1e3a8a" };
      case "completed":
        return { bg: "#ecfdf5", color: "#065f46" };
      case "canceled":
        return { bg: "#fff1f2", color: "#7f1d1d" };
      default:
        return { bg: "#f1f5f9", color: "#374151" };
    }
  };

  return (
    <Main>
      <Header>
        <HeaderLeft>
          <Title>Your Appointments</Title>
          <Subtitle>Manage and track your medical appointments</Subtitle>
        </HeaderLeft>

        <HeaderRight>
          <StyledLink to="/patient/appointments/new" primary>
            New Appointment
          </StyledLink>
        </HeaderRight>
      </Header>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length > 0 ? (
        <List>
          {appointments.map((apt) => {
            const doctor = apt.medecinId; // populated doctor
            const statusStyle = getStatusStyles(apt.status || "scheduled");
            return (
              <Card key={apt._id}>
                <CardContent>
                  <Left>
                    <DoctorRow>
                      <UserIcon>
                        <User size={16} />
                      </UserIcon>
                      <DoctorName>
                        {doctor.firstName} {doctor.lastName}
                      </DoctorName>
                      <StatusBadge style={{ background: statusStyle.bg, color: statusStyle.color }}>
                        {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : "Scheduled"}
                      </StatusBadge>
                    </DoctorRow>

                    <Specialty>{doctor.specialite}</Specialty>

                    <Grid>
                      <GridItem>
                        <Calendar size={14} />
                        <small>{new Date(apt.date).toLocaleDateString()}</small>
                      </GridItem>
                      <GridItem>
                        <Clock size={14} />
                        <small>{apt.heure}</small>
                      </GridItem>
                    </Grid>

                    {apt.notes && (
                      <Notes>
                        <strong>Notes:</strong> {apt.notes}
                      </Notes>
                    )}
                  </Left>

                  <Right>
                    {apt.status === "scheduled" && (
                      <>
                        <SmallButton as="button" onClick={() => alert("Reschedule (not implemented)")}>
                          Reschedule
                        </SmallButton>
                        <SmallDanger onClick={() => alert("Cancel (not implemented)")}>Cancel</SmallDanger>
                      </>
                    )}

                    {apt.status === "completed" && (
                      <SmallButton as={Link} to={`/patient/appointments/${apt._id}`}>
                        View Details
                      </SmallButton>
                    )}
                  </Right>
                </CardContent>
              </Card>
            );
          })}
        </List>
      ) : (
        <EmptyCard>
          <EmptyText>No appointments scheduled</EmptyText>
          <EmptyActions>
            <StyledLink to="/patient/appointments/new" primary>
              Book Your First Appointment
            </StyledLink>
          </EmptyActions>
        </EmptyCard>
      )}
    </Main>
  );
}

/* ----- Styled Components ----- */

const Main = styled.main`
  max-width: 1100px;
  margin: 2.5rem auto;
  padding: 0 1rem;
  font-family: 'Poppins', sans-serif;
`;

const Header = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  color: #0b2b63;
`;

const Subtitle = styled.p`
  margin: 6px 0 0 0;
  color: #64748b;
  font-size: 0.95rem;
`;

const HeaderRight = styled.div``;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 9px 14px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  color: white;
  background: ${(p) => (p.primary ? "linear-gradient(90deg,#2a6df6,#4f46e5)" : "#f3f4f6")};
  color: ${(p) => (p.primary ? "white" : "#0f172a")};
  &:hover {
    opacity: 0.95;
  }
`;

/* List + cards */
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e6eefb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(12, 32, 80, 0.04);
  overflow: hidden;
`;

const CardContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  justify-content: space-between;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
`;

const DoctorRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 6px;
`;

const UserIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #eef2ff, #eef6ff);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #2a6df6;
  flex-shrink: 0;
`;

const DoctorName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`;

const StatusBadge = styled.span`
  margin-left: 10px;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Specialty = styled.div`
  color: #475569;
  font-size: 0.95rem;
  margin-bottom: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 6px;
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const GridItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  color: #475569;
  font-size: 0.9rem;

  svg { color: #2a6df6; }
`;

const Notes = styled.p`
  margin-top: 10px;
  color: #475569;
  font-size: 0.9rem;
  border-top: 1px solid #eef2f7;
  padding-top: 10px;
`;

const Right = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

/* small buttons */
const SmallButton = styled.button`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e6eefb;
  background: #ffffff;
  font-weight: 600;
  cursor: pointer;
  color: #0f172a;
  &:hover { background: #f5f7fb; }
`;

const SmallDanger = styled.button`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #f8d7da;
  background: #fff1f2;
  font-weight: 600;
  cursor: pointer;
  color: #7f1d1d;
  &:hover { background: #fde8ec; }
`;

/* Empty / fallback */
const EmptyCard = styled.div`
  background: #fff;
  border: 1px dashed #e6eefb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const EmptyText = styled.p`
  color: #64748b;
  margin-bottom: 12px;
  font-size: 0.95rem;
`;

const EmptyActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;
