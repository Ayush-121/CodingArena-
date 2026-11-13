import { useEffect } from "react";
import { Routes,Route,Navigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import api from "./api";
import {setUser} from "./store";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import Workspace from "./pages/Workspace";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Contests from "./pages/Contests";
function Guard({children}){const user=useSelector(s=>s.auth.user);return user?children:<Navigate to="/login"/>}
export default function App(){
 const dispatch=useDispatch();
 useEffect(()=>{api.get("/auth/me").then(r=>dispatch(setUser(r.data.user))).catch(()=>{});},[dispatch]);
 return <Routes><Route element={<Layout/>}><Route path="/" element={<Dashboard/>}/><Route path="/problems" element={<Problems/>}/><Route path="/contests" element={<Contests/>}/><Route path="/contests/:slug" element={<Contests/>}/><Route path="/problems/:slug" element={<Workspace/>}/><Route path="/profile" element={<Guard><Profile/></Guard>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/></Route></Routes>
}
