"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LecturerAuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Connect to backend API
    console.log({ email, password, name });

    // Temporary redirect
    router.push("/lecturer/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-indigo-600/20 p-3 rounded-full">
                <GraduationCap className="text-indigo-400 w-6 h-6" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white font-semibold">
              {isRegister ? "Lecturer Registration" : "Lecturer Login"}
            </CardTitle>
            <p className="text-gray-400 text-sm">
              {isRegister
                ? "Create your lecturer account"
                : "Access your lecturer dashboard"}
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Dr. John Doe"
                      className="pl-10 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="lecturer@university.edu"
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2">
                {isRegister ? "Register" : "Login"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-indigo-400 hover:underline"
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
