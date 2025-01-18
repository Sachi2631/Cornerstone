import React, { useState } from 'react';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    uname: '',
    psw: '',
    remember: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div>
      <div id="top" style={{ display: 'flex', flexDirection: 'row', width: '75%', padding: '50px', height: '15vh', paddingLeft: '20vw' }}>
        <img id="cat" src="https://cdn-icons-png.flaticon.com/512/9288/9288684.png" alt="cat" style={{ height: '15vh' }} />
        <div id="cat-text" style={{ textAlign: 'left', marginTop: '-3vh', paddingLeft: '10px', paddingRight: '15px' }}>
          <h4>Welcome!</h4>
          <p>It's good to see a new face! Let's create a new account.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} method="post">
        <div className="container" style={{ padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder="Enter Email..."
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '80%', padding: '12px 20px', margin: '8px 0', border: '1px solid #ccc', boxSizing: 'border-box', borderRadius: '5px' }}
          />
          <input
            type="text"
            placeholder="Enter Username..."
            name="uname"
            value={formData.uname}
            onChange={handleChange}
            required
            style={{ width: '80%', padding: '12px 20px', margin: '8px 0', border: '1px solid #ccc', boxSizing: 'border-box', borderRadius: '5px' }}
          />
          <input
            type="password"
            placeholder="Enter Password..."
            name="psw"
            value={formData.psw}
            onChange={handleChange}
            required
            style={{ width: '80%', padding: '12px 20px', margin: '8px 0', border: '1px solid #ccc', boxSizing: 'border-box', borderRadius: '5px' }}
          />
          <label>
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            Remember me
          </label>
          <button type="submit" style={{ backgroundColor: 'gray', color: 'black', padding: '14px 20px', margin: '8px 0', border: 'none', cursor: 'pointer', width: '160px', borderRadius: '4px', transitionDuration: '0.5s' }}>
            Create!
          </button>
        </div>
        <div id="bottom" style={{ padding: '16px', backgroundColor: '#f1f1f1' }}>
          <button type="button" className="cancelbtn" style={{ width: 'auto', padding: '10px 18px', backgroundColor: '#f44336' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;