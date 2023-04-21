import React, {useState} from "react";
import { formatPrice, formatTime } from "../utils/utils";
import { URL, authEncoded } from "../utils/constants";

function CheckTickets() {
    const [verifCode, setVerifCode] = useState("");
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState("");


    const fetchTicket = async () => {
        const reqOptions = {
            method: "GET",
            headers: {
               // Onko näille tarvetta -> "Content-Type": "application/json",
                Authorization: "Basic " + authEncoded,
            },
        };

        try {
            const response = await fetch(`${URL}/tickets/q?name=${verifCode}`, reqOptions);

            if (response.status === 200) {
                const json = await response.json();

                if (json.usedDate !== null) {
                    setError("Lippu on jo käytetty! " + formatTime(json.usedDate));
                } else {
                    setTicket(json);
                    console.log(ticket);
                    setError("");
                }
            }
        } catch (error) {
            setError(error.message);
            console.log(error.message);
        }
    };

    const useTicket = async () => {
        const reqOptions = {
            method: "PATCH",
            headers: {
                // Onko näille tarvetta -> "Content-Type": "application/json",
                Authorization: "Basic " + authEncoded,
            },
        };

        try {
            const response = await fetch(`${URL}/tickets/${ticket.ticketId}`, reqOptions);

            if (response.status === 200) {
                alert("Lippu käytetty");
                setTicket(null);
            }
        } catch (error) {
            setError(error.message);
        }
    };


    return(
    <div className="eventContainer">
        <div className="innerContainer">
            <h3>TicketGuru lipun tarkastus</h3>

            <p>Lipun tarkastuskoodi:</p>
            <input type="text" placeholder="syötä koodi" onChange={(e) => setVerifCode(e.target.value)}/>
            <button onClick={fetchTicket}>Tarkista</button>

            {ticket !== null && (
                    <div>
                        <p><b>Lippu:</b></p>
                        <p>ID: {ticket.ticketId}</p>
                        <p>QR-KOODI: {ticket.verificationCode}</p>
                        <p>TAPAHTUMA: {ticket.eventTicketType.event.eventName}</p>
                        <p>LIPPUTYYPPI: {ticket.eventTicketType.ticketType.typeName}</p>
                        <p>HINTA: {formatPrice(ticket.eventTicketType.price)}</p>

                        <button onClick={useTicket}>Käytä lippu</button>
                        <button onClick={setTicket(null)}>Peruuta</button>
                    </div>                
            )}            
        </div>
        {error.length > 0 && <p>{error}</p>}
    </div>
    );

}

export default CheckTickets;
