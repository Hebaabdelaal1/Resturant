import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase/config";
import { doc, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";


const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
   const navigate = useNavigate();

  const password = watch("password");

    const onSubmit = async (data) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);

      await setDoc(doc(db, "users", result.user.uid), {
        name: data.name,
        email: data.email,
        number: data.number,
        createdAt: new Date(),
      });

     toast.success("Registration successful!", { duration: 2000, position: "top-center" });
      navigate("/signin");     
    } catch (error) {
       if (error.code === "auth/email-already-in-use") {
      toast.error("This email is already registered!", {
        duration: 3000,
        position: "top-center",
      });
    } else if (error.code === "auth/invalid-email") {
      toast.error("Invalid email format!", {
        duration: 3000,
        position: "top-center",
      });
    } else if (error.code === "auth/weak-password") {
      toast.error("Password should be at least 6 characters!", {
        duration: 3000,
        position: "top-center",
      });
    } else {
      toast.error("Something went wrong. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    }
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-12">
        <Toaster />
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8">
        <h2 className="text-center text-3xl font-bold text-white mb-8">Sign Up</h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
              {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
                placeholder="Enter your name"
                className={`block w-full rounded-lg border border-gray-600 bg-gray-800 px-10 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.name ? "border-red-500" : ""}`}
              />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
            { ...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" } })}
            
                placeholder="Enter your email"
                className="block w-full rounded-lg border border-gray-600 bg-gray-800 px-10 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
             
             />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>

 
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-300 mb-2">
              Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-gray-400" />
              <input
             { ...register("number", { required: "Number is required", pattern: { value: /^(?:\+20|0)1[0125]\d{8}$/, message: "Invalid phone number" } })}
                required
                placeholder="Enter your number"
                className="block w-full rounded-lg border border-gray-600 bg-gray-800 px-10 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number.message} </p>}
            </div>
          </div>


          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
              { ...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                placeholder="Enter your password"
                className="block w-full rounded-lg border border-gray-600 bg-gray-800 px-10 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-orange-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>


          <div>
            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
              { ...register("confirmPassword", { required: "Please confirm your password", validate: value => value === password || "Passwords do not match" })}
                placeholder="Confirm your password"
                className="block w-full rounded-lg border border-gray-600 bg-gray-800 px-10 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-orange-500"
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message} </p>}
            </div>
          </div>

 
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 hover:bg-orange-500 py-2 font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          >
            Sign Up
          </button>
        </form>
          <p className="text-center mt-4 text-sm text-white">
          Already have an account?{' '}
          <Link to="/signup" className="text-orange-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
