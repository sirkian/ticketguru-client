import './App.css';
import React, { useEffect, useState } from "react";

const URL = "http://localhost:8080";


function App() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("Ladataan tapahtumia");

  useEffect(() => {
    fetchEvents();
  },
    []);

  const fetchEvents = async () => {
    const reqOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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

  const formatTime = (dateTime) => {
    const year = dateTime.substr(0, 4);
    const month = dateTime.substr(5, 2);
    const day = dateTime.substr(8, 2);
    const hrs = dateTime.substr(11, 2);
    const min = dateTime.substr(14, 2);
    return `${day}.${month}.${year} klo ${hrs}.${min}`;
  };


  return (
    <div className="App">
      <p>
        TicketGuru Ticket sales
      </p>

      <p>Hae tapahtuma</p>
      {events.map((eve) => {
        return (
          <div
            className="event"
            key={eve.eventId}
            onClick={(e) => fetchEvents(eve.eventId)}>
            {formatTime(eve.startTime)} <b>{eve.eventName}</b>
          </div>
        );
      })}

      <p>Valitse lippu</p>
      <p>Valitse määrä</p>
      <p>Maksa tapahtuma</p>
      <p>Merkitse myydyksi</p>
    </div>
  );
}

export default App;
