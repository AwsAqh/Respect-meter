import React from "react";
import Logo from  "../assets/Logo.jpg"
import "../Styles/header.css"
import Notification from "../ReUseableComponents/Notification";
import { useHabits } from "../utils/HabitContext";



function  Header (){

    const {notificationShown}=useHabits()

return <div className="header page-element-upper-radius">
<div className="header-content">
<header>
<h1>Respect meter</h1>
</header>
  {notificationShown && <Notification isVisible={notificationShown}> Habit added! </Notification>}
</div>
</div>
}
export default Header