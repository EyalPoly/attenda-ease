import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthProvider";
import { validatePassword } from "../../utils/ValidatePassword";

const UpdatePasswordForm = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}) => {
  const {
    currentUser,
    updateUserPassword,
    reauthenticateUsingCredential,
    GetEmailAuthProvider,
  } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = async () => {
    let valid = true;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Verify current password
    try {
      if (!currentUser || !currentUser.email) {
        errors.currentPassword =
          "User is not authenticated or email is missing";
        valid = false;
      } else {
        const EmailAuthProvider = GetEmailAuthProvider();
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword
        );
        await reauthenticateUsingCredential(currentUser, credential);
      }
    } catch (err: Error | any) {
      errors.currentPassword =
        err instanceof Error ? err.message : "Invalid password";
      valid = false;
    }

    // Validate new password
    if (!validatePassword(newPassword)) {
      errors.newPassword =
        "Password must be 8-30 characters, include at least one uppercase letter, one lowercase letter, and one number";
      valid = false;
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUpdating) {
      setIsUpdating(true);
      if (await validateForm()) {
        try {
          await updateUserPassword(currentPassword, newPassword);
          onSuccess?.("!הסיסמה עודכנה בהצלחה");
          onClose();
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };

  return (
    <div className="w-full text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
      <div className="text-center mb-6">
        <h3 className="text-gray-800 text-xl font-semibold">עדכון סיסמה</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="text-sm text-gray-600 font-bold"
          >
            סיסמה נוכחית
          </label>
          <input
            id="currentPassword"
            type="password"
            disabled={isUpdating}
            required
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, currentPassword: "" })); // Clear error on input change
            }}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
          {fieldErrors.currentPassword && (
            <span className="text-red-500 text-sm">
              {fieldErrors.currentPassword}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="text-sm text-gray-600 font-bold"
          >
            סיסמה חדשה
          </label>
          <input
            id="newPassword"
            type="password"
            disabled={isUpdating}
            required
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
          {fieldErrors.newPassword && (
            <span className="text-red-500 text-sm">
              {fieldErrors.newPassword}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm text-gray-600 font-bold"
          >
            אימות סיסמה חדשה
          </label>
          <input
            id="confirmPassword"
            type="password"
            disabled={isUpdating}
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
          {fieldErrors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {fieldErrors.confirmPassword}
            </span>
          )}
        </div>

        {error && <span className="text-red-600 font-bold">{error}</span>}

        <div className="flex gap-4">
          <button
            className={`w-1/2 px-4 py-2 text-white font-medium rounded-lg ${
              isUpdating
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            type="submit"
            disabled={isUpdating}
          >
            {isUpdating ? "מעדכן..." : "עדכן סיסמה"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 px-4 py-2 text-gray-700 font-medium rounded-lg border hover:bg-gray-100"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
