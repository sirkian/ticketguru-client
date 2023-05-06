import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { User } from "./User";
import "../styles/navbar.css";
import { SET_USER } from "../utils/constants";

export function Navbar() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Navbar renderöidään aina kun sivu päivitetään,
    // joten haetaan täällä localStoragesta user (jos on)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Jos löytyi, asetetaan se currentUseriksi
      const user = JSON.parse(storedUser);
      dispatch({ type: SET_USER, payload: user });
    }
  }, []);

  console.log(currentUser);
  return (
    <div className="navContainer">
      {isLoggedIn && (
        <div className="navLinks">
          <ul>
            <li>
              <Link to="/">Etusivu</Link>
            </li>
            {currentUser.authorities.some(
              (item) => item.authority === "ADMIN"
            ) && (
              <li>
                <Link to="resources">Resurssien hallinta</Link>
              </li>
            )}

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
