import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Reducer";
import "../styles/user.css";

export function User() {
  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  return (
    <div>
      <div className="logout">
      <link rel="stylesheet" href="path/to/user.css"/>
        <span className="email">{currentUser.email}</span>{" "}
        <button className="logout" onClick={() => dispatch(logout(currentUser))}>
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
}

export default connect()(User);
