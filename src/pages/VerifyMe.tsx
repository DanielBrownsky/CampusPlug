
import { useEffect, useState } from "react";
import VerifyStepper from "../components/VerifyStepper";
import { useAuth } from "../components/AuthProvider";
import LoginPromptModal from "../components/LoginPromptModal";
import { useNavigate } from "react-router-dom";

const predefinedSchools = [
  "OAUSTECH",
  "FUTA",
  "OAU",
  "UNILAG",
  "UI",
  "UNN",
  "UNIBEN",
  "UNILORIN",
  "LASU",
  "AAU",
  "Babcock",
  "Other",
];

const VerifyMe = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [matricNo, setMatricNo] = useState("");
  const [school, setSchool] = useState("");
  const [customSchool, setCustomSchool] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const actualSchool = school === "Other" ? customSchool : school;

  useEffect(() => {
    if (!user) {
      setShowModal(true);
    }
  }, [user]);

  if (!user) {
    return (
      <LoginPromptModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    );
  }

  // ✅ Already Verified UI
  if (user?.isVerified) {
    return (
      <div className="min-h-screen px-4 py-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex items-center justify-center">
        <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 rounded-lg p-6 text-center max-w-md w-full">
          <h1 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">You're Already Verified ✅</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You’ve already completed student verification and can now post listings as a seller.
          </p>

          {/* 🔓 Dev-only toggle to simulate unverify (for testing) */}
          <button
            className="mt-4 text-xs underline text-blue-500"
            onClick={() => {
              const updated = { ...user, isVerified: false };
              localStorage.setItem("campusplug-user", JSON.stringify(updated));
              login(updated); // force update context
              alert("Dev Mode: Unverified status reset.");
              location.reload();
            }}
          >
            🔧 Dev Reset Verification
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user?.isVerified && submitted) {
      navigate("/dashboard");
    }
  }, [user, submitted, navigate]);

  const handleSubmit = async () => {
    if (!matricNo || !actualSchool || !file) {
      alert("Please fill all fields before submitting.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setStep(4);

      // 🔐 Save locally (simulate backend submission)
      const prev = JSON.parse(localStorage.getItem("campusplug-verifications") || "[]");
      const updated = [
        ...prev,
        {
          userId: user?.id,
          name: user?.name,
          email: user?.email,
          matricNo,
          school: actualSchool,
          fileName: file.name,
          submittedAt: new Date().toISOString(),
          isApproved: false,
        },
      ];
      localStorage.setItem("campusplug-verifications", JSON.stringify(updated));
    }, 1200);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-xl mx-auto space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Verify as a Student</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload your school details to become a verified seller on CampusPlug. This helps build trust and visibility.
          </p>
        </div>

        {/* 🔁 Stepper */}
        <VerifyStepper currentStep={step} />

        
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Matric Number</label>
              <input
                type="text"
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                placeholder="e.g. CSC/1234/2020"
                className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Campus</label>
              <select
                value={school}
                onChange={(e) => {
                  setSchool(e.target.value);
                  if (e.target.value !== "Other") setCustomSchool("");
                }}
                className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Select your campus</option>
                {predefinedSchools.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>

            {school === "Other" && (
              <div>
                <label className="block text-sm font-medium mb-1">Enter your school name</label>
                <input
                  type="text"
                  value={customSchool}
                  onChange={(e) => setCustomSchool(e.target.value)}
                  placeholder="Enter your campus name"
                  className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!matricNo || !actualSchool}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Upload ID */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Upload Your School ID or Portal Screenshot
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;
                setFile(selected);
              }}
              className="w-full text-sm"
            />

            {file && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Selected: {file.name}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 border dark:border-gray-600 rounded-md"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!file}
                className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Confirm & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please confirm all information before submitting for verification. You’ll be notified once your details are approved.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2 border dark:border-gray-600 rounded-md"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}

        {/* Awaiting Review */}
        {step === 4 && submitted && (
          <div className="text-center py-10">
            <p className="text-green-600 dark:text-green-400 font-semibold text-lg mb-2">
              🎉 Submitted Successfully!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your request is now under review. You’ll receive an email once verified.
            </p>

            {/* 🔓 Dev Toggle – simulate approval */}
            <button
              className="mt-6 inline-block text-xs underline text-blue-500"
              onClick={() => {
                const updated = { ...user, isVerified: true };
                localStorage.setItem("campusplug-user", JSON.stringify(updated));
                login(updated);
                alert("Dev Mode: You are now marked as verified.");
                location.reload();
              }}
            >
              🔧 Simulate Admin Approval (Dev Only)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyMe;
