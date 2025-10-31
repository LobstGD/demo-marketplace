import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import Cards from './cards/Cards'
import Store from './main/Store'
import CreateCard from './cards/CreatedCard'
import Login from './auth/Login'
import Register from './auth/Register'
import Order from './order/Order'
import CreatedCard from './cards/CreatedCard'
import CreateNewCard from './cards/CreateNewCard'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const savedUsername = localStorage.getItem("username");

    if (token && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    } else {
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login");
      }
    }
  }, [navigate, location.pathname]);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem("username", user);
    navigate("/");
  };
  return (
    <>
      <Routes>


        <Route path='/catalog/:id' element={<Cards />}/>
        <Route path='/' element={<Store />} />
        <Route path='/cards-prop' element={<CreatedCard />} />
        <Route path='/order' element={<Order />} />
        <Route path='/create' element={<CreateNewCard />} />
        
        <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess}/>} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App