import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInNavbar from './SignInNavbar';
import Buttons from './Buttons';
import SignIn from './SignIn';
import Register from './Register';
import HomeNavbar from './HomeNavbar';
import HomePage from './HomePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><SignInNavbar/><Buttons /></>} />
                <Route path="/signIn" element={<><SignInNavbar/><SignIn /></>} />
                <Route path="/register" element={<><SignInNavbar/><Register /></>} />
                <Route path="/home" element={<><HomeNavbar/><HomePage /></>} />
            </Routes>
        </Router>
    ); 
}

export default App;