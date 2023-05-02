import React from "react";
import { connect, useSelector } from "react-redux";

export function User() {
  const currentUser = useSelector((state) => state.user.user);
  return (
    <div>
      <div>{currentUser.email}</div>
    </div>
  );
}

export default connect()(User);
