
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './Components/HomePage';

import Register from './Components/Register';
import  Login  from './Components/Login';

function App() {
 
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={ <Navigate to="/login" />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/home" element={<HomePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
