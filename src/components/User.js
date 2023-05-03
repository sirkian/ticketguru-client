import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Reducer";

export function User() {
  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <span>{currentUser.email}</span>{" "}
        <button onClick={() => dispatch(logout(currentUser))}>
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
}

export default connect()(User);
