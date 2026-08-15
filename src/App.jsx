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
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/turfs")
      .then((response) => {
        setTurfs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const selectTurf = (turf) => {
    setSelectedTurf(turf);
    setDate("");
    setSlots([]);
    setSelectedSlot("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

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
        `http://localhost:8080/api/bookings/available-slots?turfId=${selectedTurf.id}&date=${selectedDate}`
      )
      .then((response) => {
        setSlots(response.data);
      })
      .catch((error) => {
        console.error(error);
        setSlots([]);
      });
  };
const handleBooking = () => {

  if (!name || !mobile) {
    alert("Please enter your name and mobile number");
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
    .post("http://localhost:8080/api/bookings", bookingData)
    .then(() => {
      setBookingSuccess(true);
    })
    .catch((error) => {
      console.error(error);
      alert("Booking failed. Please try again.");
    });
};
  return (
    <div className="app">

      {/* Navbar */}

      <nav className="navbar">

        <div className="logo">
          Turfify
        </div>

        <div className="nav-links">
          <a href="#turfs">Turfs</a>
          <a href="#about">About</a>
        </div>

      </nav>


      {/* Booking Section */}

      {selectedTurf && (

        <section className="booking-section">

          <button
            className="back-button"
            onClick={() => setSelectedTurf(null)}
          >
            ← Back to Turfs
          </button>

          <div className="booking-card">

            <h2>
              Book {selectedTurf.name}
            </h2>

            <p>
              📍 {selectedTurf.location}
            </p>

            <p>
              ₹{selectedTurf.price} / hour
            </p>


            {/* Date */}

            <div className="form-group">

              <label>
                Select Date
              </label>

              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleDateChange}
              />

            </div>


            {/* Slots */}

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
                        onClick={() => setSelectedSlot(slot)}
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

          </div>

        </section>

      )}

{selectedSlot && !bookingSuccess && (

  <div className="customer-form">

    <h3>Your Details</h3>

    <div className="form-group">

      <label>Name</label>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

    </div>

    <div className="form-group">

      <label>Mobile Number</label>

      <input
        type="tel"
        placeholder="Enter your mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

    </div>

    <button
      className="confirm-button"
      onClick={handleBooking}
    >
      Confirm Booking
    </button>

  </div>

)}
      {/* Hero */}

      {!selectedTurf && (

        <>

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
                Book premium football turfs around Chennai
                in just a few clicks.
              </p>

              <a
                href="#turfs"
                className="hero-button"
              >
                Explore Turfs
              </a>

            </div>

          </section>


          {/* Turfs */}

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

                  <div className="turf-image">

                    <img
                      src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800"
                      alt={turf.name}
                    />

                  </div>


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
                        onClick={() => selectTurf(turf)}
                      >
                        Book Now
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* Footer */}

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
      {bookingSuccess && (

  <section className="booking-section">

    <div className="booking-card booking-success">

      <h2>🎉 Booking Confirmed!</h2>

      <p>Your turf has been successfully booked.</p>

      <p>
        <strong>{selectedTurf.name}</strong>
      </p>

      <p>📍 {selectedTurf.location}</p>

      <p>📅 {date}</p>

      <p>⏰ {selectedSlot}</p>

      <p>👤 {name}</p>

      <p>📱 {mobile}</p>

    </div>

  </section>

)}

    </div>
  );
}

export default App;