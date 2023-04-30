import React, { useEffect,useState } from "react";
import { URL, authEncoded } from "../utils/constants";



function EventTicketTypes() {

    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [ticketTypes, setTicketTypes] = useState([]);
    const [event, setEvent] = useState("");
    const [ticketType, setTicketType] = useState("");
    const [price, setPrice] = useState(0);
    const [eventTicketTypes, setEventTicketTypes] = useState([]);


    useEffect(() => {
        fetchEvents();
        fetchTicketTypes();
    }, []);

    // tapahtmien haku (valikkoon)
  
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

    // lipputyyppien haku (valikkoon)

    const fetchTicketTypes = async () => {
        const reqOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + authEncoded,
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
    const fetchEventTicketTypes = async () => {
        const reqOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + authEncoded,
            },
        };
  
    try {
        const response = await fetch(`${URL}/events/${event}/eventtickettypes`, reqOptions);
        const json = await response.json();

        setEventTicketTypes(json);
        setError("");

    } catch (error) {
        setError(error.message);
    }

}


    // lipputyyppien ja hintojen asettaminen tapahtumalle
    const addTicketTypes = async (e) => {
        e.preventDefault();
        console.log(event);
        console.log(ticketType);
        console.log(price);
        
        console.log("lipputyypit");
        
        const reqOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + authEncoded,
            },
            body: JSON.stringify({
                event: {eventId : event},
                ticketType: {typeId : ticketType},
                price: price
            })
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
        
    return(
        <>
        <p><b>Tapahtuman lipputyypit</b></p>
           
            <form onSubmit={addTicketTypes}>
                <select value={event} onChange={(e) => setEvent(e.target.value)}>
                    <option value="">Valitse tapahtuma</option>
                        {events.map((ev) => (   
                            <option key={ev.eventId} value={ev.eventId}>
                                {ev.eventName}
                            </option>
                        ))}
                </select>
                <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
                    <option value="">Valitse lipputyyppi</option>
                        {ticketTypes.map((tt) => (   
                            <option key={tt.typeId} value={tt.typeId}>
                                {tt.typeName}
                            </option>
                        ))}
                </select>
                <input type="number" min="0" step="0.01" placeholder="1.00" value={price} onChange={(e) => setPrice(e.target.value)}></input>€
                <button type="submit">Lisää</button>
            </form>
          
                        
        </>
    )

}

export default EventTicketTypes;