import React, { useState } from 'react';

const Login = ({ setCurrentPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy login check
    if (username === 'admin' && password === 'password') {
      alert('Login successful!');
      // Redirect or set auth state here
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
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
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
          Don't have an account? <span onClick={() => setCurrentPage("register")}>Sign up</span>
        </div>
        <br />
        <button type="submit" class="save-button" style={{ marginTop: '1rem' }}>Login</button>
      </form>
    </div>
  );
}

export default Login;
