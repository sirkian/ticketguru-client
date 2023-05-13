import { useEffect, useState } from "react";
import { URL } from "../utils/constants";
import "../styles/resources.css";
import { formatTime } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import "../styles/addEvent.css";
import { validateEvent } from "../utils/Validate";

function AddEvent({ token }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState([]);
  const [startTime, setStarttime] = useState("");
  const [endTime, setEndtime] = useState("");
  const [amountTickets, setAmountTickets] = useState("");
  const [presaleEnds, setPresale_ends] = useState("");
  const [venue, setVenue] = useState("");
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchVenues();
    // eslint-disable-next-line
  }, []);

  //Haetaan tapahtumat
  const fetchEvents = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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

  //Haetaan tapahtumapaikat
  const fetchVenues = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

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
    // Validoidaan kentät kutsumalla Validate.js filun validateEventtiä
    // Jos validointi ok, palauttaa {true, ""}, jos ei ok palauttaa {false, "errorviesti"}
    const { valid, message } = validateEvent({
      eventName,
      description,
      startTime,
      endTime,
      amountTickets,
      presaleEnds,
    });
    if (!valid) {
      return setError(message);
    }

    try {
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          eventName: eventName,
          description: description,
          startTime: startTime,
          endTime: endTime,
          amountTickets: amountTickets,
          presaleEnds: presaleEnds,
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

  const handleEditEvent = (ev) => {
    navigate("/editevent", { state: { ev, venues, token } });
  };

  return (
    <div className="resourcesInnerContainer">
      <h2 onClick={() => setIsVisible(!isVisible)}>Tapahtumat</h2>
      {isVisible && (
        <div className="addEvent">
          <form className="addEventForm" onSubmit={addEvent}>
            <label>Tapahtuman nimi</label>
            <input
              type="text"
              required
              placeholder="Tapahtuman nimi"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <label>Tapahtuman kuvaus</label>
            <input
              type="text"
              required
              placeholder="Kuvaus"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label>Tapahtuma alkaa</label>
            <input
              type="datetime-local"
              required
              placeholder="Alkuaika"
              value={startTime}
              onChange={(e) => setStarttime(e.target.value)}
            />
            <label>Tapahtuma päättyy</label>
            <input
              type="datetime-local"
              required
              placeholder="Loppuaika"
              value={endTime}
              onChange={(e) => setEndtime(e.target.value)}
            />
            <label>Lippujen määrä</label>
            <input
              type="number"
              required
              placeholder="Lippujen määrä"
              value={amountTickets}
              onChange={(e) => setAmountTickets(e.target.value)}
            />
            <label>Ennakkolippujen myynti päättyy</label>
            <input
              type="datetime-local"
              required
              placeholder="Lipunmyynti päättyy"
              value={presaleEnds}
              onChange={(e) => setPresale_ends(e.target.value)}
            />
            <label>Tapahtumapaikka</label>
            <select value={venue} onChange={(e) => setVenue(e.target.value)}>
              <option value="">Valitse tapahtumapaikka</option>
              {venues.map((venue) => (
                <option key={venue.venueName} value={venue.venueId}>
                  {venue.venueName}
                </option>
              ))}
            </select>
            <button type="submit">Lisää</button>
            <div>{error.length > 0 && <p>{error}</p>}</div>
          </form>

          <div className="showEventsContainer">
            <p>
              <b>Tapahtumat:</b>
            </p>
            {events.map((ev) => {
              return (
                <div className="showEvents" key={ev.eventId}>
                  <div className={ev.cancelled ? "cancelled" : "showEvent"}>
                    <span>{ev.eventName}</span>
                    <span>{ev.description}</span>
                    <span>
                      {formatTime(ev.startTime)} - {formatTime(ev.endTime)}
                    </span>
                    <span>
                      {ev.venue.venueName} {ev.venue.address},{" "}
                      {ev.venue.postalCode.city}{" "}
                    </span>
                    <span>
                      Ennakkomyynti päättyy {formatTime(ev.presaleEnds)}
                    </span>
                  </div>
                  <div>
                    <button onClick={() => handleEditEvent(ev)}>Muokkaa</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddEvent;
