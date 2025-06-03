import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterWithEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setError("");
    } catch (err) {
      setError("Lỗi đăng ký: tài khoản đã tồn tại");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
        <svg
          className="h-10 w-10 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 12l8-5.99V6l-8 5-8-5z" />
        </svg>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          {success && (
            <p className="mt-2 text-sm text-green-500">Đăng ký thành công!</p>
          )}

          <div className="grid gap-5 mt-5">
            <button
              onClick={handleRegister}
              className="w-full rounded-md bg-blue-600 hover:bg-blue-500 p-2 text-white"
            >
              Đăng ký
            </button>

            <Link
              to="/login-email"
              className="w-full text-center rounded-md bg-gray-600 hover:bg-gray-500 p-2 text-white"
            >
              Đi đến trang đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
