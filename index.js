
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase config (replace with your own Firebase project settings)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ name: "", service: "EICR", date: "" });

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const snapshot = await getDocs(collection(db, "bookings"));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBookings(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "bookings"), form);
    setForm({ name: "", service: "EICR", date: "" });
    fetchBookings();
    sendEmailConfirmation(form);
  };

  const sendEmailConfirmation = (booking) => {
    // Placeholder: integrate with email service like SendGrid or EmailJS
    console.log(`Email sent to ${booking.name} confirming ${booking.service} on ${booking.date}`);
  };

  return (
    <div style={{ fontFamily: "Arial", margin: 0 }}>

      <div style={{ padding: "20px", background: "#111", color: "white", display: "flex", justifyContent: "space-between" }}>
        <h2>CertifyPro</h2>
      </div>

      <div style={{ padding: "60px 20px", textAlign: "center", background: "#f5f5f5" }}>
        <h1>Property Certification Made Simple</h1>
        <p>Same-day EICR, EPC & Gas Safety Certificates</p>
      </div>

      <div style={{ padding: "40px" }}>
        <h2>Book a Service</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
          <input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ marginBottom: 10, padding: 10 }} />
          <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} style={{ marginBottom: 10, padding: 10 }}>
            <option>EICR</option>
            <option>EPC</option>
            <option>Gas Safety</option>
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required style={{ marginBottom: 10, padding: 10 }} />
          <button type="submit" style={{ padding: 10 }}>Book Now</button>
        </form>
      </div>

      <div style={{ padding: "40px", background: "#fafafa" }}>
        <h2>Admin Dashboard</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.service}</td>
                  <td>{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ padding: "20px", background: "#111", color: "white", textAlign: "center" }}>
        <p>© 2026 CertifyPro</p>
      </div>

    </div>
  );
}
