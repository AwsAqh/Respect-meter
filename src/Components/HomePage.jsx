import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import Header from './Header';
import HabitsContainer from './HabitsContainer';
import Meter from './Meter';
import { HabitProvider } from '../utils/HabitContext';
function HomePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login page
      navigate('/signin');
    } else {
      // Verify token (you can call an API to verify, or decode locally)
      // For simplicity, we're just storing the token here
      // You can also send the token to a server endpoint to verify its validity
      const fetchData = async () => {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          // If token is invalid, redirect to login
          localStorage.removeItem('token');
          navigate('/login');
        }
      };

      fetchData();
    }
  }, [navigate]);

  if (!userData) return <div>Loading...</div>;

  return (
    
      
      <div className='full-page-container '>
      
              <HabitProvider>
                <SideNavBar />
               
                <Header />
                <Meter/>
                <HabitsContainer />
                
              </HabitProvider>
              
      </div>
  );
}

export default HomePage;
