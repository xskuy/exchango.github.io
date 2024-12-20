"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Manejar el error sin la variable
        return new Response("Invalid email or password", { status: 400 });
      } else {
        router.push("/main");
      }
    } catch (error) {
      console.error("Login error:", error);
      return new Response("An error occurred during login", { status: 500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Video a pantalla completa */}
      <video
        src="https://res.cloudinary.com/doe608i17/video/upload/v1/video/background"
        autoPlay
        loop
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Box de login */}
      <div className="w-[350px] p-8 bg-[#1c1c1c] rounded-[32px] relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Sign in to your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 bg-black/50 border-0 rounded-lg text-white placeholder-gray-400"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 bg-black/50 border-0 rounded-lg text-white placeholder-gray-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-sm">
            <Link href="/forgot-password" className="text-[#7C3AED] hover:text-[#6D28D9]">
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg text-white font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-400">Not a member? </span>
            <Link href="/signup" className="text-[#7C3AED] hover:text-[#6D28D9]">
              Start a 14 day free trial
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
