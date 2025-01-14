import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UpdateEventDetails from "./UpdateEventDetails"; // Import the new UpdateEventDetails component
import axios from "axios";
import io from "socket.io-client"; // Import socket.io-client

const EventDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false); // State to control when to show the update form
  const [attendeesCount, setAttendeesCount] = useState(0); // State for attendees count

  useEffect(() => {
    // Fetch event details
    axios
      .get(`https://eventmanagementbackend-production-a97f.up.railway.app/getEvent/${id}`)
      .then((res) => {
        console.log(res.data);
        setEvent(res.data.event[0]);
        setAttendeesCount(res.data.event[0].attendees); // Set initial attendees count
      })
      .catch((err) => {
        console.log(err);
      });

    // Connect to the WebSocket server
    const socket = io("https://eventmanagementbackend-production-a97f.up.railway.app"); // Replace with your WebSocket server URL

    // Listen for the 'attendeeJoined' event from the server to update the attendees count
    socket.on("attendeeJoined", () => {
      setAttendeesCount((prevCount) => prevCount + 1); // Increase the count when an attendee joins
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleUpdateClick = () => {
    setShowUpdateForm(true); // Show the update form when the button is clicked
  };

  const handleDeleteClick = () => {
    axios
      .delete(`https://eventmanagementbackend-production-a97f.up.railway.app/delete/${id}`)
      .then((res) => {
        alert(res.data.message);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!event.name) {
    return <h2 className="text-center mt-5">Event not found</h2>;
  }

  return (
    <div className="card-section details">
      <div className="container my-5 card-section">
        <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>
          Back to Home
        </button>
        {user.userType !== "guest" && (
          <button className="btn btn-danger mb-3 ml-3 delete" onClick={handleDeleteClick}>
            Delete Event
          </button>
        )}
        <div className="card" id="update-details">
          <img src={event.image} alt={event.name} className="card-img-top event-image1" />
          <div className="card-body">
            <h3 className="card-title">{event.name}</h3>
            <p className="card-text">{event.description}</p>
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Category:</strong> {event.category}
            </p>
            <p>
              <strong>Attendees Count:</strong> {attendeesCount}
            </p>
          </div>
        </div>
        {/* Show Update button only if user is not a guest */}
        {user.userType !== "guest" && !showUpdateForm && (
          <button className="btn btn-secondary mb-3 mt-3" onClick={handleUpdateClick}>
            Update details
          </button>
        )}

        {/* Conditionally render UpdateEventDetails component */}
        {showUpdateForm && <UpdateEventDetails event={event} />}
      </div>
    </div>
  );
};

export default EventDetails;