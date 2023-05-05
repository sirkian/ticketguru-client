import React from "react";
import Events from "./components/Events";
import CheckTickets from "./components/CheckTickets";
import "./styles/app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrintTickets from "./components/PrintTickets";
import Login from "./components/Login";
import { Provider, useDispatch } from "react-redux";
import store from "./store/Reducer";
import Resources from "./components/Resources";
import Report from "./components/Report";
import Navbar from "./components/Navbar";
import AddEvent from "./components/AddEvent";
import { SET_USER } from "./utils/constants";
import EditEvent from "./components/EditEvent";
import EditVenue from "./components/EditVenue";

export default function App() {
  // Provider React Reduxia varten - älä poista
  return (
    <Provider store={store}>
      <BrowserRouter basename="/ticketguru-client">
        <Navbar />
        <Routes>
          <Route index element={<Events />} />
          <Route exact path="/addevent" element={<AddEvent />} />
          <Route exact path="/editevent" element={<EditEvent />} />
          <Route exact path="/editvenue" element={<EditVenue />} />
          <Route exact path="/tickets" element={<CheckTickets />} />
          <Route exact path="/print" element={<PrintTickets />} />
          <Route exact path="/resources" element={<Resources />} />
          <Route exact path="/report" element={<Report />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

//export default App;
