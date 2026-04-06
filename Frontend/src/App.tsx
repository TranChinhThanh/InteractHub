import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={token ? <div><h1>Home - Feed</h1><button onClick={() => {localStorage.removeItem('token'); window.location.reload();}}>Logout</button></div> : <Navigate to="/login" />} />
        {/* Placeholder for Profile */}
      </Routes>
    </Router>
  );
}

export default App;
