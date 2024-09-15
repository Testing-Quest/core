import Examples from './components/examples/Examples'
import { GlobalStateProvider } from './components/GlobalState'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Analysis from './components/analysis/Analysis'
import Navbar from './components/Navbar'
import UploadFile from './components/loader/UploadFile'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import React from 'react'
import ReactDOM from 'react-dom/client'

const Home: React.FC = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/examples')
  }, [navigate])
  return null
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <Router>
        <div style={{ height: 'calc(98vh - 50px)', width: '98vw' }}>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '50px',
              width: '100%',
              backgroundColor: 'white',
              zIndex: 999,
            }}
          >
            <Navbar />
          </div>
          <div style={{ height: '90%', width: '100%', marginTop: '50px' }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/examples' element={<Examples />} />
              <Route path='/upload' element={<UploadFile />} />
              <Route path='/analysis' element={<Analysis />} />
            </Routes>
          </div>
        </div>
      </Router>
    </GlobalStateProvider>
  </React.StrictMode>,
)
