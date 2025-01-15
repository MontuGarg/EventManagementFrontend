import { none } from "@cloudinary/url-gen/qualifiers/progressive";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({user}) => {
  const navigate = useNavigate();

 const [events,setEvents]=useState({});

  // State for filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

useEffect(()=>{
  axios.get("https://eventmanagementbackend-production-a97f.up.railway.app/getEvents").then(res=>{
    
    setEvents(res.data.events);
  })
},[])

  // Filtered events based on user input
  const filteredEvents = (events.length>0? events.filter((event) => {
    const matchesCategory = categoryFilter === "" || event.category === categoryFilter;
    const matchesDate = dateFilter === "" || event.date === dateFilter;
    const today = new Date();
    const currentDate = new Date(today.setHours(0, 0, 0, 0));
    const eventDate = new Date(new Date(event.date).setHours(0, 0, 0, 0));
    const upcomingDate = eventDate >= currentDate;  
    return matchesCategory && matchesDate && upcomingDate;
  }):none);

  const PastEvents = (events.length>0? events.filter((event) => {
    const matchesCategory = categoryFilter === "" || event.category === categoryFilter;
    const matchesDate = dateFilter === "" || event.date === dateFilter;
    const today = new Date();
    const currentDate = new Date(today.setHours(0, 0, 0, 0));
    const eventDate = new Date(new Date(event.date).setHours(0, 0, 0, 0));
    const pastEvents = eventDate < currentDate;  
    return matchesCategory && matchesDate && pastEvents;
  }):none);

   // Truncate description to 50 characters
   const truncateDescription = (description) => {
    return description.length > 100
      ? `${description.slice(0, 100)}...`
      : description;
  };

  return (
    <div className="card-section">
      {/* Hero Section */}
      <header className="hero-section text-white text-center">
        <h1>Welcome to the Event Management Platform</h1>
        <p>Discover, Create, and Manage Events Seamlessly</p>
        <div className="text-center mb-4">
        {user.userType!=="guest" && <button
          className="btn btn-success"
          onClick={() => navigate("/create-event")}
        >
          Create New Event
        </button>}
      </div>
      </header>

      {/* Filters Section */}
      <section className="container my-4 ">
        <div className="row mb-3">
          {/* Category Filter */}
          <div className="col-md-6">
            <label htmlFor="categoryFilter" className="form-label">
              Filter by Category
            </label>
            <select
              id="categoryFilter"
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="col-md-6">
            <label htmlFor="dateFilter" className="form-label">
              Filter by Date
            </label>
            <input
              type="date"
              id="dateFilter"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Upcoming Events</h2>
        <div className="row">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="col-md-4">
                <div className="card event-card" id="update-details">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="card-img-top event-image"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{event.name}</h5>
                    <p className="card-text description">{truncateDescription(event.description)}</p>
                    <p className="card-text">
                      <strong>Date:</strong> {event.date}
                    </p>
                    <p className="card-text">
                      <strong>Category:</strong> {event.category}
                    </p>
                    <p>
                      <strong>Attendees Count:</strong> {event.attendees}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No events found for the selected filters.</p>
          )}
        </div>
      </section>
      <section className="container my-5">
        <h2 className="text-center mb-4">Past Events</h2>
        <div className="row">
          {PastEvents.length > 0 ? (
            PastEvents.map((event) => (
              <div key={event.id} className="col-md-4">
                <div className="card event-card" id="update-details">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="card-img-top event-image"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{event.name}</h5>
                    <p className="card-text description">{truncateDescription(event.description)}</p>
                    <p className="card-text">
                      <strong>Date:</strong> {event.date}
                    </p>
                    <p className="card-text">
                      <strong>Category:</strong> {event.category}
                    </p>
                    <p>
                      <strong>Attendees Count:</strong> {event.attendees}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No events found for the selected filters.</p>
          )}
        </div>
      </section>
      {/* Footer */}
      <footer className="footer-section text-white text-center py-3">
        <p>
          © 2025 Event Management Platform. All rights reserved. Built with
          React and Bootstrap.
        </p>
      </footer>
    </div>
  );
};

export default Home;
