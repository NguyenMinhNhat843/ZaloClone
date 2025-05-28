import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const BaseURL = import.meta.env.VITE_BASE_URL;

  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = async (e, index) => {
    const value = e.target.value.trim();

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    const isComplete = otpDigits.every(d => d !== '');
    if (isComplete) {
      const fakeEvent = { preventDefault: () => { } };
      handleSubmit(fakeEvent);
    }
  }, [otpDigits]);


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // quay lại ô trước nếu xóa
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpDigits.map((d) => d.trim()).join("");
    console.log("OTP gửi lên:", otp); // giúp kiểm tra có bị dư ký tự không

    try {
      const response = await fetch(`${BaseURL}/auth/verify`, {  
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json(); // <-- luôn đọc JSON

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Xác thực thất bại");
      }

      alert(result.message || "Xác thực thành công!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch(`${BaseURL}/auth/send`, {  // dùng backtick
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});

      if (!res.ok) throw new Error("Gửi lại mã OTP thất bại");
      alert("Đã gửi lại mã xác thực!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] p-4">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-white">Xác thực email</h1>
          <p className="mb-6 text-gray-400">
            Nhập mã OTP đã gửi đến email:{" "}
            <span className="text-blue-400">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otpDigits.map((digit, i) => (
              <Input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRefs.current[i] = el)}
                className="h-12 w-12 border-gray-700 bg-[#2a2a2a] text-center text-xl text-white"
                required
              />
            ))}
          </div>

          <Button
            type="submit"
            className="h-12 w-full bg-blue-500 text-base hover:bg-blue-600"
          >
            Xác nhận
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-blue-500 hover:underline"
            >
              Gửi lại mã xác thực
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
