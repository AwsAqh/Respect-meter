
const Habit = require('../models/habit'); 
const User = require('../models/user'); 
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config(); 
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_RESPECT_METER_API_KEY,  // Ensure your API key is in the environment variable
});
const cron = require('node-cron');
const { has } = require('lodash');



cron.schedule('59 23 * * *', async () => {
  try {
    console.log('Running daily progress meter update...');
   await updateProgressMeterForAllUsers(); // Function to update meter for all users
    await updateDayValues()

    console.log('Daily progress meter update completed.');
  } catch (error) {
    console.error('Error updating progress meters:', error);
  }
});


async function updateDayValues(){

 const users= await User.find({})
  for (const user of users){
     await user.addDayData()

  }

}

async function updateProgressMeterForAllUsers() {
  // Fetch all users (or those who need an update)
  const users = await User.find({});
  
  for (const user of users) {
    // Assume you have a function that calculates the new meter for a given user
    const newMeterData = await updateProgressMeter(user._id);
    
    // Update the user's progress meter and meterLastUpdate
    await User.findByIdAndUpdate(user._id, {
      progressMeter: newMeterData,
      meterLastUpdate: Date.now(),
      
    });
    
    console.log(`Updated meter for user ${user._id}: ${newMeterData}`);
  }
}


async function updateProgressMeter   (userId){
 
    const meter = await calculateMeterFromOpenAI(userId);
    
    console.log("ChatGPT meter value updated to:", meter);
     return meter}





const calculateMeterFromOpenAI = async (userId) => {
  try {
  
    const habits = await getAllHabitsForUser(userId);
    const user = await User.findOne({ _id: userId }, 'progressMeter meterLastUpdate');

     const prompt = `Given the following habits for a user and their current progress meter, please calculate the next progress meter value (between 0% and 100%) considering only the updates that occurred AFTER the last meter update. Use the data provided for each habit and follow these rules:

1. Data to Consider for Each Habit:
   - Habit Name, Habit Type, Streak (in days), Importance, Commitment Frequency (number of days marked as committed), Duration, Creation Date, and Last Updated date.

2. Calculation Guidelines:
   - Only consider a habit as updated if its "Last Updated" timestamp is later than the user's "last meter update" time. This must be true regardless of the time difference.
   - For each updated habit, determine its contribution to the meter change based on:
       • Importance (assign a weight: high = 1.0, medium = 0.5, low = 0.25),
       • Streak (longer streak means a higher contribution),
       • Commitment Frequency relative to Duration (a higher ratio indicates better consistency).
   - Sum the contributions of all updated habits to compute a net change. Limit the net change to a maximum of ±0.9% per day, unless a very significant change is evident.
   -Values 20% and 90% considered as boundaries, crossing them should hardly change the meter up or down.
   - If no habit is updated after the last meter update, simply return the current progress meter value.

3. Output Requirements:
   - Provide a brief explanation of how you calculated the new meter value.
   - Your response must end with exactly the caption:
     "the previous meter value: <current_meter_value>, next value: <new_meter_value>"
     (Replace <current_meter_value> and <new_meter_value> with the actual numbers.)
   - Return the response in JSON format with these keys:
       • newMeter: (number)
       • explanation: (string)
       • changedHabits: (list of habit names that were updated after the last meter update)
       • finalCaption: (string as specified)
       • all habits: (list of each habit's name and its Last Updated time)
       • last meter update time: (the meter's last update timestamp before the current call)
  Consider the commit state for the new day. When the streak got broken, it reset to 1 not zero, so there is a false commitment.See the states from the creation to the current day, 
  consider the last update of a meter, then you can figure if there a false commit after the last update, leading to decreas.    

Here is the data template:

${habits.map(habit => `
  Habit Name: ${habit.habitName}
  Habit Type: ${habit.habitType}
  Streak: ${habit.streak} days
  Importance: ${habit.habitImportance}
  Commitment Frequency: ${habit.commitStates.filter(state => state === true).length} days/duration
  Duration: ${habit.duration} days
  Creation Date: ${habit.createdAt}
  Last Updated: ${habit.lastUpdated}
  
`).join('\n')}

User's current progress meter: ${user.progressMeter}
User's last meter update: ${user.meterLastUpdate}
`;
    

    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  
      messages: [
        { "role": "user", "content": prompt }
      ]
    });
    

    const progressMeterText = response.choices[0].message.content.trim();
    const progressMeter = extractProgressMeter(progressMeterText); 

    console.log("Full API Response:", progressMeterText);
    
console.log('Progress Meter:', progressMeter);
   
    return progressMeter;
   
  } catch (error) {
    console.error("Error calculating progress meter:", error);
  }
};


const getAllHabitsForUser = async (userId) => {
  
  const habits = await Habit.find({ userId, status: "inProgress" });
  for(const h of habits){
    if(h.commitStates[h.duration-1]!==null)
      await h.setStatusToDone()
  }
  return habits
};


const extractProgressMeter = (responseText) => {
  
  const match = responseText.match(/next value:\s*(\d+(\.\d+)?)/i);

  if (match) {
    return parseFloat(match[1]);  
  }

  return null;
};






exports.getUserHabits = async (req, res) => {
 console.log("inside get user habits")
  try {
    const userId = req.user;  

    
    const habits = await Habit.find({ userId });
console.log(habits)
    res.status(200).json({ habits });
  } catch (err) {
    console.error('Error fetching habits: inside getUserHabits', err);
    res.status(500).json({ msg: 'Error fetching habits   inside getUserHabits' });
  }
};



exports.addHabit = async (req, res) => {
  const { name, importance, isGood, duration } = req.body;

  
  const userId = req.user;

  if (!name || !importance || !duration || !isGood ) {
    return res.status(400).json({ msg: 'All fields are required and valid' });
  }

 
  const commitment = new Array(duration).fill(null);

  try {
    
    const newHabit = new Habit({
      userId,  
      habitName: name, 
      habitImportance: importance,
      habitType: isGood, 
      duration,
      commitStates: commitment,  
    });

  
    await newHabit.save();

   
    res.status(201).json({ habit: newHabit });
  } catch (err) {
    console.error('Error adding habit:', err);
    res.status(500).json({ msg: 'Error adding habit' });
  }
};


exports.updateHabit = async (req, res) => {
  const { id } = req.params;  
  const { name, importance, duration, isGood,setIsDone } = req.body; 

  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid habit ID' });
  }

  try {
    
    const habit=await Habit.findById(id)
    if(duration>habit.duration )
      await habit.setStatusToProgress()
    if(setIsDone) await habit.setStatusToDone()
    habit.habitName=name
    habit.habitImportance=importance
    habit.duration=duration
    habit.habitType=isGood
    habit.lastUpdated=Date.now()
    await habit.save()

    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }
    if (duration> habit.duration)
     await habit.setStatusToProgress()
   
    res.json({ habit });

  } catch (err) {
    console.error('Error updating habit:', err);
    res.status(500).json({ msg: 'Error updating habit' });
  }
};


exports.deleteHabit=async(req,res)=>{
console.log("inside delete habit")
const {id}=req.params

if (!mongoose.Types.ObjectId.isValid(id)) {
  console.log("invalid id for delete")
  return res.status(400).json({ msg: 'Invalid habit ID' });
}
try{
  const habit=await Habit.findByIdAndDelete(id)

  if(!habit)
    return res.status(404).json({ msg: "habit not found"})
  console.log("successful deleting habti, inside deletHabit backend")
return res.json({msg:"habir deleted succesfully"})
}

catch (err){
  console.log("error deleting habti, inside deletHabit backend")
return res.status(500).json({msg:"error deleting habit"})

}

}






exports.updateCommitment = async (req, res) => {
  console.log("inside update commitment")
  const { id } = req.params;  
  const { commitment, dayIndex } = req.body;
console.log(commitment,dayIndex)
  // Validate the habit ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("invalid id for update commitemnt")
    return res.status(400).json({ msg: 'Invalid habit ID' });
  }

  try {
 
    const habit = await Habit.findById(id);

    if (!habit) {
      console.log("habit not found")
      return res.status(404).json({ msg: 'Habit not found' });
    }

    

    if (dayIndex < 0 || dayIndex >= habit.duration) {
      console.log("invalid day index")
      return res.status(400).json({ msg: 'Invalid day index' });
    }


    if (habit.habitType === 'good') {
      
      habit.commitStates[dayIndex] = commitment ? true : false;
    } else
      
      habit.commitStates[dayIndex] = commitment ? false : true;
    


    await habit.updateStreak();
    await habit.updateLastUpdate();
    
  
    await habit.save();
    console.log("commitment updated!")

   
    res.json(habit);
  } catch (err) {
    console.error('Error updating commitment: inside update commitment', err);
    res.status(500).json({ msg: 'Error updating commitment  inside update commitment' });
  }
};









// Retrieve meter value, day values for line chart from front end     
exports.getUserMeter =async (req,res)=>{
try{
  const userId= req.user
  const user=await User.findOne({_id:userId},"progressMeter meterLastUpdate meterHistory dayHistory")

  res.json({meter:user.progressMeter,
    meterLastUpdate: user.meterLastUpdate,
    meterHistory:user.meterHistory,
    dayHistory:user.dayHistory

  })
}
catch{
  res.json({msg:"Error getting meter value"})
}

}

