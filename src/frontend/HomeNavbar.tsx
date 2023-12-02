import React from 'react';

function HomeNavbar() {
    return (
        <div className="navbar">
            <a href="home">
                <div className="logo">
                    <img src="placeholder.jpg" alt="Logo" />
                </div>
            </a>
            <div className="links">
                <a href="home">Home</a>
                <span className="separator">|</span>
                <a href="home">Data</a>
                <span className="separator">|</span>
                <a href="/">Logout</a>
            </div>
        </div>
    );
}

export default HomeNavbar;