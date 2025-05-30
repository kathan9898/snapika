import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { generateOTP } from '../utils/otpGenerator';
import '../styles/main.css';

let generatedOTP = '';

export default function OTPVerify() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!email) {
      setError("Email not found.");
      return;
    }
    generatedOTP = generateOTP();
    console.log("OTP:", generatedOTP);
    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      { to_email: email, passcode: `Your OTP is ${generatedOTP}` },
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setSent(true);
      setError('');
    }).catch(() => {
      setError("Failed to send OTP. Try again.");
    });
  };

  const verifyOTP = () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    if (otp === generatedOTP) {
      setError('');
      navigate('/gallery');
    } else {
      setError("Incorrect OTP. Try again.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>OTP Verification</h2>
      {error && <div className="error">{error}</div>}
      {!sent ? (
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOTP}>Verify</button>
          <button style={{ backgroundColor: '#555', marginTop: '10px' }} onClick={sendOtp}>Resend OTP</button>
        </>
      )}
    </div>
  );
}
