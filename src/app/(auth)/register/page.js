"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Heart,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import ImageUpload from "@/components/ImageUpload";
import usePageTitle from "@/hooks/usePageTitle";
import { toast } from "sonner";
import { createDoctorProfile, getToken, updateMe, uploadImageFile } from "@/lib/api";

const PASSWORD_RULES = [
  { label: "At least 6 characters", test: (p) => p.length >= 6 },
  { label: "At least one number", test: (p) => /\d/.test(p) },
  { label: "At least one special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
];

function validatePassword(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [specialization, setSpecialization] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [hospitalName, setHospitalName] = useState("");

  usePageTitle("Register | MediCare Connect");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters and include a number and a special character."
      );
      return;
    }

    if (role === "doctor") {
      if (!specialization) {
        setError("Please select your specialization.");
        return;
      }
      if (experience === "" || Number(experience) < 0) {
        setError("Please enter valid years of experience.");
        return;
      }
      if (!consultationFee || Number(consultationFee) < 1) {
        setError("Consultation fee must be greater than 0.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        callbackURL: "/dashboard",
      });

      if (signUpError) {
        setError(signUpError.message || "Registration failed. Please try again.");
        return;
      }

      let uploadedPhotoUrl = "";

      if (photoFile) {
        try {
          const uploadResult = await uploadImageFile(photoFile);
          uploadedPhotoUrl = uploadResult.url || "";

          if (uploadedPhotoUrl) {
            await updateMe({ photo: uploadedPhotoUrl });
            await authClient.updateUser({ image: uploadedPhotoUrl });
          }
        } catch (uploadErr) {
          console.error('Photo upload after registration failed:', uploadErr);
        }
      }

      if (role === "doctor") {
        const token = await getToken();

        if (!token) {
          setError("Account created but could not authenticate. Please sign in and complete your doctor profile.");
          return;
        }

        await createDoctorProfile({
          doctorName: name.trim(),
          specialization,
          qualifications: qualifications.trim(),
          experience: Number(experience),
          consultationFee: Number(consultationFee),
          hospitalName: hospitalName.trim(),
          profileImage: uploadedPhotoUrl,
        });

        toast.success(
          "Account created! Your doctor profile is pending admin verification."
        );
      } else {
        toast.success("Account created successfully!");
      }

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-[#111827] dark:shadow-none lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#5e17eb] via-[#6d28d9] to-[#4c1d95] p-10 text-white lg:flex">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="MediCare Connect" width={36} height={36} />
            <span className="text-xl font-bold">
              MediCare<span className="text-violet-200">Connect</span>
            </span>
          </Link>
          <h2 className="mt-10 text-3xl font-bold leading-tight">
            Join thousands of patients & doctors
          </h2>
          <p className="mt-4 text-violet-100/90 leading-relaxed">
            Create your free account to book appointments, manage health records,
            and get care from verified specialists.
          </p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <p className="text-sm font-medium text-violet-100">Why register?</p>
          <ul className="mt-4 space-y-3 text-sm text-violet-50">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-violet-200" />
              Instant doctor search & booking
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-violet-200" />
              Secure digital health records
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-violet-200" />
              24/7 access to your dashboard
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-center p-8 sm:p-10">
        <div className="mb-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="MediCare Connect" width={32} height={32} />
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              MediCare<span className="text-[#5e17eb]">Connect</span>
            </span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#5e17eb] hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              I am registering as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  role === "patient"
                    ? "border-[#5e17eb] bg-[#5e17eb]/10 text-[#5e17eb]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                <Heart size={18} />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  role === "doctor"
                    ? "border-[#5e17eb] bg-[#5e17eb]/10 text-[#5e17eb]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                <Stethoscope size={18} />
                Doctor
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-800 outline-none transition focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-800 outline-none transition focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>
          </div>

          <ImageUpload deferUpload onFileChange={setPhotoFile} />

          {role === "doctor" && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/30">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Professional details
              </p>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Qualifications
                </label>
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="MBBS, MD Cardiology"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="5"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Fee ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    placeholder="50"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hospital / Clinic name
                </label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="City General Hospital"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-slate-800 outline-none transition focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-[#5e17eb]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        passed ? "text-green-600 dark:text-green-400" : "text-slate-400"
                      }`}
                    >
                      <CheckCircle2 size={12} />
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-[#5e17eb] py-6 text-base font-semibold text-white shadow-lg shadow-[#5e17eb]/25 hover:bg-[#4a12bc]"
          >
            Create Account
            <ArrowRight size={18} className="ml-1" />
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            or continue with
          </span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}
