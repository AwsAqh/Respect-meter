import React from 'react';
import "../Styles/Meter.css"
import GaugeChart from 'react-gauge-chart';
import { useHabits } from '../utils/HabitContext';
import dayjs from 'dayjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import messages from "../assets/messages.json"


export default function Meter() {
   const {meter,meterLastUpdate,meterHistory,dayHistory}=useHabits()
   let meterStatusRange; 
   let todayMessage;
   if(meter>=0 && meter<=33)
    meterStatusRange=messages["low"]
  else if(meter>33 && meter <=66)
    meterStatusRange=messages["medium"]
  else meterStatusRange=messages["high"]

    if(meterStatusRange && meterStatusRange.length>0){
      
      todayMessage=meterStatusRange[Math.floor(Math.random()*meterStatusRange.length)]
  
  }
    else todayMessage="Keep going, you are getting better!"
    const percent = meter/ 100;
    

  const formattedData = dayHistory.map((dateItem, index) => ({
  
    date: dayjs(dateItem).format('YYYY-MM-DD'),
    value: meterHistory[index]
    
  }));

  
  return (<div className='wrapper page-element'>
  <div id='meter-grid-cell'>
  <div className='line-chart '>
  <LineChart width={400} height={300} data={formattedData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis domain={[
      (dataMin) => Math.floor(dataMin - 1),
      (dataMax) => Math.ceil(dataMax + 1)
    ]} />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
    <div>Last update: {meterLastUpdate}</div>
    </div>
          <div className='meter-info'>
           
    <div className='meter-pct'>
   <GaugeChart
              id="meter-gauge"
              nrOfLevels={30}
              colors={["#FF5F6D", "#FFC371"]}
              arcWidth={0.3}
              percent={percent}
              needleColor="#345243"
              needleBaseColor="#345243"
              cornerRadius={3}
              textColor="#333"
              animate={true}
              animDelay={500}
              
              formatTextValue={() => ''}  
            />


            
            <div className='title'>
              <h1>{meter}%</h1> 
            </div>
            </div>

            <div className='today-message'>{todayMessage}</div>
          </div>
    </div>


    {/* <div className='meter-footer'>
    
    
    </div> */}
    </div>
  );
  
}
