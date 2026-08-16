import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {

  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [bookingSuccess, setBookingSuccess] = useState(false);


  // Get all turfs
  useEffect(() => {

    axios
      .get("https://turfify-backend.onrender.com/api/turfs")

      .then((response) => {
        setTurfs(response.data);
      })

      .catch((error) => {
        console.error("Error fetching turfs:", error);
      });

  }, []);


  // Select turf
  const selectTurf = (turf) => {

    setSelectedTurf(turf);

    setDate("");
    setSlots([]);
    setSelectedSlot("");

    setName("");
    setMobile("");

    setBookingSuccess(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // Select date
  const handleDateChange = (event) => {

    const selectedDate = event.target.value;

    setDate(selectedDate);
    setSelectedSlot("");

    if (!selectedDate) {
      setSlots([]);
      return;
    }

    axios
      .get(
        `https://turfify-backend.onrender.com/api/bookings/available-slots?turfId=${selectedTurf.id}&date=${selectedDate}`
      )

      .then((response) => {
        setSlots(response.data);
      })

      .catch((error) => {
        console.error("Error fetching slots:", error);
        setSlots([]);
      });
  };


  // Confirm booking
  const handleBooking = () => {

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!mobile.trim()) {
      alert("Please enter your mobile number");
      return;
    }

    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }


    const bookingData = {

      turfId: selectedTurf.id,

      bookingDate: date,

      timeSlot: selectedSlot,

      customerName: name,

      mobile: mobile

    };


    axios
      .post(
        "https://turfify-backend.onrender.com/api/bookings",
        bookingData
      )

      .then(() => {

        setBookingSuccess(true);

      })

      .catch((error) => {

        console.error("Booking error:", error);

        alert("Booking failed. Please try again.");

      });

  };


  return (

    <div className="app">


      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          Turfify
        </div>

        <div className="nav-links">

          <a href="#turfs">
            Turfs
          </a>

          <a href="#about">
            About
          </a>

        </div>

      </nav>


      {/* =====================================================
          BOOKING PAGE
      ===================================================== */}

      {selectedTurf && !bookingSuccess && (

        <section className="booking-section">

          <button
            className="back-button"
            onClick={() => setSelectedTurf(null)}
          >
            ← Back to Turfs
          </button>


          <div className="booking-card">

            {/* Turf information */}

            <h2>
              Book {selectedTurf.name}
            </h2>

            <p className="booking-location">
              📍 {selectedTurf.location}
            </p>

            <p className="booking-price">
              ₹{selectedTurf.price} / hour
            </p>


            {/* DATE */}

            <div className="form-group">

              <label>
                Select Date
              </label>

              <input
                type="date"
                value={date}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleDateChange}
              />

            </div>


            {/* TIME SLOTS */}

            {date && (

              <div className="slots-section">

                <h3>
                  Available Time Slots
                </h3>


                <div className="slots">

                  {slots.length > 0 ? (

                    slots.map((slot) => (

                      <button
                        key={slot}
                        className={
                          selectedSlot === slot
                            ? "slot selected"
                            : "slot"
                        }

                        onClick={() =>
                          setSelectedSlot(slot)
                        }
                      >

                        {slot}

                      </button>

                    ))

                  ) : (

                    <p>
                      No slots available for this date.
                    </p>

                  )}

                </div>

              </div>

            )}


            {/* CUSTOMER DETAILS */}

            {selectedSlot && (

              <div className="customer-form">

                <h3>
                  Your Details
                </h3>


                {/* NAME */}

                <div className="form-group">

                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                  />

                </div>


                {/* MOBILE */}

                <div className="form-group">

                  <label>
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(event) =>
                      setMobile(event.target.value)
                    }
                  />

                </div>


                {/* CONFIRM */}

                <button
                  className="confirm-button"
                  onClick={handleBooking}
                >

                  Confirm Booking

                </button>

              </div>

            )}

          </div>

        </section>

      )}


      {/* =====================================================
          BOOKING SUCCESS
      ===================================================== */}

      {bookingSuccess && (

        <section className="booking-section">

          <div className="booking-card booking-success">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Booking Confirmed!
            </h2>

            <p>
              Your turf has been successfully booked.
            </p>


            <div className="booking-summary">

              <p>
                <strong>Turf</strong>
                <br />
                {selectedTurf.name}
              </p>

              <p>
                <strong>Location</strong>
                <br />
                📍 {selectedTurf.location}
              </p>

              <p>
                <strong>Date</strong>
                <br />
                📅 {date}
              </p>

              <p>
                <strong>Time</strong>
                <br />
                ⏰ {selectedSlot}
              </p>

              <p>
                <strong>Name</strong>
                <br />
                👤 {name}
              </p>

              <p>
                <strong>Mobile</strong>
                <br />
                📱 {mobile}
              </p>

            </div>


            <button
              className="home-button"
              onClick={() => {

                setSelectedTurf(null);
                setBookingSuccess(false);

              }}
            >

              Back to Turfs

            </button>

          </div>

        </section>

      )}


      {/* =====================================================
          HOME PAGE
      ===================================================== */}

      {!selectedTurf && (

        <>

          {/* HERO */}

          <section className="hero">

            <div className="hero-content">

              <p className="hero-tag">
                PLAY. BOOK. REPEAT.
              </p>

              <h1>
                Find your perfect
                <span> turf.</span>
              </h1>

              <p className="hero-description">
                Book premium football turfs around
                Chennai in just a few clicks.
              </p>

              <a
                href="#turfs"
                className="hero-button"
              >
                Explore Turfs
              </a>

            </div>

          </section>


          {/* TURFS */}

          <section
            className="turf-section"
            id="turfs"
          >

            <div className="section-heading">

              <p>
                OUR TURFS
              </p>

              <h2>
                Choose where you play
              </h2>

            </div>


            <div className="turf-grid">

              {turfs.map((turf) => (

                <div
                  className="turf-card"
                  key={turf.id}
                >


                  {/* IMAGE */}

                  <div className="turf-image">

                    <img
                      src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800"
                      alt={turf.name}
                    />

                  </div>


                  {/* INFORMATION */}

                  <div className="turf-info">

                    <h3>
                      {turf.name}
                    </h3>

                    <p className="location">
                      📍 {turf.location}
                    </p>

                    <p className="description">
                      {turf.description}
                    </p>


                    <div className="turf-bottom">

                      <div>

                        <span>
                          Starting from
                        </span>

                        <strong>
                          ₹{turf.price}
                        </strong>

                        <small>
                          / hour
                        </small>

                      </div>


                      <button
                        onClick={() =>
                          selectTurf(turf)
                        }
                      >

                        Book Now

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* FOOTER */}

          <footer id="about">

            <h2>
              Turfify
            </h2>

            <p>
              Simple turf booking for everyone.
            </p>

            <p>
              © 2026 Turfify
            </p>

          </footer>

        </>

      )}

    </div>

  );

}

export default App;