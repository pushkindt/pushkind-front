/**
 * @file LoginModal.tsx implements the OTP authentication flow UI.
 */
import React, { useState } from "react";
import { sendOtp, verifyOtp } from "../services/api";
import type { User } from "../types";
import Modal from "./Modal";
import { SpinnerIcon } from "./Icons";

/**
 * Props consumed by the OTP login modal.
 */
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

/**
 * Two-step modal that first requests a phone number and then validates the OTP
 * sent to the customer.
 */
const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Requests an OTP code for the provided phone number.
   */
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const { success } = await sendOtp(phone);
    setIsLoading(false);
    if (success) {
      setStep("otp");
    } else {
      setError("Не удалось отправить SMS на этот номер. Попробуйте позже.");
    }
  };

  /**
   * Verifies the OTP code and propagates the authenticated user upward.
   */
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const { success, user } = await verifyOtp(phone, otp);
    setIsLoading(false);
    if (success && user) {
      onLoginSuccess(user);
      resetState();
    } else {
      setError("Неверный код. Попробуйте еще раз.");
    }
  };

  /**
   * Returns the modal to its initial state and closes it.
   */
  const resetState = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetState}
      title={step === "phone" ? "Вход по телефону" : "Введите код"}
    >
      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit}>
          <p className="text-gray-600 mb-4">
            Введите номер телефона, чтобы получить одноразовый код.
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              +
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="79876543210"
              className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || phone.length < 10}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : "Отправить код"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <p className="text-gray-600 mb-4">На номер {phone} отправлен код.</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
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
            {isLoading ? (
              <SpinnerIcon className="w-5 h-5" />
            ) : (
              "Подтвердить и войти"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setError("");
            }}
            className="mt-2 w-full text-sm text-indigo-600 hover:underline"
          >
            Использовать другой номер
          </button>
        </form>
      )}
    </Modal>
  );
};

export default LoginModal;
