import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex-container">
      <BrowserRouter>
        <Header/>
        <div className="container">
          <Routes>
            <Route path={`/register/`} element={<Register />} />
            <Route path={`/login/`} element={<Login />} />
            <Route path={`/`} element={<Home />} />
            <Route path={`/user`} element={<UserPage/>} />
          </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
};


export default App;