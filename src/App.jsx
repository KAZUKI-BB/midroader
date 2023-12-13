import React from "react";
import { facultyData, FacultyContext } from './context/FacultyInfo';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import User from "./pages/UserPage";
import UserEdit from "./pages/UserEditPage";
import ChatPage from "./pages/ChatPage";
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <FacultyContext.Provider value={facultyData}>
      <div className="flex-container">
        <BrowserRouter>
          <Header/>
            <div className="container">
              <Routes>
                <Route path={`/register/`} element={<Register />} />
                <Route path={`/login/`} element={<Login />} />
                <Route path={`/`} element={<Home />} />
                <Route path={`/user`} element={<User/>} />
                <Route path={`/user/edit`} element={<UserEdit/>} />
                <Route path="/chat/:room" element={<ChatPage />} />
              </Routes>
            </div>
          <Footer/>
        </BrowserRouter>
      </div>
    </FacultyContext.Provider>
  );
};


export default App;