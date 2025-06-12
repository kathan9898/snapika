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
  const [sending, setSending] = useState(false);
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!email || sending) return;

    setSending(true);
    generatedOTP = generateOTP();

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
    }).finally(() => {
      setSending(false);
    });
  };

  const verifyOTP = () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    if (otp === generatedOTP) {
      localStorage.setItem("Verfied", true);
      navigate('/dashboard');
    } else {
      setError("Incorrect OTP. Try again.");
    }
  };

  return (
    <div className="container">
      <h2>OTP Verification</h2>
      <p>We've sent a one-time code to <strong>{email}</strong></p>
      {error && <div className="error">{error}</div>}

      {!sent ? (
        <button onClick={sendOtp} disabled={sending}>
          {sending ? "Sending..." : "Send OTP"}
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify</button>
        </>
      )}
    </div>
  );
}
