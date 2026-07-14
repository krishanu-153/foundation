import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { Spinner } from "../components/Ui.jsx";
import {
  HeartHandshake,
  ShieldCheck,
  HandHelping,
  BookOpen,
  Stethoscope,
  Users,
  Leaf,
  Baby,
} from "lucide-react";

export default function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings").then(({ data }) => setSettings(data.settings));
  }, []);

  if (!settings) return <Spinner className="min-h-[50vh]" />;

  const founder = {
    name: " ~ R. K. Sharma",
    image: "/founder.jpg",
  };

  const teamMembers = [
    {
      name: "Dipak Kumar Ghosh",
      role: "Founder & President",
      image: "/Team/member1.jpg",
    },
    {
      name: "Dr. Priya Sharma",
      role: "Medical Director",
      image: "/Team/member2.jpg",
    },
    {
      name: "Rajesh Kumar Sinha",
      role: "Program Director",
      image: "/Team/member3.jpg",
    },
    {
      name: "Meena Devi",
      role: "Education Coordinator",
      image: "/Team/member4.jpg",
    },
  ];

  const values = [
    {
      title: "Compassion",
      icon: HeartHandshake,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "Integrity",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Community Service",
      icon: HandHelping,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Education",
      icon: BookOpen,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      title: "Healthcare",
      icon: Stethoscope,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Equality",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Sustainability",
      icon: Leaf,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Child Welfare",
      icon: Baby,
      color: "text-pink-500",
      bg: "bg-pink-50",
    },
  ];

  return (
    <div>
        <section className="relative bg-gradient-to-r from-green-900 to-green-700 text-white py-28 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Sadhana Foundation
            </h1>

            <p className="text-xl md:text-1xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {settings.ngoIntro}
            </p>
          </div>
        </section>

        {/* our history  */}
        <section className="section max-w-5xl rounded-3xl mx-auto shadow-sm hover:shadow-xl transition hover:bg-orange-50 mt-10">

          <h2 className="text-4xl font-bold mb-8">
          Our History
          </h2>

          <p className="text-lg leading-9 text-gray-600">
          {settings.history}
          </p>

        </section>

        {/* founder's message */}
        <section className="section">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

              <img
                  src={founder.image}
                  className="rounded-3xl shadow-xl h-[400px] w-full object-cover rotate-[-2deg]"
              />

              <div>
                  <h2 className="text-4xl font-bold mb-6">
                      A Message from the Founder
                  </h2>

                  <p className="text-lg leading-9 text-gray-600">
                      {settings.founderMessage}
                  </p>

                  <h3 className="mt-8 text-primary-600 font-bold text-2xl">
                      {founder.name}
                  </h3>
              </div>

          </div>
      </section>

      {/* Team members  */}
      <div className="section bg-gray-50">
        <h2 className="section-title text-center mb-10">Our Core Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover object-top"
              />

              <div className="p-5 text-center">
                <h3 className="text-xl font-bold">{member.name}</h3>

                <p className="text-primary-600 font-semibold mt-1">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission and vision */}
      <div className="section bg-gray-50 grid md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-green-50 border border-green-100 shadow-sm hover:shadow-xl transition p-8">
          <h3 className="text-xl font-semibold mb-2 text-primary-700">Our Mission</h3>
          <p className="text-gray-600">{settings.mission}</p>
        </div>
        <div className="rounded-3xl bg-green-50 border border-green-100 shadow-sm hover:shadow-xl transition p-8">
          <h3 className="text-xl font-semibold mb-2 text-accent-600">Our Vision</h3>
          <p className="text-gray-600">{settings.vision}</p>
        </div>
      </div>

      {/* Our values  */}
      <div className="section bg-gray-50 rounded-3xl">
        <h2 className="section-title text-center mb-3">Our Core Values</h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          The principles that guide every initiative and inspire us to create a
          positive impact in the lives of those we serve.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 text-center border border-gray-100"
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${value.bg}`}
                >
                  <Icon className={`w-8 h-8 ${value.color}`} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">
                  {value.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
