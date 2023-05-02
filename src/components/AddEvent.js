import { useEffect, useState } from "react";
import { URL, authEncoded } from "../utils/constants";
import "../styles/resources.css";
import { formatTime } from "../utils/utils";

function AddEvent() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState([]);
  const [starttime, setStarttime] = useState("");
  const [endtime, setEndtime] = useState("");
  const [amountTickets, setAmountTickets] = useState("");
  const [presale_ends, setPresale_ends] = useState("");
  const [venue, setVenue] = useState("");
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchVenues();
  }, []);

  //Haetaan tapahtumat
  const fetchEvents = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
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

  const fetchVenues = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };

    //Haetaan tapahtumapaikat
    try {
      const response = await fetch(`${URL}/venues`, reqOptions);
      const json = await response.json();

      setVenues(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  //Lisää uuden tapahtuman
  const addEvent = async (e) => {
    e.preventDefault();
    try {
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authEncoded,
        },
        body: JSON.stringify({
          eventName: eventName,
          description: description,
          startTime: starttime,
          endTime: endtime,
          amountTickets: amountTickets,
          presaleEnds: presale_ends,
          cancelled: false,
          venue: {
            venueId: venue,
          },
        }),
      };

      const response = await fetch(`${URL}/events`, reqOptions);

      if (response.status === 400) {
        setError("Virheelliset tiedot!");
      }
      if (response.status === 201) {
        alert("Tapahtuma lisätty!");
        setEventName("");
        setDescription("");
        setStarttime("");
        setEndtime("");
        setPresale_ends("");
        setError("");
        fetchEvents();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="resourcesInnerContainer">
      <form onSubmit={addEvent}>
        <label htmlFor="event">Lisää tapahtuma:</label>
        <br />
        <input
          type="text"
          required
          placeholder="Tapahtuman nimi"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Kuvaus"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          required
          placeholder="Alkuaika"
          value={starttime}
          onChange={(e) => setStarttime(e.target.value)}
        />
        <input
          type="datetime-local"
          required
          placeholder="Loppuaika"
          value={endtime}
          onChange={(e) => setEndtime(e.target.value)}
        />
        <input
          type="number"
          required
          placeholder="Lippujen määrä"
          value={amountTickets}
          onChange={(e) => setAmountTickets(e.target.value)}
        />
        <input
          type="datetime-local"
          required
          placeholder="Lipunmyynti päättyy"
          value={presale_ends}
          onChange={(e) => setPresale_ends(e.target.value)}
        />
        <select value={venue} onChange={(e) => setVenue(e.target.value)}>
          <option value="">Valitse tapahtumapaikka</option>
          {venues.map((venue) => (
            <option key={venue.venueName} value={venue.venueId}>
              {venue.venueName}
            </option>
          ))}
        </select>
        <button type="submit">Lisää</button>
      </form>

      <p>
        <b>Tapahtumat:</b>
      </p>
      {events.map((ev) => {
        return (
          <div key={ev.eventId}>
            <span>
              {ev.eventName}, {ev.description}, {formatTime(ev.startTime)}
            </span>
          </div>
        );
      })}
      <div>{error.length > 0 && <p>{error}</p>}</div>
    </div>
  );
}

export default AddEvent;
