import React from 'react';
import { Card, Container, Row, Col, Table} from 'react-bootstrap';
import { FaCalendarCheck, FaUserFriends, FaFilePrescription } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import './doctor\'s.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';


import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoctorDashboard = () => {
    const appointmentData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [
            {
                label: 'Appointments',
                data: [12, 9, 14, 7, 10],
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6610f2'],
            },
        ],
    };

    const genderData = {
        labels: ['Male', 'Female', 'Other'],
        datasets: [
            {
                label: 'Patients by Gender',
                data: [60, 40, 5],
                backgroundColor: ['#6f42c1', '#e83e8c', '#20c997'],
            },
        ],
    };
    const [date, setDate] = useState(new Date());
    const upcomingAppointments = [
        { date: '2025-07-25', status: 'Confirmed', notes: 'Blood test results' },
        { date: '2025-07-26', status: 'Pending', notes: 'Follow-up check' },
        { date: '2025-07-27', status: 'Canceled', notes: 'Patient unavailable' },
    ];

    return (
        <Container className="mt-5">
            <h1 className="tx">👨‍⚕️ Doctor's Dashboard</h1>

            {/* Top Stats Row */}
            <Row className="mb-5 stats-row">
                <Col md={6}>
                    <Card className="stats-card">
                        <Card.Body className="text-center">
                            <FaCalendarCheck size={36} className="icon-style" />
                            <h5>Total Appointments</h5>
                            <p className="stat-number">52</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stats-card">
                        <Card.Body className="text-center">
                            <FaUserFriends size={36} className="icon-style" />
                            <h5>Total Consultations</h5>
                            <p className="stat-number">59</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stats-card">
                        <Card.Body className="text-center">
                            <FaUserFriends size={36} className="icon-style" />
                            <h5>Total Patients</h5>
                            <p className="stat-number">89</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stats-card">
                        <Card.Body className="text-center">
                            <FaFilePrescription size={36} className="icon-style" />
                            <h5>Total Prescriptions</h5>
                            <p className="stat-number">34</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Calendar + Charts in One Row */}
<Row className="mb-5 justify-content-center">
    <Col md={4} className="mb-4">
        <Card>
            <Card.Body className="text-center">
                <h5 className=" cd">🗓️ Calendar</h5>
                <Calendar onChange={setDate} value={date} />
                <p className="ty">
                    <strong>Selected Date:</strong> {date.toDateString()}
                </p>
            </Card.Body>
        </Card>
    </Col>
    <Col md={4} className="try">
        <Card>
            <Card.Body>
                <h5 className="text-center mb-3">📊 Appointments by Day</h5>
                <Pie data={appointmentData} />
            </Card.Body>
        </Card>
    </Col>
    <Col md={4} className="try2">
        <Card>
            <Card.Body>
                <h5 className="text-center mb-3">🧑‍🤝‍🧑 Patients by Gender</h5>
                <Pie data={genderData} />
            </Card.Body>
        </Card>
    </Col>
    <Col md={3}>
    <Card className="appointment-card h-300 w-300">
        <Card.Body className="appointment-body">
            <h5 className="appointment-title">Upcoming Appointments</h5>
            <div className="table-responsive">
                <Table className="appointment-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingAppointments.map((appt, index) => (
                            <tr key={index}>
                                <td>{appt.date}</td>
                                <td>
                                    <span className={`status-badge ${
                                        appt.status === 'Confirmed' ? 'status-confirmed' :
                                        appt.status === 'Pending' ? 'status-pending' :
                                        'status-cancelled'
                                    }`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td>{appt.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Card.Body>
    </Card>
</Col>

</Row>
        </Container>
    );
};

export default DoctorDashboard;
