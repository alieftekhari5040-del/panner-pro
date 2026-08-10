import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Challenges from './pages/Challenges'
import Medals from './pages/Medals'
import Profile from './pages/Profile'

function App() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/medals" element={<Medals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
