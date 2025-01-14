import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const UpdateEventDetails = ({ event }) => {
 const navigate=useNavigate();
  const [updatedEvent, setUpdatedEvent] = useState({ ...event });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://eventmanagementbackend-production-a97f.up.railway.app/UpdateEvent", updatedEvent)
    .then((res) => {
      if (res.data.message === "Event updated") {
        alert(res.data.message);
        navigate("/");
      } else {
        alert(res.data.message);
        
      }
    })
    .catch((error) => {
      console.error("Error creating event:", error);
    });
  };

  return (
    <div className="card my-4 " id="update-details">
      <div className="card-body">
        <h3 className="card-title">Update Event Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={updatedEvent.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Event Description</label>
            <textarea
              className="form-control"
              name="description"
              value={updatedEvent.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Event Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={updatedEvent.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Event Category</label>
            <select
              id="categoryFilter"
              name="category"
              className="form-select"
              value={updatedEvent.category}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
            </select>
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-danger m-3">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventDetails;
