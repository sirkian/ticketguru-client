import { useLocation } from "react-router-dom";

// Ei tarvinnukkaan propsina lähettää
const PrintTickets = () => {
  // UseLocation ottaa vastaan useNavigaten lähettämän tiedon
  const location = useLocation();

  // location.state on se objektitaulukko, jossa liput
  console.log(location.state);

  return (
    <>
      {location.state.map((ticket) => (
        <div key={ticket.ticketId}>
          <p>ID {ticket.ticketId}</p>
          <p>KOODI {ticket.verificationCode}</p>
        </div>
      ))}
    </>
  );
};

export default PrintTickets;
