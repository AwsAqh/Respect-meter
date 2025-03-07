import React, { useState, useEffect, useRef } from 'react';
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
  MenuItem,
  Checkbox,
  Input,
  FormControlLabel
} from '@mui/material';

const EditHabitDialog = ({ open, onClose, habit ,id, onSubmit }) => {
  
  const [isChecked,setIsChecked]=useState(false)
  const [formData, setFormData] = useState({id ,
    name:habit.habitName,
     importance:habit.habitImportance,
     duration:habit.duration,
     isGood:habit.habitType ,
   
    });

  const firstInputRef = useRef(null);

  // When the dialog opens, update formData with the habit's data.
  useEffect(() => {
    if (open) {
      setFormData({
        id,
        name: habit.habitName,
        importance: habit.habitImportance,
        duration: habit.duration,
        isGood: habit.habitType,
        setIsDone:isChecked,
      });
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }
  }, [open, habit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
  };

  const handleSave = (e) => {
    e.preventDefault()
  
    onSubmit(formData,e);
    
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Habit</DialogTitle>
      <DialogContent>

        <form id="edit-habit-form" onSubmit={handleSave}>
          <TextField
            autoFocus
            inputRef={firstInputRef}
            margin="dense"
            label="Habit Name"
            name="name"
            type="text"
            fullWidth
            value={formData.name ||''}
            onChange={handleChange}
          />

          
          <FormControl fullWidth margin="dense">
            <InputLabel id="importance-label">Importance</InputLabel>
            <Select
              labelId="importance-label"
              label="Importance"
              name="importance"
              value={formData.importance || ''}
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
              value={formData.duration || ''}
              onChange={handleChange}
            >
              <MenuItem value={1}>Day</MenuItem>
              <MenuItem value={7}>Week</MenuItem>
              <MenuItem value={30}>Month</MenuItem>
            </Select>
          </FormControl>


          <FormControl fullWidth margin="dense">
            <InputLabel id="habit-type-label">Habit Type</InputLabel>
            <Select
              labelId="habit-type-label"
              label="Habit Type"
              name="isGood"
              value={formData.isGood}
            >
              <MenuItem value="good">Good Habit</MenuItem>
              <MenuItem value="bad">Bad Habit</MenuItem>
            </Select>
          </FormControl>

      {habit.status==="inProgress"&&
      <FormControlLabel  
      control={<Checkbox name="setIsDone" onChange={(e)=>{
        const newChecked=e.target.checked
        setIsChecked(newChecked)
        setFormData((prev)=>({...prev, setIsDone:newChecked}))
        }}  checked={isChecked} />}
        label="Set as done"
      />}
  

        </form>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type='submit' form="edit-habit-form" variant="contained" color="primary">
          Save
        </Button>



      </DialogActions>



    </Dialog>
  );
};

export default EditHabitDialog;
