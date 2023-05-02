import React from "react";
import Events from "./components/Events";
import CheckTickets from "./components/CheckTickets";
import "./styles/app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrintTickets from "./components/PrintTickets";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "./store/Reducer";
import Resources from "./components/Resources";
import Report from "./components/Report";
import Navbar from "./components/Navbar";
import AddEvent from "./components/AddEvent";

export default function App() {
  // Provider React Reduxia varten - älä poista
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Events />} />
          <Route path="addevent" element={<AddEvent />} />
          <Route path="tickets" element={<CheckTickets />} />
          <Route path="print" element={<PrintTickets />} />
          <Route path="resources" element={<Resources />} />
          <Route path="report" element={<Report />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

//export default App;
