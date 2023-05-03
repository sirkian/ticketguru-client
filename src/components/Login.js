import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LOGIN_SUCCESS, URL } from "../utils/constants";
import { loginSuccess } from "../store/Reducer";
import "../styles/login.css";

function mapStateToProps(state) {
  return {
    user: state.user,
    isloggedIn: state.isloggedIn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addCurrentUser: (user) => dispatch({ type: LOGIN_SUCCESS, payload: user }),
  };
}

export const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const isLoggedIn = useSelector((state) => state.user.user);
  // const user = useSelector((state) => state.user.isLoggedIn);

  // console.log(isLoggedIn);

  // useEffect(() => {
  //   dispatch();
  // }, [dispatch]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = async (formValue) => {
    const { email, password } = formValue;
    // setLoading(true);
    const reqOptions = {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(email + ":" + password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };

    try {
      const response = await fetch(`${URL}/appusers/login`, reqOptions);

      if (response.status === 200) {
        const json = await response.json();
        setError("");
        dispatch(loginSuccess(json));
        // Tallennetaan käyttäjä myös localStorageen
        // Nyt voi hakata f5 eikä kirjaudu ulos enää
        localStorage.setItem("user", JSON.stringify(json));
        navigate("/");
      } else {
        setError("Väärä email tai salasana!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // dispatch({ email, password })
  //   .unwrap()
  //   .then(() => {
  //     navigate("/ticketguru-client");
  //     window.location.reload();
  //   })
  //   .catch(() => {
  //     setLoading(false);
  //   });

  // if (isLoggedIn) {
  //   return <Navigate to="/ticketguru-client" />;
  // }

  return (
    <div className="loginContainer">
      <div className="card card-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field name="email" type="text" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>
          </Form>
        </Formik>
      </div>

      {/* {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )} */}

      {error.length > 0 && <p>{error}</p>}
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
