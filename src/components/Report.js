import React, { useEffect, useState } from "react";
import { URL } from "../utils/constants";
import { connect, useSelector } from "react-redux";
import Login from "./Login";
import "../styles/getReport.css";

export function Report() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentUser = useSelector((state) => state.user.user);
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
        Authorization: currentUser.token,
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
        Authorization: currentUser.token,
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
  console.log(event);

  if (!isLoggedIn) return <Login />;
  return (
    <>
        <div className = "reportContainer">
            <div className = "reportHeading">
                <p><b>Myyntiraportti</b></p>
            </div>
            
            {events.map((ev) => {
                return (        
                    <div className="eventsReport" key={ev.eventId} >   
                        <div className = "description">
                            {ev.eventName} {ev.description} {" "}
                        </div>
                        <div className = "button">
                            <button onClick={() => fetchReport(ev.eventId)}>hae raportti</button>
                        </div>    
                    </div>
                );
            })}
            
            
            {report.length > 0 && (
            <table className="table">
                <caption><b>{report[0].event}</b></caption>
                <thead>
                    <tr>
                        <th scope="col">Lipputyyppi</th>
                        <th>Myyntimäärä kpl</th>
                        <th>Kappalehinta €</th>
                        <th>Kokonaismyynti €</th>
                    </tr>
                </thead>
            {report.map((rep) => {
                return(  
                    <tr key={rep.eventTicketType}>
                        <td>{rep.eventTicketType}</td>
                        <td>{rep.amountSoldTickets}</td>
                        <td>{rep.price}</td>
                        <td>{rep.total}</td>
                    </tr>  
                )
                
            })}
            </table>
            )}
        </div>
        
    </>
  );
}
export default connect()(Report);
