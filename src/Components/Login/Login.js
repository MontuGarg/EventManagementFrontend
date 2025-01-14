import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
export default function Login({user,setUser}) {
    const navigate=useNavigate();
  const [user1,setUser1]=useState({
    email:"",
    password:""
  })
  const {email,password}=user;
  const onValChange=e=>{
    setUser1({...user1,[e.target.name]:e.target.value});
  }
  const handleGuestLogin=()=>{
    let user2={
      name:"guest",
      userType:"guest",
    }
    sessionStorage.setItem("LoginUser",JSON.stringify(user2));
    navigate("/");
    window.location.reload();
    setUser({name:"guest",isLoggedIn:true,userType:"guest"})
  }
  const handleSubmit=()=>{
    
    if(user1.email && user1.password){
    const a={
      email:user1.email,
      password:user1.password
    }
    axios.post("https://eventmanagementbackend-production-a97f.up.railway.app/login",a).then(res=>{
        console.log(res.data);
        if(res.data.message==="Login Successful"){
            sessionStorage.setItem("LoginUser",JSON.stringify(res.data.user));
            navigate("/");
            window.location.reload();
            setUser({name:res.data.user.name,isLoggedIn:true,userType:res.data.user.userType})
        }
        else{
            alert(res.data.message);
        }
    }).catch(err=>{
      console.log(err);
    })
    }
    else{
      alert("please fill details");
    }
  }
  return (
    <div id="loginDiv"><div id='extradiv'></div>
        <div id="registerCom">
            <h1 >Login</h1>
         
                <table >
                    <tr>
                        <td >
                            Email :<input type="text" class="form-control "name="email" value={email}onChange={e=>onValChange(e)}/>
                        </td>
                    </tr>
                    <tr>
                      <td>
                            Password :<input type="password" class="form-control "name="password" value={password}onChange={e=>onValChange(e)}/>
                        </td>
                    </tr>
                    <tr >
                        <td colSpan={2}>
                        <br></br>
                        <button className='btn btn-dark form-control'  onClick={()=>handleSubmit()}>Login</button>
                        </td>
                    </tr>
                    
                    <tr>
                        <td>
                        Not registered ? <span id='link' onClick={()=>navigate("/signup")}>Sign Up</span></td>
                    </tr>
                    <tr>
                        <td>
                        Or you can ? <span id='link' onClick={()=>handleGuestLogin()}>Guest Login</span></td>
                    </tr>
                </table>
                
            

        </div></div>
  )
}