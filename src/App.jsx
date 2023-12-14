import React from "react";
import { FacultyContext, facultyData } from './context/FacultyInfo';
import { DowInfoContext, dowData } from './context/DowInfo';
import { JobInfoContext, jobData } from "./context/JobInfo";
import { TypeInfoContext, typeData } from "./context/TypeInfo";
import { ClassInfoProvider } from './context/ClassInfo';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import User from "./pages/UserPage";
import UserEdit from "./pages/UserEditPage";
import ChatPage from "./pages/ChatPage";
import UserTableRegister from "./pages/UserTableRegister";

import TestPage from "./pages/TestPage";

import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <ClassInfoProvider>
      <DowInfoContext.Provider value={dowData}>
        <FacultyContext.Provider value={facultyData}>
          <JobInfoContext.Provider value={jobData}>
            <TypeInfoContext.Provider value={typeData}>
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
                        <Route path={`/usertableregister`} element={<UserTableRegister/>} />
                        <Route path="/chat/:room" element={<ChatPage />} />
                        <Route path="/testpage" element={<TestPage />} />
                      </Routes>
                    </div>
                  <Footer/>
                </BrowserRouter>
              </div>
            </TypeInfoContext.Provider>
          </JobInfoContext.Provider>
        </FacultyContext.Provider>
      </DowInfoContext.Provider>
    </ClassInfoProvider>
  );
};

export default App;