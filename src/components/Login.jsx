import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy login check
    if (email === 'admin' && password === 'password') {
      alert('Login successful!');
      
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Login</h2>
      <br /><br /><br />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

         <br />
        <div>
          Don't have an account?{' '}
          <span>
            <NavLink
              to={`/register`}
              onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              style={{
                color: isHovered ? 'darkblue' : 'blue',
                cursor: 'pointer',
                textDecoration: isHovered ? 'underline' : 'none',
                transition: 'color 0.3s ease, text-decoration 0.3s ease'
              }}
            >
              Sign up
            </NavLink>
          </span>
        </div>
        <br />
        <button type="submit" className="save-button" style={{ marginTop: '1rem' }}>Login</button>
      </form>
    </div>
  );
}

                

export default Login;
