import { useEffect, useState } from "react";
import axios from "axios";

function MemberDashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchAssignedLeads();
  }, []);

  const fetchAssignedLeads = async () => {
    const updateStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/leads/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchAssignedLeads();
  } catch (error) {
    console.log(error);
  }
};
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/leads/member",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeads(res.data.leads);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Member Dashboard</h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Budget</th>
            <th>Message</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.budget}</td>
              <td>{lead.message}</td>
              <td>
  <select
    value={lead.status}
    onChange={(e) => updateStatus(lead._id, e.target.value)}
  >
    <option value="New">New</option>
    <option value="Contacted">Contacted</option>
    <option value="Closed">Closed</option>
  </select>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberDashboard;