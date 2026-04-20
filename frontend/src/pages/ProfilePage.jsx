import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../chat-app-assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = React.useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [preview, setPreview] = useState(authUser?.profilePic || "");
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const navigate = useNavigate();

  // ✅ Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImg(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = preview;

      // 🔥 Upload directly to Cloudinary
      if (selectedImg) {
        const formData = new FormData();
        formData.append("file", selectedImg);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (!data.secure_url) {
          throw new Error("Cloudinary upload failed");
        }

        imageUrl = data.secure_url;
      }

      // ✅ Send only URL to backend
      await updateProfile({
        fullName: name,
        bio,
        profilePic: imageUrl,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] max-w-3xl backdrop-blur-xl border border-gray-700 rounded-xl flex max-md:flex-col p-6 gap-6">

        {/* LEFT */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 text-white"
        >
          <h2 className="text-xl font-semibold">Profile details</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              hidden
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />

            <img
              src={preview || assets.avatar_icon}
              alt=""
              className="w-12 h-12 rounded-full object-cover border"
            />

            <span className="text-sm text-gray-300">
              Upload profile image
            </span>
          </label>

          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="p-2 rounded-md bg-transparent border border-gray-600 focus:ring-2 focus:ring-violet-500 outline-none"
          />

          <textarea
            value={bio}
            required
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write profile bio"
            rows={4}
            className="p-2 rounded-md bg-transparent border border-gray-600 focus:ring-2 focus:ring-violet-500 outline-none resize-none"
          />

          <button className="bg-gradient-to-r from-purple-500 to-violet-600 py-2 rounded-full hover:opacity-90 transition">
            Save
          </button>
        </form>

        {/* RIGHT */}
        <div className="flex items-center justify-center flex-1">
          <img
            src={preview || assets.logo_icon}
            alt=""
            className="w-40 h-40 rounded-full object-cover border border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;