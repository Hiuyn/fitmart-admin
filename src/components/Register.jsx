import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Register = ({ setCurrentPage }) => {
const [user_name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isHovered, setIsHovered] = useState(false);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Simulate successful registration
    setSuccess('Registration successful!');
    console.log(user_name);
    console.log(password)
    // Add actual registration logic here (e.g., call to API)
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Register</h2>
      <br /><br /><br />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={user_name}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
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

        <div style={{ marginTop: '1rem' }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <br />
        <div>
          Already have an account?{' '}
          <NavLink
              to={`/login`}
              onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              style={{
                color: isHovered ? 'darkblue' : 'blue',
                cursor: 'pointer',
                textDecoration: isHovered ? 'underline' : 'none',
                transition: 'color 0.3s ease, text-decoration 0.3s ease'
              }}
            >
              Sign in
            </NavLink>
        </div>
        <br />
        <button type="submit" class="save-button" style={{ marginTop: '1rem' }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
