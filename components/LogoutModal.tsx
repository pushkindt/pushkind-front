/**
 * @file LogoutModal.tsx renders the confirmation dialog for signing out.
 */
import React from "react";
import Modal from "./Modal";

/**
 * Props consumed by the logout confirmation modal.
 */
interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Confirms whether the authenticated user wants to end the current session.
 */
const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Выход">
      <p className="text-sm text-gray-600">
        Вы уверены, что хотите выйти из аккаунта?
      </p>
      <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
        >
          Отмена
        </button>
        <button
          onClick={onConfirm}
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
        >
          Выйти
        </button>
      </div>
    </Modal>
  );
};

export default LogoutModal;
