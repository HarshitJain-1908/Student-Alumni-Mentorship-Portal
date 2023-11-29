import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  CardActions,
  IconButton,
  Grid,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TodayIcon from '@mui/icons-material/Today';
import ProfileDisplay from "./ProfileDisplay"; // Importing your ProfileDisplay component
import { useNavigate } from "react-router-dom";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import axios from "axios";
import Calendar from "react-calendar";

const UserCard = (props) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [slots, setSlots] = useState([]);

  const navigate = useNavigate();

  // const handleChat = () => {
  //   useReceiverIdContext(props.cardUser._id);
  //   navigate("/chat/welcome");
  // };

  // Destructure the nested location object
  const { city, state, country } = props.cardUser.location || {};

  const handleProfile = () => {
    setSelectedUser(props.cardUser); // Store the selected user data
    setOpenProfile(true); // Open the profile dialog
  };

  const showCalendar = () => {
    try {
      //fetch availability slots of this alumni from database
      const baseUrl = "http://localhost:4000/api/v1/fetchSlots/details";
      const userId = props.cardUser._id;
      const apiUrl = `${baseUrl}?userId=${userId}`;
      console.log(apiUrl);
      axios
      .get(apiUrl)
      .then((response) => {
        // console.log(response.data);
        if (response.status == 200) {
          console.log("Slots fetched successfully!");
          //display the slots in a 
          setSlots(response.data);
        } else {
          console.error('Failed to fetch slots details from the database:', response.status);
          const errorData = response.json();
          console.error('Error details:', errorData);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch slots details from the database:', error);
      });
    } catch (error) {
      console.error('Error details:', error);
    }
  }

  const cardStyle = {
    maxWidth: 300,
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    color: "#333",
  };

  const subheaderStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#555",
  };

  const contentStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#777",
  };

  return (
    <Card style={cardStyle}>
      <CardHeader

        avatar={<Avatar>{props.cardUser?.name.charAt(0)}</Avatar>}
        title={
          <Typography variant="h6" style={titleStyle}>
            {props.cardUser?.name}
          </Typography>
        }
        subheader={
          <Typography variant="body2" style={subheaderStyle}>
            {props.cardUser?.email}
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Current Work:</strong> {props.cardUser?.work.role}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Branch:</strong> {props.cardUser?.branch}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Batch:</strong> {props.cardUser?.batch}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Organization:</strong>{" "}
              {props.cardUser?.work.organization}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Location:</strong> {city}, {state}, {country}
            </Typography>
          </Grid>
        </Grid>

      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        <IconButton color="primary" aria-label="Chat">
          <ChatIcon />
        </IconButton>
        {/* Trigger ProfileDisplay dialog */}
        <IconButton
          color="primary"
          aria-label="Profile"
          onClick={handleProfile}>
          <AccountCircleIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="Calendar"
          onClick={showCalendar}>
          <TodayIcon />
        </IconButton>
      </CardActions>
      {slots.length > 0 && (
        <div style={{ margin: "20px auto", maxWidth: "300px" }}>
          <Typography variant="h6" style={{ textAlign: "center" }}>
            Available Slots
          </Typography>
          <Calendar
            value={new Date()} // You may want to manage the date value based on user selection
            tileContent={({ date }) => {
              const dateString = date.toISOString().split("T")[0];
              return slots.includes(dateString) ? (
                <p style={{ backgroundColor: "green" }}>Free</p>
              ) : null;
            }}
          />
        </div>
      )}
      {/* Display the profile dialog */}
      {selectedUser && (
        <ProfileDisplay
          open={openProfile}
          onClose={() => setOpenProfile(false)}
          userData={selectedUser}
        />
      )}
    </Card>
  );
};

export default UserCard;
