import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [leads, setLeads] = useState([]);
  const [members, setMembers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [noteInputs, setNoteInputs] = useState({});
  const [statistics, setStatistics] = useState({
  total: 0,
  new: 0,
  contacted: 0,
  closed: 0,
});

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        "https://YOUR-RENDER-URL.onrender.com/api/leads",
        {
          params: {
            search,
            status: statusFilter,
            page,
            limit: 5,
          },
        }
      );

      setLeads(res.data.leads);
setTotalPages(res.data.totalPages);
setStatistics(res.data.statistics);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        "https://YOUR-RENDER-URL.onrender.com/api/users/members",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(res.data.members);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://YOUR-RENDER-URL.onrender.com/api/leads/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLeads();
      toast.success("Status updated successfully!");
    } catch (err) {
      toast.error("Failed to update status.");
      console.log(err);
    }
  };

  const assignLead = async (leadId, memberId) => {
    try {
      await axios.put(
        `https://YOUR-RENDER-URL.onrender.com/api/leads/${leadId}/assign`,
        {
          assignedTo: memberId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLeads();
      toast.success("Lead assigned successfully!");
    } catch (err) {
      toast.error("Failed to assign lead.");
      console.log(err);
    }
  };

  const addNote = async (leadId) => {
    try {
      const text = noteInputs[leadId];

      if (!text || text.trim() === "") {
        toast.warning("Please enter a note.");
        return;
      }

      await axios.post(
        `https://YOUR-RENDER-URL.onrender.com/api/leads/${leadId}/note`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNoteInputs({
        ...noteInputs,
        [leadId]: "",
      });

      fetchLeads();
      toast.success("Note added successfully!");
    } catch (err) {
      toast.error("Failed to add note.");
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  

  return (
    <div className="min-h-screen bg-gray-100">
            {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              LeadDesk CRM
            </h1>
            <p className="text-gray-500 mt-1">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Total Leads</h2>
            <p className="text-3xl font-bold mt-2">
              {statistics.total}
            </p>
          </div>

          <div className="bg-blue-500 text-white rounded-xl shadow p-6">
            <h2>New</h2>
            <p className="text-3xl font-bold mt-2">
              {statistics.new}
            </p>
          </div>

          <div className="bg-yellow-500 text-white rounded-xl shadow p-6">
            <h2>Contacted</h2>
            <p className="text-3xl font-bold mt-2">
              {statistics.contacted}
            </p>
          </div>

          <div className="bg-green-500 text-white rounded-xl shadow p-6">
            <h2>Closed</h2>
            <p className="text-3xl font-bold mt-2">
             {statistics.closed}
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Search by Name or Email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded-lg px-4 py-3"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>

          </div>

        </div>

        {/* Leads */}
        <div className="space-y-6">

          {leads.map((lead) => (

            <div
              key={lead._id}
              className="bg-white rounded-xl shadow-lg p-6"
            >

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <div className="flex items-start gap-4">

  <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
    {lead.name.charAt(0).toUpperCase()}
  </div>

  <div className="flex-1">

    <h2 className="text-2xl font-bold text-gray-800">
      {lead.name}
    </h2>

    <p className="text-gray-500">
      📧 {lead.email}
    </p>

    <div className="mt-5 flex flex-wrap gap-3">

      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
        💰 {lead.budget}
      </span>

      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
        📅 {new Date(lead.createdAt).toLocaleDateString()}
      </span>

    </div>

    <div className="mt-5 bg-gray-50 rounded-lg p-4">

      <p className="text-sm font-semibold text-gray-500">
        Message
      </p>

      <p className="text-gray-700 mt-1">
        {lead.message}
      </p>

    </div>

  </div>

</div>

                  

                </div>

                <div className="space-y-4">

                  <div>

                    <label className="font-semibold block mb-2">
                      Status
                    </label>

                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateStatus(
                          lead._id,
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">
                        Contacted
                      </option>
                      <option value="Closed">
                        Closed
                      </option>
                    </select>

                  </div>

                  <div>

                    <label className="font-semibold block mb-2">
                      Assign Member
                    </label>

                    <select
                      value={lead.assignedTo?._id || ""}
                      onChange={(e) =>
                        assignLead(
                          lead._id,
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">
                        Select Member
                      </option>

                      {members.map((member) => (
                        <option
                          key={member._id}
                          value={member._id}
                        >
                          {member.name} ({member.email})
                        </option>
                      ))}

                    </select>

                  </div>
                                    <div>

                    <label className="font-semibold block mb-2">
                      Notes
                    </label>

                    <textarea
                      rows="3"
                      placeholder="Write a note..."
                      value={noteInputs[lead._id] || ""}
                      onChange={(e) =>
                        setNoteInputs({
                          ...noteInputs,
                          [lead._id]: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-3 resize-none"
                    />

                    <button
                      onClick={() => addNote(lead._id)}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Add Note
                    </button>

                    <div className="mt-5 space-y-3 max-h-56 overflow-y-auto">

                      {lead.notes &&
                        lead.notes.map((note) => (

                          <div
                            key={note._id}
                            className="bg-gray-100 rounded-lg p-3"
                          >

                            <p className="font-semibold text-sm text-blue-700">
                              {note.addedBy?.name}
                            </p>

                            <p className="text-gray-700 mt-1">
                              {note.text}
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(
                                note.createdAt
                              ).toLocaleString()}
                            </p>

                          </div>

                        ))}

                    </div>
                    {/* Activity Timeline */}

<div className="mt-6">
  <h3 className="font-semibold text-gray-700 mb-3">
    📜 Activity Timeline
  </h3>

  <div className="space-y-3 max-h-56 overflow-y-auto">

    {lead.activity &&
      lead.activity
        .slice()
        .reverse()
        .map((activity) => (

          <div
            key={activity._id}
            className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3"
          >
            <p className="font-semibold">
              {activity.action}
            </p>

            <p className="text-sm text-gray-600">
              By: {activity.performedBy?.name || "System"}
            </p>

            <p className="text-xs text-gray-500">
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>

        ))}

  </div>
</div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Pagination */}

        <div className="flex justify-center items-center gap-5 mt-10">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;