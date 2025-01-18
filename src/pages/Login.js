import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRememberMeChange = () => setRememberMe(!rememberMe);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({ email, password, rememberMe });
  };

  return (
    <div>
      <div id="top">
        <img id="cat" src="https://cdn-icons-png.flaticon.com/512/9288/9288684.png" alt="Cat" />
        <div id="cat-text">
          <h4>Welcome Back!</h4>
          <p>It's nice to see you again. Let's log back in and learn more Japanese!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container">
          <input
            type="text"
            placeholder="Enter Email or Username..."
            name="uname"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="password"
            placeholder="Enter Password..."
            name="psw"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            Remember me
          </label>
          <button type="submit" id="login">Login!</button>
        </div>

        <div id="bottom" style={{ backgroundColor: '#f1f1f1' }}>
          <button type="button" className="cancelbtn">Cancel</button>
          <span className="psw">Forgot <a href="#">password?</a></span>
        </div>
      </form>
    </div>
  );
}

export default App;