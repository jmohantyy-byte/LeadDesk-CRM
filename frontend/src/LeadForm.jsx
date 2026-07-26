import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";

function LeadForm() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/leads/submit",
        formData
      );

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        budget: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h2>LeadDesk</h2>
        <button
  type="button"
  onClick={() => navigate("/login")}
>
  Admin Login
</button>
      </nav>

      <section className="hero">
        <h1>Manage Your Leads Smarter</h1>
        <p>
          Capture leads, organize them, assign team members, and track their
          progress—all in one place.
        </p>
      </section>

      <section className="form-section">
        <h2>Get Started</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          >
            <option value="">Select Budget</option>
            <option value="10000-50000">₹10,000 - ₹50,000</option>
            <option value="50000-100000">₹50,000 - ₹1,00,000</option>
            <option value="100000+">₹1,00,000+</option>
          </select>

          <textarea
            rows="5"
            name="message"
            placeholder="Tell us about your requirements"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit">Submit Lead</button>
        </form>
      </section>
    </div>
  );
}

export default LeadForm;