import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
export default function SignUp() {
  const navigate=useNavigate();
  const [user,setUser]=useState({
    name:"",
    email:"",
    password:""
  })
  const {name,email,password}=user;
  const onValChange=e=>{
    setUser({...user,[e.target.name]:e.target.value});
  }
  const handleSubmit=()=>{
    if(user.name && user.email&&user.password){
    const a={
      name:user.name,
      email:user.email,
      password:user.password,
      userType:"user"
    }
    axios.post("https://eventmanagementbackend-production-a97f.up.railway.app/register",a).then(res=>{
      alert(res.data.message);
      navigate("/login");
    }).catch(err=>{
        console.log(err);
    })
    }
    else{
      alert("please fill details");
    }
  }
  return (<div id="loginDiv"><div id='extradiv'></div>
        <div id="registerCom">
            <h1 >REGISTER</h1>
                <table >
                    <tr>
                        <td >
                            Name :<input type="text" class="form-control" name="name" value={name} onChange={e=>onValChange(e)} required/>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            Email :<input type="email" class="form-control " name="email" value={email} onChange={e=>onValChange(e)} required/>
                        </td>
                    </tr>
                    <tr>
                      <td>
                            Password :<input type="password" class="form-control " name="password" value={password} onChange={e=>onValChange(e)} required/>
                        </td>
                    </tr>
                   <br/>
                    <tr >
                        <td colSpan={2}>
                        <button className='btn btn-dark form-control' onClick={()=>handleSubmit()}>Register</button>
                        </td>
                    </tr>
                    </table>
                    <tr>
                        <td>
                        Already have account ? <span id='link' onClick={()=>navigate("/login")}>Login</span></td>
                    </tr>
        </div></div>
  )
}