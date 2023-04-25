import React from "react";
import Events from "./components/Events";
import CheckTickets from "./components/CheckTickets";
import "./styles/app.css";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PrintTickets from "./components/PrintTickets";
import Login from "./components/Login";
import { Provider } from 'react-redux';
import store from './store/CartReducer'

export default function App() {
  // Provider React Reduxia varten - älä poista
  return (
    <Provider store={store}>
    <BrowserRouter>
      <li>
        <Link to="/events">Hae tapahtumia</Link>
      </li>
      <li>
        <Link to="/tickets">Tsekkaa lippu</Link>
      </li>

      <Routes>
<<<<<<< HEAD
        <Route path="/events" element={<Events/>}></Route>
        <Route path="/tickets" element={<CheckTickets/>}></Route>
        <Route path="/print" element={<PrintTickets/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
      </BrowserRouter>
      </Provider>
  
=======
        <Route path="/events" element={<Events />}></Route>
        <Route path="/tickets" element={<CheckTickets />}></Route>
        <Route path="/print" element={<PrintTickets />}></Route>
      </Routes>
    </BrowserRouter>
>>>>>>> d5b8e1b3933b9c4d5fb1402adab55d5fe9079d71
  );
}

//export default App;
