import React from "react";

const Newsmail = () => {
  return (
    <section className="bg-gradient-to-br from-blue-200 via-white to-red-100 text-black py-6 px-5 rounded-xl shadow-lg">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-1xl md:text-2xl font-bold mb-4 text-gray-800">
          Stay Ahead with EGadget
        </h2>
        <p className="mb-4 text-l font-light text-black-700">
          Stay updated! Drop your email and we’ll reach out to you with the latest smartphones and updates.
        </p>

        <form
          className="flex flex-col sm:flex-row w-full max-w-md mx-auto gap-2 sm:gap-0"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for subscribing!");
          }}
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-md sm:rounded-l-md sm:rounded-r-none text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
    <button
    type="submit"
    className="bg-blue-600 text-white px-6 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-blue-700 transition duration-300 font-semibold"
    >
    Send
    </button>

        </form>
      </div>
    </section>
  );
};

export default Newsmail;
