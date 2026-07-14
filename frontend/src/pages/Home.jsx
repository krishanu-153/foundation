import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Users, MapPin, CalendarCheck, IndianRupee, Star } from "lucide-react";
import api from "../services/api.js";
import CauseCard from "../components/CauseCard.jsx";
import EventCard from "../components/EventCard.jsx";
import { Spinner } from "../components/Ui.jsx";

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [causes, setCauses] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/settings"),
      api.get("/causes"),
      api.get("/events?upcoming=true"),
      api.get("/gallery"),
      api.get("/testimonials"),
    ])
      .then(([s, c, e, g, t]) => {
        setSettings(s.data.settings);
        setCauses(c.data.causes.slice(0, 4));
        setEvents(e.data.events.slice(0, 3));
        setGallery(g.data.images.slice(0, 8));
        setTestimonials(t.data.testimonials.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="min-h-[60vh]" />;

  const stats = [
    { icon: MapPin, label: "Villages Served", value: settings?.stats?.villagesServed },
    { icon: Users, label: "Volunteers", value: settings?.stats?.volunteers },
    { icon: Heart, label: "People Helped", value: settings?.stats?.peopleHelped },
    { icon: CalendarCheck, label: "Events Organized", value: settings?.stats?.eventsOrganized },
    { icon: IndianRupee, label: "Funds Raised", value: settings?.stats?.fundsRaised, prefix: "₹" },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: settings?.heroImage
            ? `url(${settings.heroImage})`
            : "linear-gradient(to right, #1e3a8a, #7c3aed)",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            {settings?.heroTitle}
          </h1>

          <p className="mt-6 text-xl text-gray-200">
            {settings?.heroSubtitle}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/donate"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full"
            >
              Donate Now
            </Link>

            <Link
              to="/volunteer"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <s.icon className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              <div className="text-2xl font-bold">
                {s.prefix || ""}
                {(s.value || 0).toLocaleString("en-IN")}+
              </div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Causes */}
      <section className="section">
        <h2 className="section-title">Our Causes</h2>
        <p className="section-subtitle">
          Explore the initiatives we're driving and support the ones close to your heart.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {causes.map((c) => (
            <CauseCard key={c._id} cause={c} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/causes" className="btn-outline">View All Causes</Link>
        </div>
      </section>

      {/* Events */}
      <section className="section bg-gray-50">
        <h2 className="section-title">Upcoming Events</h2>
        <p className="section-subtitle">Join us at our upcoming drives and community programs.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/events" className="btn-outline">View All Events</Link>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section">
        <h2 className="section-title">Gallery</h2>
        <p className="section-subtitle">A glimpse into our journey and impact.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((img) => (
            <div key={img._id} className="aspect-square rounded-xl overflow-hidden">
              <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/gallery" className="btn-outline">View Full Gallery</Link>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section bg-gray-50">
          <h2 className="section-title">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t._id} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                      {t.name[0]}
                    </div>
                  )}
                  <span className="font-medium text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
