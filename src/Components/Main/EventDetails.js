import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UpdateEventDetails from "./UpdateEventDetails";
import axios from "axios";
import io from "socket.io-client";
import { background } from "@cloudinary/url-gen/qualifiers/focusOn";
import { color } from "@cloudinary/url-gen/qualifiers/background";
import { BackgroundColor } from "@cloudinary/url-gen/actions/background/actions/BackgroundColor";

const EventDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [attendees,setAttendees]=useState(0);
  useEffect(() => {
    // Fetch event details
    axios
      .get(`https://eventmanagementbackend-production-a97f.up.railway.app/getEvent/${id}`)
      .then((res) => {
        setEvent(res.data.event[0]);
        setAttendees(res.data.event[0].attendees);
      })
      .catch((err) => {
        console.error(err);
      });

    // Connect to WebSocket server
    const socket = io("https://eventmanagementbackend-production-a97f.up.railway.app");

    // Emit 'visitEvent' event when the user visits the page
    
    if (user.id) {
      socket.emit("visitEvent", { userId: user.id, eventId: id });
    }

    

    // Listen for 'eventUpdated' to update the event details
    socket.on("eventUpdated", (updatedEvent) => {
      if (updatedEvent.attendees) {  
         setTimeout(()=>{
          setAttendees(updatedEvent.attendees);
         },1000)
      }
    });

    // Listen for 'error' events from the server
    socket.on("error", (error) => {
      console.error("Error received:", error);
    });

    // Cleanup the socket connection and listeners on unmount
    return () => {
      socket.off("eventUpdated");
      socket.off("error");
      socket.disconnect();
    };
  }, [id,user.id]);


  const handleUpdateClick = () => {
    setShowUpdateForm(true);
  };

  const handleDeleteClick = () => {
    axios
      .delete(`https://eventmanagementbackend-production-a97f.up.railway.app/delete/${id}`)
      .then((res) => {
        alert(res.data.message);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!event.name) {
    return <div className="loading"><h2 className="text-center mt-5 ">Please wait...</h2></div>;
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
              <strong>Attendees Count:</strong> {attendees}
            </p>
          </div>
        </div>
        {user.userType !== "guest" && !showUpdateForm && (
          <button className="btn btn-secondary mb-3 mt-3" onClick={handleUpdateClick}>
            Update details
          </button>
        )}
        {showUpdateForm && <UpdateEventDetails event={event} />}
      </div>
    </div>
  );
};

export default EventDetails;
