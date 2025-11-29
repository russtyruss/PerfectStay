import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Award, Star } from "lucide-react";

export default function ProfilePoints() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [profile, setProfile] = useState({ pointsBalance: 0 });

  useEffect(() => {
    async function fetchPoints() {
      try {
        const res = await api.get(`/users/points/${user.id}`);
        setProfile({ pointsBalance: res.data });
      } catch (err) {
        console.error("Failed to load points", err);
      }
    }

    if (user) fetchPoints();
  }, [user]);

  return (
    <div>
      {/* Loyalty Rewards Banner */}
      <div className="mt-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center md:col-span-2">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold mb-1">Loyalty Rewards Program</h3>
              <p className="text-blue-100">You're earning points with every stay!</p>

              <div className="mt-2 flex items-center">
                <Star className="h-4 w-4 mr-1" />
                <Star className="h-4 w-4 mr-1" />
                <Star className="h-4 w-4 mr-1" />
                <Star className="h-4 w-4 mr-1" />
                <Star className="h-4 w-4" />
                <span className="ml-2 text-sm text-blue-100">Gold Member</span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-6xl font-bold mb-1">{profile.pointsBalance ?? 0}</p>
            <p className="text-blue-100 text-lg">Reward Points</p>
          </div>
        </div>
      </div>
    </div>
  );
}
