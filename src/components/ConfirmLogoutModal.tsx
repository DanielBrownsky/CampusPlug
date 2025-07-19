import type { FC } from "react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "./AuthProvider";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ConfirmLogoutModal: FC<Props> = ({ open, onClose }) => {
  const { logout } = useAuth();

  const handleConfirm = () => {
    logout();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative bg-white dark:bg-gray-900 rounded-lg p-6 w-[90%] max-w-sm shadow-xl z-50">
        <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Confirm Logout
        </Dialog.Title>
        <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to log out from CampusPlug?
        </Dialog.Description>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmLogoutModal;
