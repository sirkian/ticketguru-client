import Main from "./Main";
import Cart from "./Cart";
import "../styles/events.css";
import { connect, useSelector } from "react-redux";
import Error from "./Error";
import Login from "./Login";

export function Events() {
  const currentUser = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Jos ei kirjautuneena sisään => ohjataan loginiin
  if (!isLoggedIn) return <Login />;

  // Jos authorities-listalla on ADMIN tai CLERK, näytetään etusivun komponentit
  if (
    currentUser.authorities.some(
      (item) => item.authority === "ADMIN" || item.authority === "CLERK"
    )
  ) {
    return (
      <div className="mainCartContainer">
        <Main />
        <Cart />
      </div>
    );
    // Muussa tapauksessa näytetään error-komponentti koodilla 403
  } else {
    return <Error code={403} message={"Vaaditaan ADMIN tai CLERK-rooli!"} />;
  }
}

export default connect()(Events);
