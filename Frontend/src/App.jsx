import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Header Component
function Header() {
  return (
    <header style={{ padding: '20px', backgroundColor: '#f0f8ff', textAlign: 'center' }}>
      <h1>🐕 Puppy Management System</h1>
      <p>Manage your adorable puppies with ease</p>
    </header>
  )
}

// Add Puppy Form Component
function AddPuppyForm({ onPuppyAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    weight_lbs: '',
    vaccinated: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/puppies`, {
        ...formData,
        weight_lbs: formData.weight_lbs ? parseFloat(formData.weight_lbs) : null
      })
      console.log('Puppy added:', response.data)
      onPuppyAdded()
      setFormData({ name: '', breed: '', weight_lbs: '', vaccinated: false })
    } catch (error) {
      console.error('Error adding puppy:', error)
      alert('Failed to add puppy')
    }
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', margin: '20px 0', borderRadius: '8px' }}>
      <h3>Add New Puppy</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Puppy Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Breed"
          value={formData.breed}
          onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Weight (lbs)"
          value={formData.weight_lbs}
          onChange={(e) => setFormData({ ...formData, weight_lbs: e.target.value })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={formData.vaccinated}
            onChange={(e) => setFormData({ ...formData, vaccinated: e.target.checked })}
          />
          Vaccinated
        </label>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          Add Puppy
        </button>
      </form>
    </div>
  )
}

// Puppy Table Component
function PuppyTable({ puppies, onDeletePuppy, onEditPuppy }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this puppy?')) {
      try {
        await axios.delete(`${API_BASE_URL}/puppies/${id}`)
        onDeletePuppy(id)
        console.log('Puppy deleted')
      } catch (error) {
        console.error('Error deleting puppy:', error)
        alert('Failed to delete puppy')
      }
    }
  }

  const toggleVaccination = async (puppy) => {
    try {
      const updatedPuppy = { ...puppy, vaccinated: !puppy.vaccinated }
      await axios.put(`${API_BASE_URL}/puppies/${puppy.id}`, updatedPuppy)
      onEditPuppy(updatedPuppy)
      console.log('Vaccination status updated')
    } catch (error) {
      console.error('Error updating puppy:', error)
      alert('Failed to update puppy')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Puppy List ({puppies.length} puppies)</h3>
      {puppies.length === 0 ? (
        <p>No puppies found. Add some puppies above!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Breed</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Weight (lbs)</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Arrival Date</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Vaccinated</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {puppies.map((puppy) => (
              <tr key={puppy.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{puppy.id}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{puppy.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{puppy.breed || 'Unknown'}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{puppy.weight_lbs || 'N/A'}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {puppy.arrival_date ? new Date(puppy.arrival_date).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <span style={{ color: puppy.vaccinated ? 'green' : 'red' }}>
                    {puppy.vaccinated ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => toggleVaccination(puppy)}
                    style={{ 
                      margin: '2px', 
                      padding: '4px 8px', 
                      backgroundColor: '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    Toggle Vaccination
                  </button>
                  <button
                    onClick={() => handleDelete(puppy.id)}
                    style={{ 
                      margin: '2px', 
                      padding: '4px 8px', 
                      backgroundColor: '#f44336', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// Body Component (main content)
function Body() {
  const [puppies, setPuppies] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch puppies from API
  const fetchPuppies = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/puppies`)
      setPuppies(response.data)
      console.log('Puppies loaded:', response.data)
    } catch (error) {
      console.error('Error fetching puppies:', error)
      alert('Failed to load puppies. Make sure your backend is running on port 5000!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPuppies()
  }, [])

  const handlePuppyAdded = () => {
    fetchPuppies() 
  }

  const handleDeletePuppy = (id) => {
    setPuppies(puppies.filter(puppy => puppy.id !== id))
  }

  const handleEditPuppy = (updatedPuppy) => {
    setPuppies(puppies.map(puppy => 
      puppy.id === updatedPuppy.id ? updatedPuppy : puppy
    ))
  }

  return (
    <main style={{ minHeight: '400px', padding: '20px' }}>
      <AddPuppyForm onPuppyAdded={handlePuppyAdded} />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading puppies...</p>
        </div>
      ) : (
        <PuppyTable 
          puppies={puppies} 
          onDeletePuppy={handleDeletePuppy}
          onEditPuppy={handleEditPuppy}
        />
      )}
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button 
          onClick={fetchPuppies}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#FF9800', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px'
          }}
        >
          Refresh List
        </button>
      </div>
    </main>
  )
}

// Footer Component
function Footer() {
  return (
    <footer style={{ 
      padding: '20px', 
      backgroundColor: '#333', 
      color: 'white', 
      textAlign: 'center',
      marginTop: '40px'
    }}>
      <p>&copy; 2025 Puppy Management System | Built with React + Express + PostgreSQL</p>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Header />
      <Body />
      <Footer />
    </div>
  )
}

export default App
