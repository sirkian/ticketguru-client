import { useLocation } from "react-router-dom";
import { formatPrice, formatTime } from "../utils/utils";

// Ei tarvinnukkaan propsina lähettää
const PrintTickets = () => {
  // UseLocation ottaa vastaan useNavigaten lähettämän tiedon
  const location = useLocation();

  // location.state on se objektitaulukko, jossa liput
  console.log(location.state);

  return (
    <>
        <h2>Liput</h2>
      {location.state.map((ticket) => (
        <div key={ticket.ticketId}>
          <p><b>ID</b> {ticket.ticketId}</p>
          <p><b>KOODI</b> {ticket.verificationCode}</p>
          <p><b>TAPAHTUMA:</b> {ticket.eventTicketType.event.eventName}</p>
          <p><b>LIPPUTYYPPI:</b> {ticket.eventTicketType.ticketType.typeName}</p>
          <p><b>HINTA:</b> {formatPrice(ticket.eventTicketType.price)}</p>
          <img alt="qr-code" src={`data:image/png;base64,${ticket.qrCode}`}/>
        </div>
      ))}
    </>
  );
};

export default PrintTickets;
