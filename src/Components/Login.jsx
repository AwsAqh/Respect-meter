import React, { useState,useMemo } from 'react';
import {  useNavigate } from 'react-router-dom';
import "../Styles/login.css"
import GaugeChart from 'react-gauge-chart';
function Login() {
  
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
   
  
    
     let url = 'http://localhost:5000/api/auth/login'; // Change to register endpoint if not login
     let body = {  email, password }; // Include username for registration
    
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        
          navigate('/home'); // Redirect to home page after successful login
       
        
      } else {
        setError(data.msg); // Display backend error message
      }
    } catch (err) {
      setError('Something went wrong'); // Handle network or other errors
    }
  };

  const memoizedGauge = useMemo(() => {
    console.log("Rendering GaugeChart");
    return (
      <GaugeChart
        id="gauge-chart"
        nrOfLevels={30}
        colors={["#FF5F6D", "#FFC371"]}
        arcWidth={0.3}
        percent={0.6}
        needleColor="#345243"
        needleBaseColor="#345243"
        cornerRadius={3}
        textColor="#333"
        animate={true}
        animDelay={500}
        formatTextValue={() => ''}
      />
    );
  }, []);


  return (
    <div className='auth-page'>
      <div className='auth-form page-element'>
        <div className='auth-state' > Login
          {memoizedGauge}
        </div>
        <form  onSubmit={handleSubmit}>
            <div className="mb-3 text-field">
              <label htmlFor="email" className="form-label"  />
              <input type="email" 
              className="form-control"
               id="email"
                aria-describedby="emailHelp"  
                placeholder='E-mail'
                 value={email}
                onChange={(e) => setEmail(e.target.value)} />
               

            </div>
            <div className="mb-3 text-field">
              <label htmlFor="password" className="form-label"/>
              <input type="password" className="form-control" id="exampleInputPassword1"  placeholder='password'
               value={password}
               onChange={(e) => setPassword(e.target.value)} />
            </div>

           
            <button type="submit" className="btn btn-primary text-field action-button">login</button>
        </form>

        <div className='auth-footer'>
        {error && <div className='error-auth'>{error}</div>}
        <button className='btn btn-secondary btn-sm action-button' onClick={() =>  navigate("/register")}>
          
            
            Don't have an account? Register
        </button></div>
      </div>
    </div>
  );
}

export default Login;
