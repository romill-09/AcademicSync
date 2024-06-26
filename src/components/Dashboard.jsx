import React from 'react'
import { Link } from 'react-router-dom';
import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CreateAnnouncement from './CreateAnnouncement';
import Announcement from './Announcement';
import CreateEvent from './CreateEvent';
import Events from './Events';
import AdminDashboard from './Admin';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Import db from firebase.js
import StudentSidebar from './StudentSidebar';
import CASidebar from './CASidebar.jsx';

function Dashboard({location}) {

  const [theme, colorMode] = useMode();
  const auth = getAuth();
    const currentUser = auth.currentUser;
    const [userInfo, setUserInfo] = useState({role: ' ', division:' ', subdivision:' ', role:'Student'})
    useEffect( () => {
        // console.log("Hi")
        const x = async()=>{
        const q = query(collection(db, "details"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        // console.log("TEst")
        const userList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); 
        setUserInfo(userList[0])
        // console.log(userInfo)
      }
      x();
    //   console.log(userInfo)
     }, [])
   
	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<div className="app">
					{userInfo.role == 'Student' && <StudentSidebar />}
					{userInfo.role == 'Class Admin' && <CASidebar />}
					{userInfo.role == 'Admin' && <Sidebar />}
					<main className="content">
						<Topbar />
            {location === "ca" && <CreateAnnouncement/>}
            {location === "announcement" && <Announcement/>}
			{location === 'ce' && <CreateEvent/>}
			{location === 'events' && <Events/>}
			{location === 'admin' && <AdminDashboard/>}
					</main>
				</div>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
  
}

export default Dashboard