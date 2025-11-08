import React from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa"; 
import { Link, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/config";


const SignIn = () => {

    const {register,handleSubmit, formState: { errors },setError} = useForm();

 const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log(" Logged in:", result.user);

      alert("Login successful!");
      Navigate("/"); 
    } catch (error) {
      console.error(" Error:", error.message);
      setError("email", { type: "manual", message: "Invalid email or password" });
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-6 py-12">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 sm:p-10">
        <h2 className="text-center text-3xl font-bold text-white mb-8">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                {...register('email',
                    {
                        required: 'Email is required',
                        pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address'
                    }}
                )
                }
                placeholder="Enter your email"
                className={`block w-full rounded-lg border border-gray-600 bg-gray-800 pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${ errors.email ? 'border-red-500' : 'border-gray-300' }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
            
                type="password"
                {...register('password',
                    {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    }
                )
                }
                placeholder="Enter your password"
                className={`block w-full rounded-lg border border-gray-600 bg-gray-800 pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${ errors.password ? 'border-red-500' : 'border-gray-300' }`}
              />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>


          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 hover:bg-orange-500 py-2 font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

 
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
        {/* <Link to="/signup" className="text-orange-400 hover:underline font-medium">
            Sign Up
          </Link> */}
        </p>
      </div>
    </div>
  );
};

export default SignIn;
