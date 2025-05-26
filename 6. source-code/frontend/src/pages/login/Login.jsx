import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex justify-center flex-col  mt-6 p-4 min-h-[70vh]">
      <h2 className="text-center mb-5 text-3xl font-bold">
        Login to store the Results
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col container mx-auto mt-8 w-80 md:w-1/2 xl:w-1/3 bg-orange-100 p-5 rounded-sm mb-8"
      >
        <div className="mb-4">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-2"
          />
        </div>
        <div className="mt-2 mb-2">
          <Link to="/signup">{"Don't"} have an account? Sign up</Link>
        </div>

        <button
          type="submit"
          className="w-1/3 p-2 rounded-sm bg-orange-500 text-white hover:bg-orange-600 mx-auto"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
