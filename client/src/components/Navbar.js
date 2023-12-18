import React from "react";
import IconButton from "@mui/material/IconButton";

import { useNavigate } from "react-router-dom";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import { useConversationContext } from "../context/ConversationContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { conversation, setConversationValue } = useConversationContext();

  const { receiverId, setReceiverIdValue } = useReceiverIdContext();

  const handleBack = () => {
    // setConversationValue(null);
    if (receiverId && conversation?._id === null) {
      setConversationValue(null);
      setReceiverIdValue(null);
    } else {
      setReceiverIdValue(null);
    }
    navigate("/");
  };

  return (
    <div className="navbar">
      <IconButton variant="contained" onClick={handleBack}>
        Back
      </IconButton>
    </div>
  );
};

export default Navbar;
