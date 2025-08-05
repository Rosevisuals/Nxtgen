import React, { useState } from 'react';
import './appointment.css';

const AppointmentForm = () => {
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        patientName: '',
        date: '',
        time: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setAppointments([...appointments, formData]);
        setFormData({ patientName: '', date: '', time: '', notes: '' });
    };

    return (
        <div>
            <h2>Set Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Patient Name:</label>
                    <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Time:</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Notes:</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit">Add Appointment</button>
            </form>

            <h2>Appointments</h2>
            <ul>
                {appointments.map((appointment, index) => (
                    <li key={index}>
                        <strong>{appointment.patientName}</strong> - {appointment.date} at {appointment.time}
                        <p>{appointment.notes}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmentForm;