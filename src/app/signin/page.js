"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";

const mobileSchema = z.object({
  mobileNumber: z
    .string()
    .length(10, "Must be 10 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
});

const Signin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [otpfieldVisible, setOtpfieldVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mobileSchema),
  });

  const countryCode =
    selectedCountry?.idd?.root + selectedCountry?.idd?.suffixes?.[0];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      router.push("/dashboard");
      return;
    }

    fetch("https://restcountries.com/v3.1/all?fields=idd,name")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
        setSelectedCountry(
          sorted.find((c) => c.name.common === "India") || sorted[0]
        );
      })
      .catch(() => toast.error("Failed to load countries"));
  }, [router]);

  const generateOtp = () => {
    const tempOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(tempOtp);
    toast.success(`OTP generated: ${tempOtp}`);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);

    const { mobileNumber } = data;

    if (!otpfieldVisible) {
      generateOtp();
      setOtpfieldVisible(true);
      setIsSubmitting(false);
      return;
    }

    if (enteredOtp !== otp) {
      toast.error("Invalid OTP");
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem("user", mobileNumber);
    dispatch(setUser(mobileNumber));
    toast.success("Login successful!");
    setTimeout(() => router.push("/dashboard"), 1000);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#292A2D] w-full h-screen flex items-center justify-center">
      <div className="max-md:flex-col md:h-[60%] w-[80%] bg-zinc-900 rounded-4xl md:p-20 p-5 flex">
        <div className="md:w-1/2 text-3xl gap-5">
          <p>Sign in</p>
          <p className="text-xl">Use your Mobile number</p>
        </div>

        <form
          className="md:w-1/2 p-5 flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <select
            className="w-full py-4 text-white px-4 border bg-[#18181B] border-white rounded-lg"
            value={selectedCountry?.name?.common}
            onChange={(e) => {
              const country = countries.find(
                (c) => c.name.common === e.target.value
              );
              setSelectedCountry(country);
            }}
          >
            {countries.map((country) => (
              <option key={country.name.common} value={country.name.common}>
                {country.name.common}
              </option>
            ))}
          </select>

          {/* Mobile Number Field */}
          <div className="w-full py-4 text-white px-4 border border-white rounded-lg flex items-center gap-1">
            <span>{countryCode}</span>
            <input
              type="tel"
              placeholder="Enter your phone number"
              inputMode="numeric"
              className="w-full outline-0 bg-transparent"
              maxLength={10}
              {...register("mobileNumber")}
            />
          </div>
          {errors.mobileNumber && (
            <p className="text-red-400 text-sm -mt-4">
              {errors.mobileNumber.message}
            </p>
          )}

          {/* OTP Field */}
          {otpfieldVisible && (
            <div className="w-full py-4 text-white px-4 border border-white rounded-lg flex items-center gap-1">
              <input
                type="tel"
                inputMode="numeric"
                className="w-full outline-0 bg-transparent"
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={(e) =>
                  setEnteredOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                maxLength={4}
                required
              />
            </div>
          )}

          <span className="md:self-end self-center">
            <button
              type="submit"
              className="bg-[#8ab4f8] rounded-full text-md font-semibold px-4 py-1 text-gray-900 cursor-pointer disabled:opacity-50"
              disabled={isSubmitting}
            >
              {otpfieldVisible ? "Verify OTP" : "Generate OTP"}
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signin;
