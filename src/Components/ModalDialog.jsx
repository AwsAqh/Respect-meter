import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import ReactDOM from 'react-dom';
import { useHabits } from "../utils/HabitContext";

function ModalDialog({ open, onClose }) {
  const { addHabit } = useHabits();  // Access addHabit from HabitContext
  const [habitData, setHabitData] = useState({
    name: "",
    importance: "",
    duration: "",
    isGood: "",
    
  });

  // Update the habit data when input fields change.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitData((prevHabit) => ({
      ...prevHabit,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addHabit(habitData);  
    setHabitData({
      name: "",
      importance: "",
      duration: "",
      isGood: "",
      
    });  
    onClose();  
  };


  const firstInputRef = useRef(null);

  
  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open]);

  return ReactDOM.createPortal(
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a New Habit</DialogTitle>
      <DialogContent>
        <form id="add-habit-form" onSubmit={handleSubmit}>
         
          <TextField
            autoFocus
            inputRef={firstInputRef}
            margin="dense"
            label="Habit Name"
            name="name"
            type="text"
            fullWidth
            value={habitData.name}
            onChange={handleChange}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="importance-label">Importance</InputLabel>
            <Select
              labelId="importance-label"
              label="Importance"
              name="importance"
              value={habitData.importance}
              onChange={handleChange}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>



          
          <FormControl fullWidth margin="dense">
            <InputLabel id="duration-label">Duration</InputLabel>
            <Select
              labelId="duration-label"
              label="Duration"
              name="duration"
              value={habitData.duration}
              onChange={handleChange}
            >
              <MenuItem value={1}>Day</MenuItem>
              <MenuItem value={7}>Week</MenuItem>
              <MenuItem value={30}>Month</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="isGood-label">Good or Bad?</InputLabel>
            <Select
              labelId="isGood-label"
              label="Good or Bad"
              name="isGood"
              value={habitData.isGood}
              onChange={handleChange}
            >
              <MenuItem value="good">Good Habit</MenuItem>
              <MenuItem value="bad">Bad Habit</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          form="add-habit-form"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>,document.body
  );
}

export default ModalDialog;
