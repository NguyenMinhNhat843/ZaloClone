import { X, Camera } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function Profile({ onClose }) {
  const [isEdit, setIsEdit] = useState(false);
  const { user, setUserDetails } = useUser();
  const [name, setName] = useState(user.name);
  const [gender, setGender] = useState(user.gender);
  const [dateOfBirth, setDateOfBirth] = useState(new Date(user.dateOfBirth));
  const [avatar, setAvatar] = useState(user.avatar);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setName(user.name);
    setGender(user.gender);
    setDateOfBirth(new Date(user.dateOfBirth));
  }, [user]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleDateChange = (e, type) => {
    const newDateOfBirth = new Date(dateOfBirth);
    if (type === "day") {
      newDateOfBirth.setDate(Number(e.target.value));
    } else if (type === "month") {
      newDateOfBirth.setMonth(Number(e.target.value) - 1);
    } else if (type === "year") {
      newDateOfBirth.setFullYear(Number(e.target.value));
    }
    setDateOfBirth(newDateOfBirth);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth.toISOString());
  
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error("Cập nhật thất bại!");
      }
  
      setUserDetails({
        ...user,
        name,
        gender,
        dateOfBirth: dateOfBirth.toISOString(),
        avatar: data.avatar || avatar,
      });
  
      setIsEdit(false);
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative h-[600px] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-black">
            Thông tin tài khoản
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* UI Profile */}
        <div
          className={`relative left-0 top-0 h-full w-full bg-white transition-transform duration-150 ${
            isEdit ? "-translate-x-full" : "translate-x-0"
          } `}
        >
          <div className="p-4">
            <div className="relative h-48 rounded-lg bg-gray-600">
              <img
                src="/upload/backgroudUser.jpg"
                alt="Cover"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-[-60px] left-4">
                <div className="relative h-20 w-20 rounded-full border-4 border-white">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-full w-full rounded-full object-cover"
                  />

                  <label className="absolute left-12 top-12 cursor-pointer rounded-full bg-gray-300 p-2">
                    <Camera size={16} className="text-black" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-12 pl-4">
              <div className="relative left-[100px] top-[-40px]">
                <h3 className="text-xl font-bold text-black">{name}</h3>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Giới tính:</span>
                <span className="text-gray-900">
                  {gender === "male" ? "Nam" : "Nữ"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Ngày sinh:</span>
                <span className="text-gray-900">
                  {new Date(dateOfBirth).getDate()} tháng{" "}
                  {new Date(dateOfBirth).getMonth() + 1} năm{" "}
                  {new Date(dateOfBirth).getFullYear()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Điện thoại:</span>
                <span className="text-gray-900">{user.phone}</span>
              </div>
              <p className="text-sm text-gray-500">
                Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4">
            <button
              className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={() => setIsEdit(true)}
            >
              Chỉnh sửa
            </button>
          </div>
        </div>

        {/* UI Update */}
        <div
          className={`relative left-0 top-[-600px] h-full w-full bg-white transition-transform duration-150 ${
            isEdit ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto p-4">
            <div className="flex-col justify-between">
              <div>
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>

                  <label className="mt-4 flex cursor-pointer items-center justify-center rounded-lg bg-gray-300 px-6 py-3 text-black transition-all hover:bg-gray-200">
                    <span className="text-sm font-medium">
                      Tải ảnh lên từ thư viện
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <label className="mb-2 block text-sm">Tên hiển thị</label>
                <input
                  type="text"
                  className="mb-4 w-full rounded border px-3 py-2"
                  defaultValue={name}
                  onChange={handleNameChange}
                />

                <label className="mb-2 block text-sm">Giới tính</label>
                <div className="mb-4 flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      defaultChecked={gender === "male"}
                      onChange={handleGenderChange}
                    />
                    Nam
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      defaultChecked={gender === "female"} // Nếu giới tính là 'female', radio 'Nữ' sẽ được chọn
                      onChange={handleGenderChange}
                    />
                    Nữ
                  </label>
                </div>

                <label className="mb-2 block text-sm">Ngày sinh</label>
                <div className="mb-6 flex gap-2">
                  {/* Ngày */}
                  <select
                    defaultValue={dateOfBirth.getDate()}
                    onChange={(e) => handleDateChange(e, "day")}
                    className="rounded border px-2 py-1"
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  {/* Tháng */}
                  <select
                    defaultValue={dateOfBirth.getMonth() + 1}
                    onChange={(e) => handleDateChange(e, "month")}
                    className="rounded border px-2 py-1"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  {/* Năm */}
                  <select
                    defaultValue={dateOfBirth.getFullYear()}
                    onChange={(e) => handleDateChange(e, "year")}
                    className="rounded border px-2 py-1"
                  >
                    {[...Array(50)].map((_, i) => (
                      <option key={i} value={1975 + i}>
                        {1975 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setIsEdit(false);
                  }}
                  className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    handleSubmit();
                  }}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
