"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { User, Mail, School } from "lucide-react";

export default function ProfilePage() {
  const [user] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    matric: "CSC/2021/001",
    faculty: "Science",
    department: "Computer Science",
    level: "300",
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 min-h-screen text-white rounded-lg">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-indigo-400"
      >
        My Profile
      </motion.h1>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 p-6 rounded-lg border border-white/10 shadow-md"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-400">{user.matric}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <ProfileItem icon={<Mail />} label="Email" value={user.email} />
          <ProfileItem icon={<User />} label="Level" value={user.level} />
          <ProfileItem icon={<School />} label="Faculty" value={user.faculty} />
          <ProfileItem
            icon={<School />}
            label="Department"
            value={user.department}
          />
        </div>
      </motion.div>

      {/* Edit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
      >
        Edit Profile
      </motion.button>
    </div>
  );
}

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-white/10 px-4 py-3 rounded">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
