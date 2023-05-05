import React from "react";
import TicketTypes from "./TicketTypes";
import AddEvent from "./AddEvent";
import Venues from "./Venues";
import EventTicketTypes from "./EventTicketTypes";
import { connect, useSelector } from "react-redux";
import "../styles/resources.css";
import Login from "./Login";

export function Resources() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentUser = useSelector((state) => state.user.user);

  if (!isLoggedIn) return <Login />;

  return (
    <div className="resourcesContainer">
      <AddEvent token={currentUser.token} />
      <Venues token={currentUser.token} />
      <TicketTypes token={currentUser.token} />
      <EventTicketTypes token={currentUser.token} />
    </div>
  );
}

export default connect()(Resources);
