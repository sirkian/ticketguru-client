import React from "react";
import Events from "./components/Events";
import CheckTickets from "./components/CheckTickets";
import "./styles/app.css";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PrintTickets from "./components/PrintTickets";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "./store/Reducer";
import TicketTypes from "./components/TicketTypes";
import Resources from "./components/Resources";

export default function App() {
  // Provider React Reduxia varten - älä poista
  return (
    <Provider store={store}>
      <BrowserRouter>
        <li>
          <Link to="/events">Hae tapahtumia</Link>
        </li>
        <li>
          <Link to="/resources">Lisää resursseja</Link>
        </li>
        <li>
          <Link to="/tickets">Tsekkaa lippu</Link>
        </li>


        <Routes>
          <Route path="/events" element={<Events />}></Route>
          <Route path="/tickets" element={<CheckTickets />}></Route>
          <Route path="/print" element={<PrintTickets />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/resources" element={<Resources />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

//export default App;
