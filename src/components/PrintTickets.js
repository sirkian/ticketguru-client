import { useLocation } from "react-router-dom";
import { formatPrice, formatTime } from "../utils/utils";
import "../styles/print.css";

// Ei tarvinnukkaan propsina lähettää
const PrintTickets = () => {
  // UseLocation ottaa vastaan useNavigaten lähettämän tiedon
  const location = useLocation();

  return (
    <div className="printContainer">
      {location.state.map((ticket) => (
        <div className="ticketPrint" key={ticket.ticketId}>
          <p>{ticket.verificationCode}</p>
          <div className="ticketInfo">
            <p>{ticket.eventTicketType.event.eventName}</p>
            <p>{formatTime(ticket.eventTicketType.event.startTime)}</p>
            <p>
              {ticket.eventTicketType.ticketType.typeName}{" "}
              {formatPrice(ticket.eventTicketType.price)}
            </p>
          </div>

          <img alt="qr-code" src={`data:image/png;base64,${ticket.qrCode}`} />
        </div>
      ))}
    </div>
  );
};

export default PrintTickets;
