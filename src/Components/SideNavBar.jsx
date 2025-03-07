import React from "react";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ListItemText from '@mui/material/ListItemText';
import "../Styles/sideNavBar.css"
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
function SideNavBar(){
  const navigate=useNavigate()
    
    const handleLogout=()=>{localStorage.removeItem("token")
      navigate("/login")

    }

    return  <div className=" SNB-container page-element-lower-radius " > <div className="side-nav-bar" > 
  
            <ListItemButton>
              <ListItemIcon  style={{color:"white"}}   >
                <HomeIcon  />
              </ListItemIcon>
              <ListItemText primary="Home" primaryTypographyProps={{ style: { color: 'white' } }} />
            </ListItemButton>


            <ListItemButton>
              <ListItemIcon  style={{color:"white"}}  >
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About"  primaryTypographyProps={{ style: { color: 'white' } }}/>
            </ListItemButton>


            <ListItemButton onClick={handleLogout}>
              <ListItemIcon style={{color:"white"}} >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log out"  primaryTypographyProps={{ style: { color: 'white' } }}/>
            </ListItemButton>

</div>
    </div>

    
}
export default SideNavBar