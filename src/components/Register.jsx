import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [user_name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isHovered, setIsHovered] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Simulate successful registration
    setSuccess('Registration successful!');
    try {
      const response = await fetch('http://localhost:8080/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: user_name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      // Assuming your API returns a token
      const token = data.token;
      localStorage.setItem('token', token);

      alert('Login successful!');
      setError('');

      navigate('/admin/statistics');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
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
              to={`/admin/login`}
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
