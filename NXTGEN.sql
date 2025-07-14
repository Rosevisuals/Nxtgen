-- Create the Database
CREATE DATABASE ERP1;
USE ERP1;

-- Roles Table
CREATE TABLE roles (
    role_id INT  PRIMARY KEY identity,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Users Table
CREATE TABLE users (
    user_id INT  PRIMARY KEY identity,
    full_name VARCHAR(100),
    username VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    role_id INT,
    profile_picture VARCHAR(255),
    status varchar(20),
    created_at TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Departments Table
CREATE TABLE departments (
    department_id INT  PRIMARY KEY identity,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    head_doctor_id INT
);

-- Doctors Table
CREATE TABLE doctors (
    doctor_id INT  PRIMARY KEY identity,
    user_id INT,
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    department_id INT,
    availability_status varchar(30),
    bio TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Staff Table
CREATE TABLE staff (
    staff_id INT  PRIMARY KEY identity,
    user_id INT,
    designation VARCHAR(100),
    department_id INT,
    salary DECIMAL(10,2),
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Patients Table
CREATE TABLE patients (
    patient_id INT  PRIMARY KEY identity,
    full_name VARCHAR(100),
    gender varchar(30) check(gender in ('M','F')),
    dob DATE,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    blood_type VARCHAR(5),
    emergency_contact VARCHAR(100),
    created_at TIMESTAMP
);

-- Patient Medical Records
CREATE TABLE patient_records (
    record_id INT  PRIMARY KEY identity,
    patient_id INT,
    allergies TEXT,
    past_medical_history TEXT,
    current_medications TEXT,
    notes TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Appointments
CREATE TABLE appointments (
    appointment_id INT  PRIMARY KEY identity,
    patient_id INT,
    doctor_id INT,
    appointment_date DATE,
    appointment_time TIME,
    status varchar(40) ,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- Prescriptions
CREATE TABLE prescriptions (
    prescription_id INT  PRIMARY KEY identity,
    appointment_id INT,
    doctor_id INT,
    patient_id INT,
    date_issued DATE,
    notes TEXT,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Prescription Items
CREATE TABLE prescription_items (
    item_id INT  PRIMARY KEY identity,
    prescription_id INT,
    medicine_name VARCHAR(100),
    dosage VARCHAR(100),
    duration VARCHAR(50),
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id)
);

-- Inventory Items (Medical Supplies & Pharmacy Stock)
CREATE TABLE inventory_items (
    item_id INT  PRIMARY KEY identity,
    item_name VARCHAR(100),
    category VARCHAR(100),
    quantity_in_stock INT,
    unit_price DECIMAL(10,2),
    supplier VARCHAR(100),
    last_updated TIMESTAMP 
);

-- Ambulances
CREATE TABLE ambulances (
    ambulance_id INT  PRIMARY KEY identity,
    vehicle_number VARCHAR(50),
    driver_name VARCHAR(100),
    status varchar(30) ,
);

-- Ambulance Calls
CREATE TABLE ambulance_calls (
    call_id INT  PRIMARY KEY identity,
    ambulance_id INT,
    patient_id INT,
    pickup_location TEXT,
    drop_location TEXT,
    call_time DATETIME,
    status varchar(40) ,
    FOREIGN KEY (ambulance_id) REFERENCES ambulances(ambulance_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Blood Donors
CREATE TABLE blood_donors (
    donor_id INT  PRIMARY KEY identity,
    name VARCHAR(100),
    blood_type VARCHAR(5),
    last_donation_date DATE,
    contact_info VARCHAR(100)
);

-- Blood Stock
CREATE TABLE blood_stock (
    stock_id INT  PRIMARY KEY identity,
    blood_type VARCHAR(5),
    units_available INT,
    last_updated TIMESTAMP 
);

-- Blood Issued
CREATE TABLE blood_issued (
    issue_id INT  PRIMARY KEY identity,
    patient_id INT,
    blood_type VARCHAR(5),
    units_issued INT,
    issue_date DATE,
    doctor_id INT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- Rooms
CREATE TABLE rooms (
    room_id INT  PRIMARY KEY identity,
    room_number VARCHAR(20),
    type varchar(40),
    status varchar(50) 
);

-- Room Allotments
CREATE TABLE room_allotments (
    allotment_id INT  PRIMARY KEY identity,
    patient_id INT,
    room_id INT,
    admit_date DATE,
    discharge_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- Billing
CREATE TABLE bills (
    bill_id INT  PRIMARY KEY identity,
    patient_id INT,
    amount DECIMAL(10,2),
    date_issued DATE,
    status varchar(30),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Bill Items
CREATE TABLE bill_items (
    item_id INT  PRIMARY KEY identity,
    bill_id INT,
    description VARCHAR(255),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id)
);

-- Reports
CREATE TABLE reports (
    report_id INT  PRIMARY KEY identity,
    report_type VARCHAR(100),
    generated_by INT,
    generated_at TIMESTAMP,
    file_path VARCHAR(255),
    FOREIGN KEY (generated_by) REFERENCES users(user_id)
);

-- Notifications
CREATE TABLE notifications (
    notification_id INT  PRIMARY KEY identity,
    user_id INT,
    title VARCHAR(100),
    message TEXT,
    status varchar(30),
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Settings
CREATE TABLE settings (
    setting_id INT  PRIMARY KEY identity,
    setting_key VARCHAR(100),
    setting_value TEXT
);

-- Working Hours
CREATE TABLE working_hours (
    working_hours_id INT  PRIMARY KEY identity,
    user_id INT,
    day VARCHAR(20),
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Support Tickets
CREATE TABLE support_tickets (
    ticket_id INT  PRIMARY KEY identity,
    user_id INT,
    subject VARCHAR(100),
    description TEXT,
    status varchar(30) ,
    created_at TIMESTAMP ,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Chats
CREATE TABLE chats (
    chat_id INT  PRIMARY KEY identity,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    timestamp TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

-- Emails
CREATE TABLE emails (
    email_id INT  PRIMARY KEY identity,
    from_user_id INT,
    to_user_id INT,
    subject VARCHAR(100),
    message TEXT,
    timestamp TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(user_id),
    FOREIGN KEY (to_user_id) REFERENCES users(user_id)
);

-- Contacts
CREATE TABLE contacts (
    contact_id INT  PRIMARY KEY identity,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP 
);

-- Insert Default Roles
INSERT INTO roles (role_name, description) VALUES 
('Admin', 'System Administrator with full access'),
('Doctor', 'Medical practitioner'),
('Nurse', 'Assists doctors and cares for patients'),
('Receptionist', 'Manages front desk operations'),
('Pharmacist', 'Handles prescription fulfillment'),
('Cashier', 'Manages patient billing'),
('Lab Technician', 'Handles diagnostics and test results');

-- Insert Default Admin User
INSERT INTO users (full_name, username, email, phone, password_hash, role_id, status)
VALUES (
  'System Administrator',
  'admin',
  'admin@erp.com',
  '0700000000',
  'admin123',
  1,
  'active'
);