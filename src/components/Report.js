import React, { useEffect, useState } from "react";
import { URL, authEncoded } from "../utils/constants";

function Report () {

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


  const fetchReport = async (id) => {
    const reqOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + authEncoded,
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

    return (
        <>
        <p>Myyntiraportti</p>
        <p>Valitse tapahtuma</p>
        <p>lipputyyppi / kpl / yhteensä</p>

        {events.map((ev) => {
                return (
                    <div key={ev.eventId} onClick={() => fetchReport(ev.eventId)}>
                        <span>
                            {ev.eventName}, {ev.description}
                        </span>
                    </div>
                );
            })}
        </>
    )

}
export default Report;