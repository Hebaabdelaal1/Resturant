import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();
  return (

        <div className="w-full">

    <section
      className="relative w-full h-screen bg-cover bg-center flex items-center text-white m-0"
      style={{
        backgroundImage: `url('https://media.istockphoto.com/id/1145478730/photo/sliced-barbecue-pizza-with-tomatoes-on-a-branch.jpg?s=612x612&w=0&k=20&c=d1SnPHiHNrkRM-dWiGVxuRmT_A0V1Na-REXFqfRl3J8=')`,
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-end justify-center w-full px-6 md:px-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight max-w-lg">
          Explore the <span className="text-orange-600">flavours</span> <br />
          And Hospitality of our food
        </h1>

        {/* Buttons just below text */}
        <div className="flex gap-4 mt-10  mx-15">
          <button className="bg-orange-600 hover:bg-orange-700 text-black font-semibold px-6 py-3 rounded-full transition">
            Order Now
          </button>
          <button className="border border-orange-600 hover:bg-orange-700 hover:text-black px-6 py-3 rounded-full transition"
          onClick={ () =>
             {
                  navigate('/menu');
              }
            }
          >
            Our Menu
          </button>
        </div>
      </div>
    </section>

     <section className="bg-black text-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10">
        <img
          src="https://media.istockphoto.com/id/990957890/photo/pizza-with-mozzarella-hunting-sausages-salami-bacon-onion-t.jpg?s=612x612&w=0&k=20&c=s8hD1AwweF0bsQUAcw2WAqfSeCDVg1d-AxBjXOQykUM="
          alt="Pizza"
          className="w-full md:w-1/2 rounded-2xl shadow-lg"
        />
        <div className="md:w-1/2 text-left">
        <div className="w-24 h-[2px] bg-white mx-auto mb-6"></div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">
            Enjoy our new flavour of Pizza
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Discover the bold and cheesy experience of our freshly baked pizzas —
            made with premium ingredients, soft crust, and perfectly melted
            mozzarella. Every bite is crafted to make you crave for more  Discover the bold and cheesy experience of our freshly baked pizzas —
            made with premium ingredients, soft crust, and perfectly melted
            mozzarella. Every bite is crafted to make you crave for more!
          </p>
        </div>
      </section>

      {/* ===== SECTION 2 ===== */}
      <section className="bg-black text-white py-16 px-6 md:px-20 flex flex-col md:flex-row-reverse items-center gap-10">
        <img
          src="https://media.istockphoto.com/id/1439781465/photo/closeup-of-a-burger-with-beef-cheese-onion-tomato-and-green-salad-with-pickles-and-french.jpg?s=612x612&w=0&k=20&c=WfoIeji4GJB5ZVQ6k1H2curtLmkPfkrYpOxckCAV1xU="
          alt="Burger"
          className="w-full md:w-1/2 rounded-2xl shadow-lg"
        />
        <div className="md:w-1/2 text-left">
           <div className="w-24 h-[2px] bg-white mx-auto mb-6"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Made with Love
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            From our juicy burgers to our signature sauces, every meal we serve
            is made with care and passion. We blend the finest ingredients with
            a touch of love — because food should not only fill your stomach,
            but also your heart.From our juicy burgers to our signature sauces, every meal we serve
            is made with care and passion. We blend the finest ingredients with
            a touch of love
          </p>
        </div>
      </section>

      {/* ===== SECTION 3 ===== */}
      <section className="bg-black text-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10">
        <img
          src="https://plus.unsplash.com/premium_photo-1727456098393-933b1714f9b6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=600"
          alt="Restaurant"
          className="w-full md:w-1/2 rounded-2xl shadow-lg"
        />
        <div className="md:w-1/2 text-left">
          <div className="w-24 h-[2px] bg-white mx-auto mb-6"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to Delicious Hub
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Step into a world of taste where crispy burgers meet cheesy pizzas!
            At Delicious Hub, we’re more than just a restaurant — we’re your
            comfort food destination. Fresh, flavorful, and unforgettable —
            that’s how we define every meal  Step into a world of taste where crispy burgers meet cheesy pizzas!
            At Delicious Hub, we’re more than just a restaurant — we’re your
            comfort food destination. Fresh, flavorful, and unforgettable —
            that’s how we define every meal.
          </p>
        </div>
      </section>

      {/* ===== POPULAR ITEMS SECTION ===== */}
<section className="bg-[#1a1a1a] text-white py-16 px-6 md:px-20 text-center">
  {/* Title */}
  <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif">
    Try most popular items
  </h2>
  <div className="w-24 h-[2px] bg-orange-500 mx-auto mb-6"></div>

  {/* Button */}
  <button className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-black font-semibold px-6 py-2 rounded-full transition mb-10">
    Order Now
  </button>

  {/* Image Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Top Left */}
    <img
      src="https://media.istockphoto.com/id/1350427117/photo/savory-crepes-with-creamy-garlic-chicken-and-mushrooms.jpg?s=612x612&w=0&k=20&c=lD7o58WXCcszwViFQ7aT_kj1hmDEVkPXz9b1rBpXX8o="
      alt="Popular dish 1"
      className="rounded-xl w-full h-[300px] object-cover"
    />
    {/* Top Right */}
    <img
      src="https://media.istockphoto.com/id/1284887998/photo/burger-with-vegetarian-hamburger-patty-salad-tomatoes-and-roasted-onions-on-a-black-plate-on.jpg?s=612x612&w=0&k=20&c=gr3mulWHb4ko1lRqrKS74ACRhEOdEFQm_hMDw8QhDCE="
      alt="Popular dish 2"
      className="rounded-xl w-full h-[300px] object-cover"
    />
    {/* Bottom Full Width */}
    <img
      src="https://media.istockphoto.com/id/1188935896/photo/close-up-of-home-made-burgers.jpg?s=612x612&w=0&k=20&c=xIJ5npuaVAMCp5CekD-RB42S1EYXtm5CSFOWM22Dyo4="
      alt="Popular dish 3"
      className="rounded-xl w-full h-[350px] object-cover md:col-span-2"
    />
  </div>
</section>

{/* ===== LOCATION SECTION ===== */}
<section className="bg-black text-white py-16 px-6 md:px-20">
  <div className="text-center mb-8">
    <h2 className="text-3xl md:text-5xl font-bold text-orange-500 font-serif">
      Find Us Here
    </h2>
    <p className="text-gray-400 mt-2 text-lg">
      Visit Delicious Hub and enjoy the best burgers and pizzas in town!
    </p>
  </div>

  {/* Google Map */}
  <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
    <iframe
      title="Restaurant Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.066220979295!2d31.235711!3d30.044420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c5a9f6a2ad%3A0x3a4b8b85f3cfb9d5!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1699658200000!5m2!1sen!2seg"
      width="100%"
      height="100%"
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="border-0"
    ></iframe>
  </div>
</section>


    </div>
  );
}

export default Home;
