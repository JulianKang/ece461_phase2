import React from 'react';

function Buttons() {
    return (
        <div className="buttons-container">
            <button className="button sign-in" onClick={() => window.location.href = 'signIn'}>Sign In</button>
            <button className="button register" onClick={() => window.location.href = 'register'}>Register User</button>
        </div>
    );
}

export default Buttons;