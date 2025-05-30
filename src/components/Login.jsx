import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

const users = {
  "rand6148@gmail.com": "123",
  "xyz@gmail.com": "123"
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (users[email] === password) {
      localStorage.setItem("userEmail", email);
      setError('');
      navigate('/verify');
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>Snapika Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login & Send OTP</button>
      </form>
    </div>
  );
}
