import React from "react";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router";

export function User() {
  const currentUser = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  return (
    <div>
      {isLoggedIn ? (
        <div>{currentUser.email}</div>
      ) : (
        <button onClick={() => navigate("/login")}>Kirjaudu sisään</button>
      )}
    </div>
  );
}

export default connect()(User);
