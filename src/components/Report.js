import React, { useEffect, useState } from "react";
import { URL } from "../utils/constants";
import { connect, useSelector } from "react-redux";
import Login from "./Login";

export function Report() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentUser = useSelector((state) => state.user.user);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [event, setEvent] = useState("");
  const [report, setReport] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  //Haetaan tapahtumat
  const fetchEvents = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
      },
    };

    try {
      const response = await fetch(`${URL}/events`, reqOptions);
      const json = await response.json();

      setEvents(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchReport = async (id) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
      },
    };
    try {
      const response = await fetch(`${URL}/events/${id}/report`, reqOptions);
      const json = await response.json();

      setReport(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  console.log(report);
  if (!isLoggedIn) return <Login />;
  return (
    <>
      <p>Myyntiraportti</p>
      <p>Valitse tapahtuma, ei vielä toteutettu</p>
      

      {events.map((ev) => {
        return (
          <div key={ev.eventId} >
            <span>
              {ev.eventName}, {ev.description}, {" "}
              <button onClick={() => fetchReport(ev.eventId)}>hae raportti</button>
            </span>
          </div>
        );
      })}

     {report.map((rep) => {
        return(
            <div key={rep.eventTicketType}>
                <span>
                    {rep.event} {" "} {rep.eventTicketType} {" "} {rep.total}
                </span>
            </div>
        )
        
     })}

    </>
  );
}
export default connect()(Report);
