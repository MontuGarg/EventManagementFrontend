import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    name: "",
    description: "",
    date: "",
    category: "",
    image: "",
  });
  const [file, setFile] = useState(null);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    // Check if the selected file is of the correct type (jpeg, jpg, png)
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/jpg" ||
        selectedFile.type === "image/png")
    ) {
      setFile(selectedFile);
    } else {
      alert("Please select a valid image file (jpeg, jpg, png).");
      e.target.value = ""; // Clear the input
    }
  };

  // Upload image to Cloudinary and handle event creation in the callback
  const uploadImageToCloudinary = async (file, callback) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "EventImage"); // Set your Cloudinary upload preset here

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/daeduuf4u/image/upload`, // Cloudinary upload URL
        formData
      );
      console.log("Image uploaded successfully:", response.data);
      const imageUrl = response.data.secure_url;

      // Call the callback function with the updated event data
      callback({ ...event, image: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      // Upload the image and handle event creation in the callback
      uploadImageToCloudinary(file, (updatedEvent) => {
        axios
          .post("https://eventmanagementbackend-production-a97f.up.railway.app/createEvent", updatedEvent)
          .then((res) => {
            if (res.data.message === "Event added") {
              navigate("/");
              alert(res.data.message);
            } else {
              alert(res.data.message);
            }
          })
          .catch((error) => {
            console.error("Error creating event:", error);
          });
      });
    } else {
      console.error("No image selected!");
    }
  };

  return (
    <div className="card-section details ">
    <div className="container my-5">
    <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>
        Back to Home
      </button>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Event Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={event.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Event Description</label>
          <textarea
            className="form-control"
            name="description"
            value={event.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Event Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={event.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Event Category</label>
            <select
              id="categoryFilter"
              name="category"
              className="form-select"
              value={event.category}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
            </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Event Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/jpeg, image/jpg, image/png" // Restrict file types
            onChange={handleImageChange}
            required
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Create Event
          </button>
        </div>
      </form>
      {event.image && (
        <div className="mt-3">
          <h5>Uploaded Image:</h5>
          <img
            src={event.image}
            alt="Event"
            className="img-fluid"
            style={{ maxWidth: "500px" }}
          />
        </div>
      )}
    </div></div>
  );
};

export default CreateEvent;
