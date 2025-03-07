import React from "react";
import "../Styles/notification.css"
function Notification({isVisible,children}){

return <div id="notification" className={`${isVisible?"show" :""}`} >{children}</div>


}

export default Notification