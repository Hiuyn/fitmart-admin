import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = ({ setCurrentPage }) => {  
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [isHovered, setIsHovered] = useState(false);

  
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dummy login check
    if (email === 'admin' && password === 'password') {
      alert('Login successful!');
      
    } else {
      setError('Invalid credentials');
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();


      // Assuming your API returns a token
      const token = data.data.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.data));

      alert('Login successful!');
      setError('');

      navigate('/admin/statistics');
    } catch (err) {
      setError(err.message || 'Login failed');
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
              to={`/admin/register`}
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
