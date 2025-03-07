const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  habitName: { type: String, required: true },
  habitImportance: { type: String, required: true },  
  habitType: { type: String, enum: ['good', 'bad'], required: true },  
  duration: { type: Number, required: true },  
  status:{type :String, default:"inProgress"},
 
  commitStates: { 
    type: [Boolean], 
    default: function() { 
      return new Array(this.duration).fill(null); 
    },
  },
  
  streak: { 
    type: Number, 
    default: 0 
  },
  
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

habitSchema.methods.updateLastUpdate=function(){

  this.lastUpdated=new Date()
  return this.save();
}

habitSchema.methods.setStatusToDone=function(){

  this.status="done"
  return this.save()

}

habitSchema.methods.setStatusToProgress=function(){

  this.status="inProgress"
  return this.save()

}


habitSchema.methods.updateStreak = function() {
  let streak = 0;  
const currentDay = new Date();
const habitDate = new Date(this.createdAt);
const dayIndex = Math.floor((currentDay - habitDate) / (1000 * 60 * 60 * 24));  


for (let i = dayIndex; i >= 0; i--) {
  if (this.commitStates[i] === true) {
    streak++; 
    if (streak > 0) {
      break;  
    }
  }
}
  
  
  this.streak = streak;
  return this.save();  
};

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
