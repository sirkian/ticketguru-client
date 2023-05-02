import React, { useState } from "react";
import TicketTypes from "./TicketTypes";
import PostalCodes from "./PostalCodes";
import AddEvent from "./AddEvent";
import Venues from "./Venues";
import EventTicketTypes from "./EventTicketTypes";
import { connect, useSelector } from "react-redux";
import "../styles/resources.css";
import Login from "./Login";

export function Resources() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  if (!isLoggedIn) return <Login />;

  return (
    <div className="resourcesContainer">
      <AddEvent />
      <TicketTypes />
      <Venues />
      <EventTicketTypes />
    </div>
  );
}

export default connect()(Resources);
