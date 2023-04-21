import React, { useState } from "react";
import { URL, authEncoded } from "../utils/constants";
import { formatPrice, formatTime } from "../utils/utils";

function CheckTickets() {
    const [vCode, setVCode] = useState("");
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState("");

    const handleFindTicket = async () => {
        const reqOptions = {
            method: "GET",
            headers: {
                Authorization: "Basic " + authEncoded,
            },
        };

        try {
            const response = await fetch(`${URL}/tickets/q?name=${vCode}`, reqOptions);

            if (response.status === 200) {
                const json = await response.json();
                if (json.usedDate !== null) {
                    setError("Lippu on jo käytetty! " + formatTime(json.usedDate));
                    setTicket(null);
                } else {
                    setTicket(json);
                    setError("");
                }
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUseTicket = async () => {
        const reqOptions = {
            method: "PATCH",
            headers: {
                Authorization: "Basic " + authEncoded,
            },
        };

        try {
            const response = await fetch(
                `${URL}/tickets/${ticket.ticketId}`,
                reqOptions
            );

            if (response.status === 200) {
                alert("Lippu käytetty!");
                setTicket(null);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
             <h3>TicketGuru: Lipun tarkastus</h3>
                <p>Lipun tarkastuskoodi:</p>
            <input type="text" placeholder="Tarkastuskoodi" onChange={(e) => setVCode(e.target.value)}/>
            <button onClick={handleFindTicket}>Tarkista</button>

            {ticket !== null && (
                <div className="ticket">
                    <p>ID: {ticket.ticketId}</p>
                    <p>QR-KOODI: {ticket.verificationCode}</p>
                    <p>TAPAHTUMA: {ticket.eventTicketType.event.eventName}</p>
                    <p>LIPPUTYYPPI: {ticket.eventTicketType.ticketType.typeName}</p>
                    <p>HINTA: {formatPrice(ticket.eventTicketType.price)} €</p>
                    <br/>
                    <button onClick={handleUseTicket}>Käytä lippu</button>

                </div>
            )}
            {error.length > 0 && <p>{error}</p>}
        </div>
    );
}

export default CheckTickets;