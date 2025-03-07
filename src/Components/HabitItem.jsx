import React, { useState }  from "react";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useHabits } from "../utils/HabitContext";
import EditHabitDialog from "./EditHabitDialog";
import Button  from "../ReUseableComponents/Button.jsx";
function HabitItem({habit,styleFlag}){
 
  const currentDay=new Date()
  const habitDate=new Date(habit.createdAt)
  const dayIndex=Math.floor((currentDay-habitDate)/(1000*60*60*24))
  const [isCommitted,setIsCommitted]=useState(habit.commitStates[dayIndex])
const {removeHabit,editHabit,handleCommitSubmit}=useHabits()
const [isHovered,setIsHovered]=useState(false)
const[editOpen,setEditOpen]=useState(false)

const handleEditOpen=()=>setEditOpen(true)
const handleEditClose=()=>setEditOpen(false)



 const handleCommitChange=()=>{

if((habit.habitType==="good" && isCommitted) || isCommitted ){
  setIsCommitted(false)
  handleCommitSubmit(habit._id,dayIndex,isCommitted)

}
else if (habit.habitType==="good"){
  setIsCommitted(true)
  handleCommitSubmit(habit._id,dayIndex,isCommitted)


}

else {handleCommitSubmit(habit._id,dayIndex,isCommitted) 
  setIsCommitted(true)
}
 }



const handleSubmit=(habit,e)=>{
e.preventDefault()
editHabit(habit)
handleEditClose()

}

const commitButton= ( <Button className="btn btn-success  btn-sm" value={habit.habitType==="good"? true:false}
 onClick={(e)=> {const newCommittedValue = habit.habitType === "good" ? true : false;
  setIsCommitted(newCommittedValue);
  handleCommitSubmit(habit._id, dayIndex, newCommittedValue);
  
 }} > {habit.habitType==="good"? "Commit": "Uncommit" }  </Button>)



const NotCommitButton= (<Button className="btn btn-danger  btn-sm" value={habit.habitType==="good"? false:true} 
 onClick={(e)=> {const newCommittedValue = habit.habitType === "good" ? false : true;
  setIsCommitted(newCommittedValue);
  handleCommitSubmit(habit._id, dayIndex, newCommittedValue);
  }} > {habit.habitType==="good"? "Uncommit": "Commit" }  </Button>)


const BG=isHovered? "#1A252F":styleFlag

 return <div style={{
  display: 'flex',
    flexShrink: 0,
    overflowX: 'hidden',
    padding: '0.5rem',
    backgroundColor: '#F44336', 
    borderBottom: '1px solid #ccc',
    color: '#fff', 
    fontWeight: 'bold',
    justifyContent: 'space-around',
    backgroundColor: BG,
    
  
  }} onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} >
 <div className="habits-content">
   <div className="habit-name">{habit.habitName}</div>
   <div className="habit-importance">{habit.habitImportance}</div>
   
   <div className="habit-duration"> { habit.status==="inProgress"? dayIndex +1 + "/" :"" }  {habit.duration} </div>
   
 </div>
 <div className="habit-actions">

  {isCommitted!==null  && habit.status==="inProgress" &&
  <Button type="button" className={ "commit-state "+ (habit.commitStates[dayIndex]?  'btn btn-danger  btn-sm': 'btn btn-success  btn-sm' ) } 
 onClick={handleCommitChange} >
 {habit.commitStates[dayIndex] ?habit.habitType==="good"? 'Uncommit' : 'Commit': habit.habitType==="good"? "Commit":"Uncommit" }
 </Button> 
 }

 
  {  habit.status==="inProgress" && isCommitted===null &&(

 <>
 {commitButton}  {NotCommitButton}
</>)}

<Button  type="button" className="btn btn-danger  btn-sm"  onClick={()=>{removeHabit(habit)}}><CloseIcon/></Button>
<Button  type="button" className="btn btn-secondary btn-sm "  onClick={handleEditOpen}><EditIcon /> </Button>


   
<EditHabitDialog  open={editOpen}  onSubmit={handleSubmit}  onClose={handleEditClose} habit={habit} id={habit._id}/>

 </div>
</div>

  




}
export default HabitItem