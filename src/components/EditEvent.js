import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../utils/constants";
import "../styles/editEvent.css";

function EditEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const venues = location.state.venues;
  const token = location.state.token;
  const [event, setEvent] = useState(location.state.ev);
  const [venue, setVenue] = useState(event.venue.venueId);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const reqOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        eventName: event.eventName,
        description: event.description,
        startTime: event.startTime,
        endTime: event.endTime,
        amountTickets: event.amountTickets,
        presaleEnds: event.presaleEnds,
        cancelled: event.cancelled,
        venue: {
          venueId: venue,
        },
      }),
    };
    try {
      console.log(reqOptions.body);
      console.log(venue);
      const response = await fetch(
        `${URL}/events/${event.eventId}`,
        reqOptions
      );
      if (response.status === 200) navigate(-1);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="editEventContainer">
      <div className="editEventForm">
        <h1>Muokkaa tapahtumaa</h1>
        <div className="editEventInputs">
          <label>Tapahtuman nimi</label>
          <input
            type="text"
            name="eventName"
            value={event.eventName}
            onChange={(e) => handleChange(e)}
          />
          <label>Tapahtuman kuvaus</label>
          <input
            type="text"
            name="description"
            value={event.description}
            onChange={(e) => handleChange(e)}
          />
          <label>Tapahtuma alkaa</label>
          <input
            type="datetime-local"
            name="startTime"
            value={event.startTime}
            onChange={(e) => handleChange(e)}
          />
          <label>Tapahtuma päättyy</label>
          <input
            type="datetime-local"
            name="endTime"
            value={event.endTime}
            onChange={(e) => handleChange(e)}
          />
          <label>Lippujen määrä</label>
          <input
            type="number"
            name="amountTickets"
            value={event.amountTickets}
            onChange={(e) => handleChange(e)}
          />
          <label>Ennakkolippujen myynti päättyy</label>
          <input
            type="datetime-local"
            name="presaleEnds"
            value={event.presaleEnds}
            onChange={(e) => handleChange(e)}
          />
          <label>Tapahtumapaikka</label>
          <select value={venue} onChange={(e) => setVenue(e.target.value)}>
            {venues.map((venue) => (
              <option key={venue.venueName} value={venue.venueId}>
                {venue.venueName}
              </option>
            ))}
          </select>
          {event.cancelled ? (
            <button onClick={() => setEvent({ ...event, cancelled: false })}>
              Palauta tapahtuma
            </button>
          ) : (
            <button onClick={() => setEvent({ ...event, cancelled: true })}>
              Peruuta tapahtuma
            </button>
          )}
        </div>

        <div className="editEventFormBtns">
          <button onClick={() => navigate(-1)}>Palaa takaisin</button>
          <button onClick={handleUpdate}>Tallenna muutokset</button>
        </div>
      </div>
    </div>
  );
}

export default EditEvent;
