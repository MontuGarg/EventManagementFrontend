import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/Main/Home';
import EventDetails from './Components/Main/EventDetails';
import { useEffect, useState } from 'react';

import Register from './Components/Main/Register';
import CreateEvent from './Components/Main/CreateEvent';
import Login from './Components/Login/Login';

function App() {

  const [user, setUser] = useState({
    name:"",
    isLoggedIn: false,  
    userType: "",  // "guest" or "user"
  });
  useEffect(()=>{
      let LoginUser=JSON.parse(sessionStorage.getItem("LoginUser"));
      let length=sessionStorage.length;
      if(length>0 ){
        setUser({name:LoginUser.name,isLoggedIn:true,userType:LoginUser.userType});
      }
  },[])
  const LogOut=()=>{
    sessionStorage.clear();
    setUser({ 
      name:"",
      isLoggedIn: false,  
      userType: "user"
    })
  }
  return (
    <div>
    {user.isLoggedIn?<><span class="user-name">User: {user.name}</span><button class="btn btn-success login-btn" onClick={()=>LogOut()} >LogOut</button></>
    :<button class="btn btn-success login-btn" ><a href='login'>Login</a></button>}
    <Router>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login user={user}/>} />
        <Route path="/" element={user.isLoggedIn?<Home user={user}/>:<Login setUser={setUser} user={user}/> } />
        <Route path="/register" element={<Register/>}/>
        <Route path="/events/:id" element={user.isLoggedIn?<EventDetails user={user} />:<Login setUser={setUser} user={user}/>} />
        <Route path="/create-event" element={user.isLoggedIn?(user.userType!=='guest'? <CreateEvent />:<Home/>):<Login setUser={setUser} user={user}/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
