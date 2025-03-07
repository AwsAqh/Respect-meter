import React, { useState,useMemo,useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import "../Styles/register.css"
function Register() {
  
  const [userName,setUserName]=useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const confirmPassword=useRef(null)
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
      if(password!==confirmPassword.current.value)
        setError("Passwords are not matched!")
      else{
      let url = 'http://localhost:5000/api/auth/register'; 
    let  body = { userName, email, password };
    
  
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
        
          navigate('/login'); 
       
        
      } else {
        setError(data.msg); 
      }
    } catch (err) {
      setError('Something went wrong'); 
    }}
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
        <div className='reg-auth-form page-element'> 
              <div className='auth-state'> 
              Register
              {memoizedGauge}
              </div>
              <form className='reg' onSubmit={handleSubmit}>
                
             <div className='name-email'>   
              <div className='mb-3 text-field'>
              <label htmlFor='userName' className="form-label" />
              <input type='text' className='form-control'
               id='userName' 
               aria-describedby="emailHelp"  
                placeholder='User name'
                value={userName}
                onChange={(e)=>{setUserName(e.target.value)}}

                 />
              </div>

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
              </div>  

            <div className='pas-confirmPas'> 
                <div className="mb-3 text-field">
              <label htmlFor="password" className="form-label"/>
              <input type="password" className="form-control" id="password"  placeholder='password'
               value={password}
               onChange={(e) => setPassword(e.target.value)} />
            </div>


                <div className="mb-3 text-field">
              <label htmlFor="password" className="form-label"/>
              <input type="password" className="form-control" id="confirm-password"  placeholder='confirm password'
               ref={confirmPassword}
                />
            </div>
          </div>
          
            <button type="submit" className="btn btn-primary text-field action-button">Create account</button>
              </form>

              <div className='reg-auth-footer'>
              {error && <div className='error-auth'> {error}</div>}
              
              
         <button className='btn btn-secondary btn-sm action-button' onClick={() =>  navigate("/login")}>
          
            
          already have an account? Login
      </button>
      </div>
        </div>
    </div>
  );
}

export default Register;
