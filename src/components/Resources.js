import React from "react";
import AddEvent from "./AddEvent";
import Venues from "./Venues";
import EventTicketTypes from "./EventTicketTypes";
import { connect, useSelector } from "react-redux";
import "../styles/resources.css";
import Login from "./Login";
import Error from "./Error";

export function Resources() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentUser = useSelector((state) => state.user.user);

  if (!isLoggedIn) return <Login />;
  if (currentUser.authorities.some((item) => item.authority === "ADMIN")) {
    return (
      <div className="resourcesContainer">
        <AddEvent token={currentUser.token} />
        <Venues token={currentUser.token} />
        <EventTicketTypes token={currentUser.token} />
      </div>
    );
  } else {
    return <Error code={403} message={"Vaaditaan ADMIN-rooli!"} />;
  }
}

export default connect()(Resources);
