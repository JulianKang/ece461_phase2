import React from 'react';

function SignInNavbar() {
    return (
        <div className="navbar">
            <a href="/">
                <div className="logo">
                    <img src="placeholder.jpg" alt="Logo" />
                </div>
            </a>
            <div className="links">
                <a href="signIn">Sign In</a>
                <span className="separator">|</span>
                <a href="register">Register User</a>
            </div>
        </div>
    );
}

export default SignInNavbar;