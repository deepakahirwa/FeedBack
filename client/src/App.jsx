import React from "react";

const Navigation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full bg-blue-600 p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Sentiment App</h1>
          <ul className="flex space-x-4">
            <li>
              <a
                href="/dashboard"
                className="text-white hover:underline hover:text-gray-200"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/feedback"
                className="text-white hover:underline hover:text-gray-200"
              >
                Feedback
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Welcome to Sentiment App!
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Use the navigation links above to explore.
        </p>
      </main>
    </div>
  );
};

export default Navigation;
