
import React, { useState } from 'react';
import { HUB_ID } from '../constants';
import { sendOtp, verifyOtp } from '../services/api';
import type { User } from '../types';
import Modal from './Modal';
import { SpinnerIcon } from './Icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const { success } = await sendOtp(HUB_ID, phone);
    setIsLoading(false);
    if (success) {
      setStep('otp');
    } else {
      setError('Could not find an account with this number.');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const { success, user } = await verifyOtp(HUB_ID, phone, otp);
    setIsLoading(false);
    if (success && user) {
      onLoginSuccess(user);
      resetState();
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const resetState = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetState} title={step === 'phone' ? 'Login with Phone' : 'Enter OTP'}>
      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit}>
          <p className="text-gray-600 mb-4">Enter your phone number to receive a one-time password.</p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="5551234567"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || phone.length < 10}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <p className="text-gray-600 mb-4">An OTP has been sent to {phone}.</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="123456"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <SpinnerIcon className="w-5 h-5"/> : 'Verify & Login'}
          </button>
          <button type="button" onClick={() => { setStep('phone'); setError(''); }} className="mt-2 w-full text-sm text-indigo-600 hover:underline">
            Use a different number
          </button>
        </form>
      )}
    </Modal>
  );
};

export default LoginModal;
