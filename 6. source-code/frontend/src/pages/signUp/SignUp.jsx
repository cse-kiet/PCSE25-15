import React, { useState } from "react";
import { useSignup } from "../../hooks/useSignup"; // Importing useSignup from hooks folder
import { Link } from "react-router-dom"; // Importing Link from react-router-dom

function SignUp() {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className="mt-6 p-4">
      <h2 className="text-center mb-5 text-3xl font-bold">Sign Up</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col container mx-auto mt-8 w-80 md:w-1/2 xl:w-1/3 bg-orange-100 p-5 rounded-sm mb-8"
      >
        <div className="mb-4">
          <label htmlFor="Fullname">Full Name</label>
          <input
            type="text"
            placeholder="Enter Full Name"
            value={inputs.fullName}
            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={inputs.confirmPassword}
            onChange={(e) =>
              setInputs({ ...inputs, confirmPassword: e.target.value })
            }
          />
        </div>
        <div className="mt-2 mb-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>

        <button
          type="submit"
          className="w-1/2 p-2 rounded-sm bg-orange-500 text-white hover:bg-orange-600 mx-auto"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
