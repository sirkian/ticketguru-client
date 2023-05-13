import React, { useEffect, useState } from "react";
import { URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import "../styles/resources.css";
import TicketTypes from "./TicketTypes";
import "../styles/showETT.css";

function EventTicketTypes({ token }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [event, setEvent] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [price, setPrice] = useState(0);
  const [eventTicketTypes, setEventTicketTypes] = useState([]);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchTicketTypes();
    // eslint-disable-next-line
  }, []);

  // tapahtumien haku (valikkoon)
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

  // lipputyyppien haku (valikkoon)
  const fetchTicketTypes = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    try {
      const response = await fetch(`${URL}/tickettypes`, reqOptions);
      const json = await response.json();

      setTicketTypes(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // tapahtuman lipputyyppien haku
  const fetchEventTicketTypes = async (e) => {
    e.preventDefault();

    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    try {
      const response = await fetch(
        `${URL}/events/${event}/eventtickettypes`,
        reqOptions
      );
      const json = await response.json();

      setEventTicketTypes(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditTicketTypes = (evtt) => {
    navigate("/editETT", { state: { token, evtt } });
  };

  // lipputyyppien ja hintojen asettaminen tapahtumalle
  const addTicketTypes = async (e) => {
    e.preventDefault();

    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        event: { eventId: event },
        ticketType: { typeId: ticketType },
        price: price,
      }),
    };

    try {
      const response = await fetch(`${URL}/eventtickettypes`, reqOptions);
      const json = await response.json();

      setEventTicketTypes(json);
      setError("");
      //fetchEventTicketTypes();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="resourcesInnerContainer">
      <h2 onClick={() => setIsVisible(!isVisible)}>Tapahtuman lipputyypit</h2>
      {isVisible && (
        <div className="addETT">
          <form className="addETTForm" onSubmit={fetchEventTicketTypes}>
            <label>Tapahtuma</label>
            <select value={event} onChange={(e) => setEvent(e.target.value)}>
              <option value="">Valitse tapahtuma</option>
              {events.map((ev) => (
                <option key={ev.eventId} value={ev.eventId}>
                  {ev.eventName}
                </option>
              ))}
            </select>
            <button type="submit">Hae tiedot</button>
          </form>

          <div className="showETTsContainer">
            {eventTicketTypes.length > 0 && (
              <div>
                <p>
                  <b>Tapahtuman lipputyypit:</b>
                </p>
                {eventTicketTypes.map((evtt) => {
                  return (
                    <div className="showETTs" key={evtt.eventTypeId}>
                      <div className="showETT">
                        <span>{evtt.ticketType.typeName}</span>
                        <span>{evtt.price} {"€"}</span>
                      </div>
                      <div>
                        <button onClick={() => handleEditTicketTypes(evtt)}>Muokkaa</button>
                      </div>
                    </div>
                  );
                })}
                <div>{error.length > 0 && <p>{error}</p>}</div>
              </div>
            )}
          </div>

          <h3>Lisää tapahtumalle uusi lipputyyppi:</h3>
          <form className="addETTForm" onSubmit={addTicketTypes}>
            <label>Lipputyyppi</label>
            <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
              <option value="">Valitse lipputyyppi</option>
              {ticketTypes.map((tt) => (
                <option key={tt.typeId} value={tt.typeId}>
                  {tt.typeName}
                </option>
              ))}
            </select>
            <label>Hinta</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="1.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button type="submit">Lisää tapahtumalle lipputyyppi</button>
          </form>

          <div>
            < br />
            <TicketTypes token={token} />
          </div>
        </div>
      )}
    </div>
  );
}

export default EventTicketTypes;
