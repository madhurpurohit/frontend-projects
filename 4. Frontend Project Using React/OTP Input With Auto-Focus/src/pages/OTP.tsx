import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

// ─── Constants ───
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

// ─── Simulated Delays ───
const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ─── Sub-Components ───

/** Shield icon SVG for trust signal */
const ShieldIcon = () => (
  <svg
    className="animate-float mx-auto mb-3 h-14 w-14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#shieldGrad)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/** Animated success checkmark */
const SuccessCheckmark = () => (
  <svg className="mx-auto h-20 w-20" viewBox="0 0 60 60" fill="none">
    <circle
      cx="30"
      cy="30"
      r="27"
      stroke="#22c55e"
      strokeWidth="3"
      className="checkmark-circle"
    />
    <path
      d="M18 30l8 8 16-16"
      stroke="#22c55e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="checkmark-check"
    />
  </svg>
);

/** Pulsing dots loading indicator */
const LoadingDots = () => (
  <div className="flex items-center justify-center gap-1.5">
    <span className="dot-pulse-1 inline-block h-2 w-2 rounded-full bg-white" />
    <span className="dot-pulse-2 inline-block h-2 w-2 rounded-full bg-white" />
    <span className="dot-pulse-3 inline-block h-2 w-2 rounded-full bg-white" />
  </div>
);

// ─── Screen type ───
type Screen = "phone" | "otp" | "success";

// ─── Main Component ───
export const OTP = () => {
  // ────── State ──────
  const [screen, setScreen] = useState<Screen>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [shakeInputs, setShakeInputs] = useState(false);

  // ────── Refs ──────
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ────── Timer Logic ──────
  const startTimer = useCallback(() => {
    setTimer(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ────── Phone Validation ──────
  const isPhoneValid = /^[6-9]\d{9}$/.test(phone);

  // ────── Send OTP ──────
  const handleSendOTP = async () => {
    if (!isPhoneValid) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    await simulateDelay(2000);
    setLoading(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    setScreen("otp");
    startTimer();
    // Focus first input after transition
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  // ────── OTP Input Handlers ──────
  const handleOtpChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only single digit
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    // On Backspace in empty box → go to prev
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }

    // Arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus the next empty or last input
    const nextEmpty = newOtp.findIndex((v) => !v);
    const focusIdx = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIdx]?.focus();
  };

  // ────── Verify OTP ──────
  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== OTP_LENGTH) {
      setError("Please enter the complete OTP");
      setShakeInputs(true);
      setTimeout(() => setShakeInputs(false), 500);
      return;
    }
    setError("");
    setLoading(true);
    await simulateDelay(2000);
    setLoading(false);

    // Simulate: accept any fully filled OTP as correct
    setScreen("success");
  };

  // ────── Resend OTP ──────
  const handleResendOTP = async () => {
    if (timer > 0) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setLoading(true);
    await simulateDelay(1500);
    setLoading(false);
    startTimer();
    inputRefs.current[0]?.focus();
  };

  // ────── Go back to phone screen ──────
  const handleEditPhone = () => {
    setScreen("phone");
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);
  };

  // ────── Format timer display ──────
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ────── Render ──────
  return (
    <div className="animate-fade-in-scale relative w-full max-w-md">
      {/* Glow behind card */}
      <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />

      {/* Main card */}
      <div className="relative rounded-3xl border border-white/10 bg-neutral-900/80 px-8 py-10 shadow-2xl backdrop-blur-xl sm:px-10">
        {/* ═══════════ PHONE INPUT SCREEN ═══════════ */}
        {screen === "phone" && (
          <div className="animate-fade-in-up" key="phone-screen">
            <ShieldIcon />

            <h2 className="mb-1 text-center text-2xl font-semibold text-white">
              Welcome Back
            </h2>
            <p className="mb-8 text-center text-sm text-neutral-400">
              Enter your mobile number to receive a verification code
            </p>

            {/* Phone input */}
            <div className="group relative">
              <label
                htmlFor="phone-input"
                className="mb-2 block text-xs font-medium tracking-wide text-neutral-400 uppercase"
              >
                Mobile Number
              </label>
              <div className="flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-neutral-800/60 transition-all duration-300 focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20">
                {/* Country code */}
                <div className="flex items-center gap-1.5 border-r border-white/10 px-4 text-sm text-neutral-300 select-none">
                  <span className="text-base">🇮🇳</span>
                  <span className="font-medium">+91</span>
                </div>
                {/* Input */}
                <input
                  id="phone-input"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPhone(val);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendOTP();
                  }}
                  placeholder="98765 43210"
                  className="w-full bg-transparent px-4 py-3.5 text-lg tracking-widest text-white placeholder-neutral-600 outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 text-center text-xs font-medium text-red-400">
                {error}
              </p>
            )}

            {/* Send OTP Button */}
            <button
              id="send-otp-btn"
              onClick={handleSendOTP}
              disabled={loading}
              className="animate-bg-pulse mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <LoadingDots />
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Send OTP
                </>
              )}
            </button>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-neutral-500">
              By continuing, you agree to our{" "}
              <span className="cursor-pointer text-indigo-400 hover:underline">
                Terms
              </span>{" "}
              &{" "}
              <span className="cursor-pointer text-indigo-400 hover:underline">
                Privacy Policy
              </span>
            </p>
          </div>
        )}

        {/* ═══════════ OTP VERIFICATION SCREEN ═══════════ */}
        {screen === "otp" && (
          <div className="animate-fade-in-up" key="otp-screen">
            <ShieldIcon />

            <h2 className="mb-1 text-center text-2xl font-semibold text-white">
              Verify OTP
            </h2>
            <p className="mb-8 text-center text-sm text-neutral-400">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-indigo-400">
                +91 {phone.slice(0, 5)} {phone.slice(5)}
              </span>
            </p>

            {/* OTP Input Boxes */}
            <div
              className={`flex items-center justify-center gap-2.5 sm:gap-3 ${shakeInputs ? "animate-shake" : ""}`}
            >
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  onFocus={(e) => e.target.select()}
                  aria-label={`OTP digit ${index + 1}`}
                  className={`h-13 w-11 rounded-xl border bg-neutral-800/60 text-center text-xl font-semibold text-white transition-all duration-200 outline-none sm:h-14 sm:w-12 sm:text-2xl ${
                    otp[index]
                      ? "border-indigo-500/70 shadow-md shadow-indigo-500/20"
                      : "border-white/10 hover:border-white/20"
                  } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30`}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 text-center text-xs font-medium text-red-400">
                {error}
              </p>
            )}

            {/* Verify Button */}
            <button
              id="verify-otp-btn"
              onClick={handleVerifyOTP}
              disabled={loading || otp.join("").length !== OTP_LENGTH}
              className="animate-bg-pulse mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <LoadingDots />
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Verify OTP
                </>
              )}
            </button>

            {/* Timer & Resend */}
            <div className="mt-6 flex flex-col items-center gap-2">
              {timer > 0 ? (
                <p className="text-xs text-neutral-500">
                  Resend code in{" "}
                  <span className="font-mono font-semibold text-indigo-400">
                    {formatTime(timer)}
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="cursor-pointer text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}

              {/* Edit phone */}
              <button
                onClick={handleEditPhone}
                disabled={loading}
                className="flex cursor-pointer items-center gap-1 text-xs text-neutral-500 transition-colors hover:text-neutral-300 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Change number
              </button>
            </div>
          </div>
        )}

        {/* ═══════════ SUCCESS SCREEN ═══════════ */}
        {screen === "success" && (
          <div className="animate-fade-in-up text-center" key="success-screen">
            <SuccessCheckmark />

            <h2 className="mt-6 text-2xl font-semibold text-white">
              Verified!
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Your phone number has been successfully verified.
            </p>

            <div className="mx-auto mt-4 flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
              <span>🇮🇳</span>
              <span className="font-medium">
                +91 {phone.slice(0, 5)} {phone.slice(5)}
              </span>
            </div>

            <button
              onClick={() => {
                setScreen("phone");
                setPhone("");
                setOtp(Array(OTP_LENGTH).fill(""));
                setError("");
              }}
              className="mt-8 cursor-pointer text-xs text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Use a different number →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
