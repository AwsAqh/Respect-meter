const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  progressMeter:{type:Number, default:60},
  meterLastUpdate:{type:Date, default: Date.now},
  createdAt: { type: Date, default: Date.now },
  meterHistory:{type:[Number],default:[]},
  dayHistory:{type:[String],default:[]}
});

userSchema.methods.addDayData=async function(){

  const currentDay = new Date().toISOString().slice(0, 10);
this.meterHistory.push(this.progressMeter)
this.dayHistory.push(currentDay)
return this.save();

}
const User = mongoose.model('User', userSchema);

module.exports = User;
