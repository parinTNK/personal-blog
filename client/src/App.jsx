import React from 'react';
import Home from './page/Home';
import ViewPost from './page/ViewPost';
import Register from './page/Register';
import Login from './page/login';
import MemberManagement from './page/MemberManagement';
import Admin from './page/Admin';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthCheck from './middleware/AuthCheck';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view-post/:id" element={<ViewPost />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/member-management" element={<MemberManagement />} />
          <Route path="/admin/*" element={
            <AuthCheck>
              <Admin />
            </AuthCheck>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
