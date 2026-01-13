import { useState, useEffect } from 'react'
import { Calendar, User, Phone, Mail, FileText } from 'lucide-react'
import api from '../../services/api'

const statusColors = {
  scheduled: { background: '#bfdbfe', color: '#1d4ed8' },
  completed: { background: '#d1fae5', color: '#065f46' },
  canceled: { background: '#fecaca', color: '#b91c1c' },
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/medecin/rendez-vous')
        setAppointments(res.data)
      } catch (err) {
        console.error('Error fetching appointments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
    const patientName = `${apt.patientId.firstName} ${apt.patientId.lastName}`
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const styles = {
    page: { maxWidth: 1000, margin: '0 auto', padding: 20, fontFamily: 'Poppins, sans-serif' },
    header: { marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
    headerText: { fontSize: 14, color: '#64748b' },
    filters: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
    input: { padding: 8, borderRadius: 6, border: '1px solid #d1d5db', flex: 1 },
    select: { padding: 8, borderRadius: 6, border: '1px solid #d1d5db' },
    button: { padding: '8px 16px', borderRadius: 6, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' },
    card: { display: 'flex', borderRadius: 8, marginBottom: 12, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' },
    statusStripe: { width: 6 },
    cardContent: { padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
    appointmentHeader: { display: 'flex', alignItems: 'center', gap: 8 },
    statusBadge: { padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 },
    infoGrid: { display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 14, color: '#64748b' },
    notes: { display: 'flex', alignItems: 'start', gap: 6, fontSize: 14, background: '#f3f4f6', padding: 8, borderRadius: 6 },
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading...</div>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Appointments</h1>
        <p style={styles.headerText}>Manage and track your patient appointments</p>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.select}>
          <option value="all">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
        <button style={styles.button} onClick={() => { setFilterStatus('all'); setSearchTerm('') }}>Reset</button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.map((apt) => {
        const patientName = `${apt.patientId.firstName} ${apt.patientId.lastName}`
        return (
          <div key={apt._id} style={styles.card}>
            <div style={{ ...styles.statusStripe, backgroundColor: statusColors[apt.status].color }} />
            <div style={styles.cardContent}>
              <div style={styles.appointmentHeader}>
                <User size={20} />
                <strong>{patientName}</strong>
                <span style={{ ...styles.statusBadge, ...statusColors[apt.status] }}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>
              <div style={styles.infoGrid}>
                <div><Calendar size={16} /> {new Date(apt.date).toLocaleDateString()}</div>
                <div><Calendar size={16} /> {apt.time}</div>
                <div><Phone size={16} /> {apt.patientId.telephone || '-'}</div>
                <div><Mail size={16} /> {apt.patientId.email || '-'}</div>
              </div>
              {apt.notes && (
                <div style={styles.notes}><FileText size={16} /> {apt.notes}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
