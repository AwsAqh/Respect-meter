const express = require('express');
const router = express.Router();
const { getUserHabits,addHabit, updateHabit,deleteHabit, getTotalProgress, updateCommitment, getUserMeter } = require('../controllers/habitController');
const verifyToken = require('../middlewares/verifyToken');
const { verify } = require('jsonwebtoken');

router.get('/', verifyToken, getUserHabits);
router.post('/add',  verifyToken,addHabit);
router.put('/update/:id', verifyToken, updateHabit);
router.delete('/delete/:id',verifyToken,deleteHabit)
router.put('/update-commitment/:id',verifyToken,updateCommitment)
router.get('/get-meter-value',verifyToken,getUserMeter)



module.exports = router;
