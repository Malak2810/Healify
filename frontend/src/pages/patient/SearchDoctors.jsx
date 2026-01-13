// src/pages/patient/SearchDoctors.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Clock, Phone } from "lucide-react";
import api from "../../services/api";

export default function SearchDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/patient/search-medecins", {
        params: { specialite: searchTerm }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specialties = ["All Specialties", ...Array.from(new Set(doctors.map((d) => d.specialite)))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.firstName
      .concat(" ", doctor.lastName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialite === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const daysOrder = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

  return (
    <Page>
      <Inner>
        <Header>
          <Heading>Find a Doctor</Heading>
          <Subheading>Search and browse doctors by specialty</Subheading>
        </Header>

        <FiltersCard>
          <FiltersContent>
            <FilterColumn>
              <Label htmlFor="search">Search Doctor</Label>
              <Input
                id="search"
                placeholder="Doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FilterColumn>

            <FilterColumn>
              <Label htmlFor="specialty">Specialty</Label>
              <Select
                id="specialty"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map((s) => (
                  <option key={s} value={s === "All Specialties" ? "all" : s}>
                    {s}
                  </option>
                ))}
              </Select>
            </FilterColumn>
          </FiltersContent>
        </FiltersCard>

        {loading ? (
          <p>Loading doctors...</p>
        ) : filteredDoctors.length > 0 ? (
          <Grid>
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id}>
                <CardHeader>
                  <HeaderLeft>
                    <DoctorName>
                      {doctor.firstName} {doctor.lastName}
                    </DoctorName>
                    <DoctorSpecialty>{doctor.specialite}</DoctorSpecialty>
                  </HeaderLeft>
                </CardHeader>

                <CardBody>
                  <ScheduleTitle>
                    <Clock size={16} style={{ marginRight: "6px" }} />
                    Work Schedule
                  </ScheduleTitle>
                  <ScheduleTable>
                    <tbody>
                      {daysOrder.map((day) => (
                        <tr key={day}>
                          <DayCell>{capitalize(day)}</DayCell>
                          <TimeCell>
                            {doctor.disponibilite && doctor.disponibilite[day] && doctor.disponibilite[day].length > 0
                              ? doctor.disponibilite[day].join(", ")
                              : "-"}
                          </TimeCell>
                        </tr>
                      ))}
                    </tbody>
                  </ScheduleTable>

                  <InfoItem>
                    <PhoneIcon>
                      <Phone size={14} />
                    </PhoneIcon>
                    <span>{doctor.telephone}</span>
                  </InfoItem>
                </CardBody>

                <CardFooter>
                  <Link
                    to={`/patient/appointments/new?medecinId=${doctor._id}`}
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    <PrimaryButton>Book Appointment</PrimaryButton>
                  </Link>
                </CardFooter>
              </DoctorCard>
            ))}
          </Grid>
        ) : (
          <EmptyCard>
            <EmptyText>No doctors found matching your criteria</EmptyText>
            <ResetRow>
              <OutlineButton
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("all");
                  fetchDoctors();
                }}
              >
                Reset Filters
              </OutlineButton>
            </ResetRow>
          </EmptyCard>
        )}
      </Inner>
    </Page>
  );
}

/* ---------- Styled Components ---------- */

const Page = styled.main`
  max-width: 1100px;
  margin: 2.5rem auto;
  padding: 0 1rem;
  font-family: "Poppins", sans-serif;
`;

const Inner = styled.div``;

const Header = styled.header`
  margin-bottom: 18px;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  color: #0b2b63;
`;

const Subheading = styled.p`
  margin: 6px 0 0 0;
  color: #64748b;
`;

const FiltersCard = styled.section`
  background: #fff;
  border: 1px solid #e6eefb;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 20px;
  box-shadow: 0 8px 22px rgba(12, 32, 80, 0.03);
`;

const FiltersContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FilterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6eefb;
  font-size: 0.95rem;
  outline: none;
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6eefb;
  font-size: 0.95rem;
  outline: none;
`;

const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 18px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const DoctorCard = styled.article`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e6eefb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(12, 32, 80, 0.04);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f7;
`;

const HeaderLeft = styled.div``;

const DoctorName = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
`;

const DoctorSpecialty = styled.div`
  margin-top: 6px;
  color: #64748b;
  font-size: 0.9rem;
`;

const CardBody = styled.div`
  padding: 14px 16px;
  flex: 1;
`;

const ScheduleTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 8px;
  color: #0f172a;
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;

  td {
    padding: 4px 8px;
    border-bottom: 1px solid #e6eefb;
    font-size: 0.9rem;
  }
`;

const DayCell = styled.td`
  font-weight: 600;
  width: 100px;
`;

const TimeCell = styled.td`
  color: #475569;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  color: #475569;
  font-size: 0.9rem;
`;

const PhoneIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
`;

const CardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #eef2f7;
`;

const PrimaryButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #2a6df6, #4f46e5);
  color: #fff;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    opacity: 0.95;
  }
`;

const OutlineButton = styled.button`
  width: 100%;
  background: #fff;
  color: #0f172a;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e6eefb;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

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

const ResetRow = styled.div`
  display: flex;
  justify-content: center;
`;
