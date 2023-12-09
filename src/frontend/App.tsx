import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import SignInNavbar from './SignInNavbar';
// import Buttons from './Buttons';
// import SignIn from './SignIn';
// import Register from './Register';
import HomeNavbar from './HomeNavbar';
import HomePage from './HomePage';
import PackagePage from './PackagePage';
import AddPage from './AddPage';
import PackageNavbar from './PackageNavbar';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><HomeNavbar/><HomePage/></>} />
                <Route path="/home" element={<><HomeNavbar/><HomePage/></>} />
                <Route path="/package/:packageId" element={<><PackageNavbar/><PackagePage/></>} />
                <Route path="/add" element={<><HomeNavbar/><AddPage/></>} />
            </Routes>
        </Router>
    ); 
}

export default App;