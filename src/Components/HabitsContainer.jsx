import React, { useEffect, useState } from "react";
import "../Styles/habits.css";
import AddIcon from '@mui/icons-material/Add';
import HabitItem from "./HabitItem";
import ModalDialog from "./ModalDialog";
import { useHabits } from "../utils/HabitContext";
import Button from "../ReUseableComponents/Button";

function HabitsContainer() {
  const { habits, toggleCommit, addHabit } = useHabits();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [statueFilter,setStatusFilter]=useState("inProgress")
  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleSubmit = (e) => {
    addHabit(e);
    handleDialogClose();
  };

  
  let filteredHabits ;

  useEffect(()=>{
    
    filterHabits()}, [habits] )


    const filterHabits = () => {
      
      
      if (statueFilter === "inProgress") {
        filteredHabits = habits.filter((habit) => {
          if (filter === "all") return habit.status==="inProgress";
          if (filter === "short") return (habit.duration === 1 && habit.status === "inProgress");
          if (filter === "medium") return (habit.duration === 7 && habit.status === "inProgress");
          if (filter === "long") return (habit.duration === 30 && habit.status === "inProgress");
          
          return true; 
        });
      } else {
        filteredHabits = habits.filter(habit => habit.status === "done");
      }
      
      return filteredHabits;
    };
    




  filterHabits()
  return (
    <div className="habits-container page-element-lower-radius">
      <div className="habits-label">
        <div className="habits-content">
          <div className="label-item">Habit Name</div>
          <div className="label-item">Importance</div>
          <div className="label-item">Duration</div>
        </div>
        <div className="habit-actions">

        <select className="form-select form-select-sm" aria-label="Small select example" value={statueFilter} onChange={(e)=>setStatusFilter(e.target.value)} >
          <option value="inProgress">In progress</option>
          <option value="done">Done</option>
        </select>

          <select  className="form-select form-select-sm" aria-label="Small select example" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="short">Short Term</option>
            <option value="medium">Medium Term</option>
            <option value="long">Long Term</option>
          </select>
          <Button className="btn btn-sm" onClick={handleDialogOpen}>
              <AddIcon />
           </Button>
        </div>
      </div>

      <div className="list-of-habits">
    {filteredHabits.length > 0 ? (
      filteredHabits.map((habit, index) => (
        <HabitItem
        
          key={habit._id} // Use unique key for each item
          habit={habit}
          styleFlag={index % 2 === 0 ? '#34495E' : '#2C3E50'} // Alternate background colors
          onToggle={toggleCommit} // Pass the toggle commit function if required
        />
      ))
    ) : (
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#999'
      }}>
        No habits yet!
      </div>
    )}
  </div>

      <ModalDialog open={open} onClose={handleDialogClose} onSubmit={handleSubmit} />
    </div>
  );
}

export default HabitsContainer;
