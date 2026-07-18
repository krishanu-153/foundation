import asyncHandler from "express-async-handler";
import Volunteer from "../models/Volunteer.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc    Apply as a volunteer
// @route   POST /api/volunteers
// @access  Public (or logged-in user)
export const applyVolunteer = asyncHandler(async (req, res) => {
  const { name, email, phone, address, age, occupation, skills, availability } = req.body;

  const existing = await Volunteer.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("You have already applied as a volunteer with this email");
  }

  const volunteer = await Volunteer.create({
    user: req.user?._id,
    name,
    email,
    phone,
    address,
    age,
    occupation,
    skills: Array.isArray(skills) ? skills : String(skills || "").split(",").map((s) => s.trim()),
    availability,
  });

  if (req.user) {
    req.user.volunteerStatus = "pending";
    await req.user.save();
  }

  res.status(201).json({
    success: true,
    volunteer,
    message: "Volunteer application submitted. We will review it shortly.",
  });
});

// ---------------- Admin ----------------

// @desc    Get all volunteers
// @route   GET /api/admin/volunteers
// @access  Private (admin)
export const adminGetVolunteers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const volunteers = await Volunteer.find(filter).populate("assignedEvents", "name date").sort({ createdAt: -1 });
  res.json({ success: true, count: volunteers.length, volunteers });
});

// @desc    Get single volunteer profile
// @route   GET /api/admin/volunteers/:id
// @access  Private (admin)
export const adminGetVolunteerById = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id).populate("assignedEvents");
  if (!volunteer) {
    res.status(404);
    throw new Error("Volunteer not found");
  }
  res.json({ success: true, volunteer });
});

// @desc    Update volunteer status (approve/reject/suspend)
// @route   PATCH /api/admin/volunteers/:id/status
// @access  Private (admin)
export const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) {
    res.status(404);
    throw new Error("Volunteer not found");
  }
  volunteer.status = status;
  if (adminNotes !== undefined) volunteer.adminNotes = adminNotes;
  await volunteer.save();

  if (volunteer.user) {
    await User.findByIdAndUpdate(volunteer.user, {
      volunteerStatus: status,
      isVolunteer: status === "approved",
    });
  }
  
  const dashboardUrl = `${process.env.CLIENT_URL}/login`;

  await sendEmail({
    to: volunteer.email,
    subject: `Volunteer Application ${status[0].toUpperCase() + status.slice(1)} - Sadhana Foundation`,
    html: `
      <p>Dear ${volunteer.name},</p>

      <p>Your volunteer application has been <strong>${status}</strong>.</p>

      <p>
        You can also log in to your account to view your latest volunteer status
        and future updates.
      </p>

      <p>
        <a href="${dashboardUrl}">
          Log in to Sadhana Foundation
        </a>
      </p>

      <p>Regards,<br>Sadhana Foundation Team</p>
    `,
    text: `
  Dear ${volunteer.name},

  Your volunteer application has been ${status}.

  Log in to your account to view your latest volunteer status:
  ${dashboardUrl}

  Regards,
  Sadhana Foundation Team
  `,
  });

  res.json({ success: true, volunteer });
});

// @desc    Assign volunteer to an event
// @route   PATCH /api/admin/volunteers/:id/assign
// @access  Private (admin)
export const assignVolunteerToEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) {
    res.status(404);
    throw new Error("Volunteer not found");
  }
  if (!volunteer.assignedEvents.includes(eventId)) {
    volunteer.assignedEvents.push(eventId);
    await volunteer.save();
  }
  res.json({ success: true, volunteer });
});
