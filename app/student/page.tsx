"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StudentAuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Connect to backend API
    console.log({ regNumber, password, name });

    // Temporary redirect
    router.push("/student/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center mb-6">
              <GraduationCap className="w-10 h-10 text-blue-500 mb-2" />
              <h2 className="text-2xl font-bold text-white">
                {isRegister ? "Student Registration" : "Student Login"}
              </h2>
              <p className="text-slate-400 text-sm mt-1 text-center">
                {isRegister
                  ? "Create your student account to access attendance dashboard"
                  : "Login with your registration number and password"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Faculty</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your faculty"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Department</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your department"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Level</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your level (e.g. 200)"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-slate-300">Registration Number</Label>
                <Input
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  required
                  placeholder="e.g. U20CS1234"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <Button type="submit" className="w-full py-6 rounded-2xl text-lg">
                {isRegister ? "Create Account" : "Login"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsRegister(false)}
                    className="text-blue-500 hover:underline"
                  >
                    Login here
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsRegister(true)}
                    className="text-blue-500 hover:underline"
                  >
                    Register here
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 text-center">
              <Link href="/">
                <span className="text-xs text-slate-500 hover:text-white transition cursor-pointer">
                  ← Back to Home
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
