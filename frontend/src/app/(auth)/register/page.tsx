"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/cn";

interface RegisterForm {
  companyName: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const PASSWORD_MIN_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const addToast = useUIStore((state) => state.addToast);

  const [formData, setFormData] = useState<RegisterForm>({
    companyName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  }

  function validateForm(): string | null {
    if (!formData.companyName.trim()) return "Company name is required";
    if (!formData.name.trim()) return "Your name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!EMAIL_REGEX.test(formData.email)) return "Please enter a valid email";
    if (!formData.password) return "Password is required";
    if (formData.password.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  }

  // Form submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate first
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      await register({
        companyName: formData.companyName,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      addToast({
        type: "success",
        title: "Account created!",
        description: "Welcome to NeuralDesk.",
      });

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  }

  function getPasswordStrength(): {
    strength: number;
    label: string;
    color: string;
  } {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { strength: 1, label: "Weak", color: "bg-danger" };
    if (score <= 3)
      return { strength: 2, label: "Medium", color: "bg-warning" };
    return { strength: 3, label: "Strong", color: "bg-success" };
  }

  const passwordStrength = getPasswordStrength();

  return (
    <main className="min-h-svh bg-background flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <span className="text-background text-xs font-bold">N</span>
            </div>
            <span className="font-medium tracking-tight">NeuralDesk</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl tracking-tighter mb-2">
              Create your <span className="font-display italic">account</span>.
            </h1>
            <p className="text-foreground-muted text-sm">
              Start your free trial — no credit card required.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-danger/10 border border-danger/20 rounded-md p-3 mb-6"
            >
              <p className="text-danger text-xs">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2"
              >
                Company name
              </label>
              <input
                id="companyName"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                className="input"
                autoComplete="organization"
              />
            </div>

            {/* Your Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2"
              >
                Your name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dawood Ahmed"
                className="input"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="input"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input"
                autoComplete="new-password"
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          passwordStrength.strength >= level
                            ? passwordStrength.color
                            : "bg-surface-3",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-foreground-subtle font-mono">
                    {passwordStrength.label}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-mono text-foreground-muted uppercase tracking-wider mb-2"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={cn(
                  "input",
                  formData.confirmPassword &&
                    formData.password === formData.confirmPassword &&
                    "border-success",
                )}
                autoComplete="new-password"
              />

              {/* Match Indicator */}
              {formData.confirmPassword && (
                <div className="flex items-center gap-1 mt-1">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-3 h-3 text-success" strokeWidth={2} />
                      <span className="text-xs text-success font-mono">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-foreground-subtle font-mono">
                      Passwords don't match yet
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-accent w-full mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-foreground-subtle text-center mt-4">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-accent hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-foreground-muted mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center border-l border-border overflow-hidden p-12">
        <div className="absolute inset-0 gradient-mesh" />

        <div className="relative z-10 max-w-md">
          {/* Eyebrow */}
          <div className="eyebrow mb-8">
            <span className="eyebrow-dot" />
            <span>What's included</span>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {[
              {
                title: "Multi-tenant",
                desc: "Isolated data per company. Secure by design.",
              },
              {
                title: "RAG-powered",
                desc: "AI learns from YOUR docs — not the internet.",
              },
              {
                title: "WhatsApp ready",
                desc: "Reply to customers on their favorite channel.",
              },
              {
                title: "Real-time",
                desc: "Instant responses with live typing indicators.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-accent-subtle border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="font-display text-2xl text-foreground-muted italic leading-snug">
              "Setup took <span className="text-accent">4 minutes</span>. Our
              support tickets dropped 60%."
            </p>
            <p className="text-xs text-foreground-subtle mt-3 font-mono uppercase tracking-wider">
              — Rahul K., CTO at TechFlow
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
