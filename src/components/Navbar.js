import React from "react";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { User } from "./User";
import "../styles/navbar.css";

export function Navbar() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return (
    <div className="navContainer">
      {isLoggedIn && (
        <div className="navLinks">
          <ul>
            <li>
              <Link to="/">Etusivu</Link>
            </li>
            <li>
              <Link to="addevent">Lisää tapahtuma</Link>
            </li>
            <li>
              <Link to="resources">Lisää resursseja</Link>
            </li>
            <li>
              <Link to="tickets">Tsekkaa lippu</Link>
            </li>
            <li>
              <Link to="report">Raportti</Link>
            </li>
          </ul>
          <User />
        </div>
      )}
    </div>
  );
}

export default connect()(Navbar);
