import React from "react";

function Error({ code, message }) {
  return (
    <div>
      <h1>{code}</h1>
      <span>{message}</span>
    </div>
  );
}

export default Error;
