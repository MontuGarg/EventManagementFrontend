import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UpdateEventDetails from "./UpdateEventDetails"; // Import the new UpdateEventDetails component
import axios from "axios";

const EventDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event,setEvent]=useState({});
  useEffect(()=>{
    axios.get(`https://eventmanagementbackend-production-a97f.up.railway.app/getEvent/${id}`).then(res=>{
      console.log(res.data);
      setEvent(res.data.event[0]);
    }).catch(err=>{
      console.log(err);
    })
  },[id])

  const [showUpdateForm, setShowUpdateForm] = useState(false); // State to control when to show the update form

  if (event.length===0) {
    return <h2 className="text-center mt-5">Event not found</h2>;
  }

  const handleUpdateClick = () => {
    setShowUpdateForm(true); // Show the update form when the button is clicked
  };
  const handleDeleteClick = () => {
    axios.delete(`https://eventmanagementbackend-production-a97f.up.railway.app/delete/${id}`).then(res=>{
      alert(res.data.message);
      navigate("/");

    }).catch(err=>{
      console.log(err);
    })
  };

  return (
    <div className="card-section details ">
    <div className="container my-5 card-section" >
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>
        Back to Home
      </button>
      {user.userType !== "guest" &&<button className="btn btn-danger mb-3 ml-3 delete" onClick={handleDeleteClick}>
        Delete Event
      </button>}
      <div className="card" id="update-details">
        <img
          src={event.image}
          alt={event.name}
          className="card-img-top event-image1"
        />
        <div className="card-body">
          <h3 className="card-title">{event.name}</h3>
          <p className="card-text">{event.description}</p>
          <p>
            <strong>Date:</strong> {event.date}
          </p>
          <p>
            <strong>Category:</strong> {event.category}
          </p>
        </div>
      </div>
      {/* Show Update button only if user is not a guest */}
      {user.userType !== "guest" && !showUpdateForm && (
        <button
          className="btn btn-secondary mb-3 mt-3"
          onClick={handleUpdateClick}
        >
          Update details
        </button>
      )}

      {/* Conditionally render UpdateEventDetails component */}
      {showUpdateForm && <UpdateEventDetails event={event} />}
    </div></div>
  );
};

export default EventDetails;

