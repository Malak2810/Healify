import { useState } from 'react'

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState({
    monday: { start: '09:00', end: '17:00', available: true },
    tuesday: { start: '09:00', end: '17:00', available: true },
    wednesday: { start: '09:00', end: '17:00', available: true },
    thursday: { start: '09:00', end: '17:00', available: true },
    friday: { start: '09:00', end: '17:00', available: true },
    saturday: { start: '10:00', end: '14:00', available: false },
    sunday: { start: '00:00', end: '00:00', available: false },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  const handleToggleAvailability = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available }
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Availability updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  const styles = {
    page: { maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'Poppins, sans-serif' },
    header: { marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
    headerText: { fontSize: 14, color: '#64748b' },
    alert: { background: '#d1fae5', color: '#065f46', padding: 10, borderRadius: 6, marginBottom: 20 },
    card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12 },
    dayRow: { display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid #d1d5db', borderRadius: 6 },
    label: { fontWeight: 600, textTransform: 'capitalize', flex: 1 },
    input: { padding: 6, borderRadius: 6, border: '1px solid #d1d5db', width: 100 },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' },
    button: { padding: '8px 16px', borderRadius: 6, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', flex: 1 },
    timeContainer: { display: 'flex', alignItems: 'center', gap: 6 },
    offText: { width: 60, textAlign: 'right', color: '#64748b', fontSize: 14 },
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Set Your Availability</h1>
        <p style={styles.headerText}>Define your working hours and days off</p>
      </div>

      {successMessage && <div style={styles.alert}>{successMessage}</div>}

      <div style={styles.card}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {days.map(day => (
            <div key={day} style={styles.dayRow}>
              <span style={styles.label}>{day}</span>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={availability[day].available}
                  onChange={() => handleToggleAvailability(day)}
                />
                <span style={{ fontSize: 14 }}>Working</span>
              </label>

              {availability[day].available ? (
                <div style={styles.timeContainer}>
                  <input
                    type="time"
                    value={availability[day].start}
                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                    style={styles.input}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={availability[day].end}
                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                    style={styles.input}
                  />
                </div>
              ) : (
                <div style={styles.offText}>Off</div>
              )}
            </div>
          ))}

          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Availability'}
          </button>
        </form>
      </div>
    </div>
  )
}
