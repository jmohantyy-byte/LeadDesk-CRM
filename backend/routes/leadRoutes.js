import express from "express";
import Lead from "../models/Lead.js";
import { protect, adminOnly, memberOnly } from "../middleware/auth.js";

const router = express.Router();

// =========================
// Submit Lead (Public)
// =========================
router.post("/submit", async (req, res) => {
  try {
    const { name, email, budget, message } = req.body;

    const newLead = new Lead({
      name,
      email,
      budget,
      message,
      activity: [
        {
          action: "Lead Created",
          performedBy: null,
        },
      ],
    });

    await newLead.save();

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully!",
      lead: newLead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =========================
// Get All Leads
// Search + Filter + Pagination
// =========================
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 5,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status;
    }

    const totalLeads = await Lead.countDocuments(query);
    const newLeads = await Lead.countDocuments({
  ...query,
  status: "New",
});

const contactedLeads = await Lead.countDocuments({
  ...query,
  status: "Contacted",
});

const closedLeads = await Lead.countDocuments({
  ...query,
  status: "Closed",
});

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email")
      .populate("activity.performedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

   res.json({
  success: true,
  leads,
  currentPage: Number(page),
  totalPages: Math.ceil(totalLeads / Number(limit)),
  totalLeads,

  statistics: {
    total: totalLeads,
    new: newLeads,
    contacted: contactedLeads,
    closed: closedLeads,
  },
}); 
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =========================
// Get Assigned Leads
// =========================
router.get("/member", protect, memberOnly, async (req, res) => {
  try {
    const leads = await Lead.find({
      assignedTo: req.user.id,
    })
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email")
      .populate("activity.performedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =========================
// Update Lead Status
// =========================
router.put("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.status = req.body.status;

    lead.activity.push({
      action: `Status changed to ${req.body.status}`,
      performedBy: req.user.id,
    });

    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email")
      .populate("activity.performedBy", "name email");

    res.json(updatedLead);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
// =========================
// Assign Lead
// =========================
router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.assignedTo = assignedTo;

    lead.activity.push({
      action: "Lead Assigned",
      performedBy: req.user.id,
    });

    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email")
      .populate("activity.performedBy", "name email");

    res.json({
      success: true,
      message: "Lead assigned successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =========================
// Add Note
// =========================
router.post("/:id/note", protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Note is required",
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.notes.push({
      text,
      addedBy: req.user.id,
    });

    lead.activity.push({
      action: "Note Added",
      performedBy: req.user.id,
    });

    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email")
      .populate("activity.performedBy", "name email");

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;