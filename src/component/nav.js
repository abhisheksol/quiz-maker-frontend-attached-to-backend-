import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";

const Navbar = () => {
  const [isSideMenuOpen, setMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth(); // Access context

  const isAdmin = user?.role === "admin"; // Determine if the user is an admin

  return (
    <main >
      {/* Top Navbar */}
      <nav className="flex justify-between px-8 items-center py-6 bg-gray-600 text-white">
        <div className="flex items-center gap-8">
          <section className="flex items-center gap-4">
            {/* Menu Icon */}
            <FiMenu
              onClick={() => setMenu(true)}
              className="text-3xl cursor-pointer lg:hidden"
            />
            {/* Logo */}
            <Link to="/" className="text-4xl font-mono">
              Quiz Maker
            </Link>
          </section>

          {/* Desktop Links */}
          <div className="hidden lg:flex gap-4">
            <Link to="/" className="hover:underline">Home</Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            )}
            {isAuthenticated && (
              <>

                {isAdmin ? (
                  <>
                    <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/admin/quizzes" className="hover:underline">Manage Quizzes</Link>
                    <Link to="/admin/create" className="hover:underline">Create Quiz</Link>
                  </>
                ) : (
                  <>
                    <Link to="/user/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/user/quizzes" className="hover:underline">Quizzes</Link>
                    <Link to="/user/1/results" className="hover:underline">My Results</Link>
                  </>
                )}
                <Link to="/leaderboard" className="hover:underline">leaderboard</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={clsx(
            "fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 -translate-x-full transition-all",
            isSideMenuOpen && "translate-x-0"
          )}
        >
          <section className="text-black bg-white flex-col absolute left-0 top-0 h-screen p-8 gap-8 z-50 w-56 flex">
            <IoCloseOutline
              onClick={() => setMenu(false)}
              className="mt-0 mb-8 text-3xl cursor-pointer"
            />
            <Link to="/" className="font-bold">Home</Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="font-bold">Login</Link>
                <Link to="/register" className="font-bold">Register</Link>
              </>
            )}
            {isAuthenticated && (
              <>
                {isAdmin ? (
                  <>
                    <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>

                    <Link to="/admin/quizzes" className="font-bold">Manage Quizzes</Link>
                    <Link to="/admin/create" className="font-bold">Create Quiz</Link>
                  </>
                ) : (
                  <>
                    <Link to="/user/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/user/quizzes" className="font-bold">Quizzes</Link>
                    <Link to="/user/1/results" className="font-bold">My Results</Link>
                  </>
                )}
                <Link to="/leaderboard" className="font-bold">leaderboard</Link>
              </>
            )}
          </section>
        </div>

        {/* Right Section */}
        <section className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden lg:block">{user?.email}</span>
              <button
                onClick={logout}
                className="hover:underline text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:underline text-white">Login</Link>
          )}
        </section>
      </nav>
      <hr />
    </main>
  );
};

export default Navbar;
