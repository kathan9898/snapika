import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const users = {
  "rand6148@gmail.com": "123",
  "xyz@gmail.com": "123"
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userEmail")) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
    <div>
      <h2>Snapika Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login & Send OTP</button>
      </form>
    </div>
  );
}
