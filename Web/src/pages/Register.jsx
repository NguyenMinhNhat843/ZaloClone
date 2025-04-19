import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { useUser } from "../contexts/UserContext"; // Import hook để sử dụng context

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUserDetails } = useUser(); // Lấy hàm setUserDetails từ context
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    gmail: "",
  });
  

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    gender: "Nam",
    dateOfBirth: "2000-01-01",
    avatar: "https://img.lovepik.com/png/20231127/young-businessman-3d-cartoon-avatar-portrait-character-digital_708913_wh860.png",
    gmail: "",
  });

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]:;"'<>,.?/\\]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      gmail: "",
    };
  
    let isValid = true;
  
    if (!formData.name.trim()) {
      newErrors.name = "❌ Vui lòng nhập tên hiển thị.";
      isValid = false;
    }
  
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "❌ Số điện thoại phải có đúng 10 chữ số.";
      isValid = false;
    }
  
    if (!formData.gmail.trim()) {
      newErrors.gmail = "❌ Vui lòng nhập email.";
      isValid = false;
    }
  
    if (!isValidPassword(formData.password)) {
      setPasswordError(
        "❌ Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }
  
    setErrors(newErrors);
    return isValid;
  };
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'phone') {
      // Chỉ cho phép số và tối đa 10 ký tự
      const onlyNumbers = value.replace(/\D/g, ''); // Xoá ký tự không phải số
      if (onlyNumbers.length > 10) return; // Giới hạn 10 chữ số
      setFormData({ ...formData, [id]: onlyNumbers });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (formData.phone.length !== 10) {
      alert("❌ Số điện thoại phải có đúng 10 chữ số.");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setPasswordError("❌ Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
      return;
    } else {
      setPasswordError("");
    }
    
    console.log("Form data:", formData); // Log dữ liệu gửi đi

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Xử lý lỗi nếu có
        console.error("Error:", errorData);
        throw new Error("Đăng ký thất bại");
      }

      const data = await response.json();
      const { gmail } = formData;
  
      console.log('Đăng ký thành công:', data);
  
      // Lưu thông tin người dùng vào context
      setUserDetails(data);
  
      // B2: Gửi OTP đến gmail
      const otpResponse = await fetch('http://localhost:3000/auth/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: gmail }),
      });
  
      if (!otpResponse.ok) {
        const errorOtp = await otpResponse.json();
        throw new Error(errorOtp.message || 'Gửi OTP thất bại');
      }
  
      console.log('Đã gửi OTP thành công đến:', gmail);
  
      // B3: Chuyển tới trang xác minh, truyền email
      navigate('/verifyRegister', { state: { email: gmail } });
  
    } catch (error) {
      console.error("Lỗi:", error.message);
    }
  };
  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] p-4">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
          <h1 className="mb-1 text-2xl font-bold text-white">
            Đăng ký tài khoản Zalo
          </h1>
          <p className="text-gray-400">
            Đã có tài khoản?
            <Link to="/login" className="ml-1 text-blue-500 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
      <div>
        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Tên hiển thị
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="h-12 border-gray-700 bg-[#2a2a2a] text-white"
              placeholder="Nhập tên hiển thị"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              inputMode="numeric"
              pattern="0[0-9]{9}"
              value={formData.phone}
              onChange={handleChange}
              className="h-12 border-gray-700 bg-[#2a2a2a] text-white"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}

          </div>

          <div className="space-y-2">
            <Label htmlFor="gmail" className="text-gray-300">
              Email
            </Label>
            <Input
              id="gmail"
              type="email"
              required
              value={formData.gmail}
              onChange={handleChange}
              className="h-12 border-gray-700 bg-[#2a2a2a] text-white"
              placeholder="Nhập email"
            />
            {errors.gmail && (
              <p className="text-sm text-red-500 mt-1">{errors.gmail}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Mật khẩu
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="h-12 border-gray-700 bg-[#2a2a2a] pr-12 text-white"
                placeholder="Nhập mật khẩu"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
          </div>

          {/* Optional Gender and Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-300">
              Giới tính
            </Label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="h-12 w-full rounded border-gray-700 bg-[#2a2a2a] px-3 text-white"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-gray-300">
              Ngày sinh
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="h-12 border-gray-700 bg-[#2a2a2a] text-white"
            />
          </div>

          {/* Avatar có thể để trống */}
          <Input type="hidden" id="avatar" value="" readOnly />

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              className="mt-1 border-gray-600 data-[state=checked]:bg-blue-500"
              required
            />
            <Label htmlFor="terms" className="text-sm text-gray-300">
              Tôi đồng ý với các{" "}
              <button className="text-blue-500 hover:underline">
                Điều khoản sử dụng
              </button>{" "}
              và{" "}
              <button className="text-blue-500 hover:underline">
                Chính sách bảo mật
              </button>{" "}
              của Zalo
            </Label>
          </div>
          <div className="flex flex-col gap-5">
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Đăng ký
            </button>
          </div>
        </form>
        {formError && (
          <p className="text-sm text-red-500 mt-1">{formError}</p>
        )}
      </div>
    </div>
  );
}
