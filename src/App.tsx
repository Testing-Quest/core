import Examples from "./components/examples/Examples";
import { GlobalStateProvider } from "./components/GlobalState";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Analysis from "./components/analysis/Analysis";
import Navbar from "./components/Navbar";
import UploadFile from "./components/loader/UploadFile";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";


const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/examples');
  }, [navigate]);
  return null;
};


const App: React.FC = () => {
  return (
    <GlobalStateProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Navbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ flex: 1, padding: '20px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/examples" element={<Examples />} />
                <Route path="/upload" element={<UploadFile />} />
                <Route path="/analysis" element={<Analysis />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </GlobalStateProvider>
  );
};
export default App;

