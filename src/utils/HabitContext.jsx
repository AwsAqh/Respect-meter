import React, { createContext, useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [meter, setMeter] = useState(60);
  const [meterLastUpdate,SetLastMeterUpdate]=useState("")
  const [meterHistory,setMeterHistory]=useState([])
  const [dayHistory,setDayHistory]=useState([])
  const [notificationShown,setNotificationShown]=useState(false)
  const [loading,setIsLoading]=useState(false)
  const [error, setError] = useState(null);


  const fetchHabits = async () => {
   
    const token = localStorage.getItem("token");
   
    if (!token) {
      setError("No token found, skipping habit fetch.");
      console.log("No token found, skipping habit fetch.");
      return;
    }

    setIsLoading(true); 

    try {
      const response = await fetch("http://localhost:5000/api/habits", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token, 
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch habits  : inside ctx fetch");
      }

      const data = await response.json();
      console.log("habits are: ",data.habits)
     
      if (Array.isArray(data.habits)) {
        setHabits(data.habits);  
        
        setError(null); 
       
      } else {
        throw new Error("Invalid habits data format.");
      }
     
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError(error.message);
    } finally {
      
      setIsLoading(false); 
    }
  };

  
  
  const addHabit = async (habitData) => {
    
    const token = localStorage.getItem('token'); 
  
    try {
      const response = await fetch('http://localhost:5000/api/habits/add', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(habitData),  
      });
  
      if (!response.ok) {
        const errorText = await response.text(); 
        console.error('Error:', errorText);  
        throw new Error('Failed to add habit');
      }
  
      const data = await response.json(); 
      console.log('Habit added:', data);  
      setNotificationShown(true)
      setInterval(()=>{ setNotificationShown(false) },200000)
      fetchHabits()
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };
  

  
  const editHabit = async (habitToEdit) => {
    console.log("received habit to update",habitToEdit)
    
    try {
      const response = await fetch(`http://localhost:5000/api/habits/update/${habitToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(habitToEdit),
      });
      if (response.ok) {
        await fetchHabits();
        
      } else {
        console.error("Failed to edit habit:", await response.json());
      }
    } catch (error) {
      console.error("Error editing habit:", error);
    }
  };

  const removeHabit = async (habitToRemove) => {
   
    try {
      const response = await fetch(`http://localhost:5000/api/habits/delete/${habitToRemove._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (response.ok) {
        fetchHabits();
      } else {
        console.error("Failed to remove habit:", await response.json());
      }
    } catch (error) {
      console.error("Error removing habit:", error);
    }
  }; 

  const handleCommitSubmit = async (habitId, dayIndex, isCommitted) => {
    console.log("day index is:",dayIndex)
    console.log("the first commit state is :" , isCommitted)
    const token=localStorage.getItem("token")
    const response = await fetch(`http://localhost:5000/api/habits/update-commitment/${habitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token':token,
      },
      body: JSON.stringify({
        commitment: isCommitted,
        dayIndex: dayIndex,     
      }),
    });
  
    if (response.ok) {
      const updatedHabit = await response.json();
      console.log('Updated Habit:', updatedHabit);

      await fetchHabits()
      
    } else {
      console.error('Failed to update commitment');
    }
  };

  
  const getProgressMeter = async () => {

    const token=localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:5000/api/habits/get-meter-value`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-auth-token":token,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        
        const days = data.dayHistory.map(dateStr => dayjs(dateStr).startOf('day').format('YYYY-MM-DD'));
        
        setMeter(data.meter)
        SetLastMeterUpdate(data.meterLastUpdate)
        setMeterHistory(data.meterHistory)
        setDayHistory(days)
        return data.meter;
      } else {
        console.error('Failed to fetch progress meter');
      }
    } catch (error) {
      console.error('Error fetching progress meter:', error);
    }
  };
  


  useEffect(() => {
    // Fetch habits and calculate progress meter when the component mounts
    const fetchData = async () => {
      await fetchHabits();
      if (habits.length > 0) { // Make sure habits are populated before fetching the progress meter
        await getProgressMeter();
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    // Recalculate the progress meter only if habits change
    if (habits.length > 0) {
      console.log("habit array changed!!!!!")
      getProgressMeter();
    }
  }, [habits]);
  return (
    <HabitContext.Provider
      value={{
        habits,
        meter,
        meterLastUpdate,
        dayHistory,
        meterHistory,
        notificationShown,
       
        addHabit,
        editHabit,
        removeHabit,
        
        
        handleCommitSubmit
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
