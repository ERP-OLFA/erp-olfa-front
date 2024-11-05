import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Custom CSS file for additional styling

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple check for demonstration. Replace with actual authentication logic.
    if (email === "olfa.larbi@gmail.com" && password === "94118429") {
      localStorage.setItem("isAuthenticated", true);
      window.location.href='https://test-erp-olfa.netlify.app/'
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <section className="text-center text-lg-start">
      <div className="card mb-3 login-card" style={{marginTop:"100px"}}>
        <div className="row g-0 d-flex align-items-center">
          <div className="col-lg-4 d-none d-lg-flex">
            <img 
              src="https://purepng.com/public/uploads/large/purepng.com-studentsstudentcollege-studentschool-studentstudentsmale-female-1421526923893ly5hs.png" 
              alt="Students"
              className="w-100 rounded-start" 
            />
          </div>
          <div className="col-lg-8">
            <div className="card-body py-5 px-md-5">
              <h4 className="card-title">Welcome Back!</h4>
              <form onSubmit={handleSubmit}>
                {/* Email input */}
                <div className="form-outline mb-4">
                  <input 
                    type="email" 
                    id="email" 
                    className="form-control" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                  <label className="form-label" htmlFor="email">Email address</label>
                </div>

                {/* Password input */}
                <div className="form-outline mb-4">
                  <input 
                    type="password" 
                    id="password" 
                    className="form-control" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                  <label className="form-label" htmlFor="password">Password</label>
                </div>

                {/* Remember me and Forgot password links */}
                <div className="row mb-4">
                  <div className="col d-flex justify-content-center">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="rememberMe" 
                      />
                      <label className="form-check-label" htmlFor="rememberMe"> Remember me </label>
                    </div>
                  </div>
                  <div className="col text-end">
                    <a href="#!">Forgot password?</a>
                  </div>
                </div>

                {/* Submit button */}
                <Button type="submit" className="btn btn-primary btn-block mb-4">
                  Sign in
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
