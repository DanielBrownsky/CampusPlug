
import type { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  onClose: () => void;
  open: boolean;
}

const LoginPromptModal: FC<Props> = ({ open, onClose }) => {
    if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl w-80 text-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
          Please sign in to access this content
        </p>
        <Link
          to="/login"
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          🔐 Sign In
        </Link>
      </div>
    </div>
  );
};

export default LoginPromptModal;
