// controllers/billingController.js - Billing Management Controller

const Bill = require('../models/billingModel');
const Patient = require('../models/patientModel');
const Staff = require('../models/staffModel');
const PDFDocument = require('pdfkit');

// ===== GET ALL BILLS FUNCTION =====
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll();
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error.message);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

// ===== GET BILL BY ID FUNCTION =====
const getBillById = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error.message);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
};

// ===== CREATE BILL FUNCTION =====
const createBill = async (req, res) => {
  const { patient_id, amount, status, method_of_payment, service_name, service_id, received_by, paid_by, due_date } = req.body;
  if (!patient_id || !amount || !status || !method_of_payment || !service_name || !service_id || !received_by || !paid_by || !due_date) {
    return res.status(400).json({ message: 'Required bill data missing' });
  }
  try {
    const newBill = await Bill.create(req.body);
    res.status(201).json(newBill);
  } catch (error) {
    console.error('Error creating bill:', error.message);
    res.status(500).json({ error: 'Failed to create bill' });
  }
};

// ===== UPDATE BILL FUNCTION =====
const updateBill = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedBill = await Bill.update(id, req.body);
    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    let receipt = null;
    // If the bill is paid, create a receipt
    if (status === 'paid') {
      receipt = {
        patient_id: updatedBill.patient_id,
        bill_id: updatedBill.bill_id,
        doctor_name: 'Dr. Smith', // Placeholder for doctor's name
        total_amount: updatedBill.amount,
        items: [
          {
            name: 'Consultation & Medication',
            quantity: 1,
            price: updatedBill.amount,
          },
        ],
      };
    }

    res.json({ updatedBill, receipt });
  } catch (error) {
    console.error('Error updating bill:', error.message);
    res.status(500).json({ error: 'Failed to update bill' });
  }
};

// ===== DELETE BILL FUNCTION =====
const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await Bill.delete(id);
    if (!success) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error.message);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
};

const generateReceiptPdf = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    const patient = await Patient.findById(bill.patient_id);
    // Assuming the doctor is a staff member and the doctor_id is stored in the patient record
    const doctor = patient.doctor_id ? await Staff.getStaffById(patient.doctor_id) : { user_name: 'N/A' };

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename=receipt-${bill.bill_id}.pdf`,
      }).end(pdfData);
    });

    // Add content to the PDF
    doc.fontSize(25).text('Hospital Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Receipt ID: ${bill.bill_id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Patient: ${patient.full_name}`);
    doc.text(`Doctor: ${doctor.user_name}`);
    doc.moveDown();
    doc.text('--- Items ---');
    doc.text(`- Consultation & Medication: $${bill.amount}`);
    doc.moveDown();
    doc.fontSize(16).text(`Total: $${bill.amount}`, { align: 'right' });
    doc.end();

  } catch (error) {
    console.error('Error generating PDF receipt:', error.message);
    res.status(500).json({ error: 'Failed to generate PDF receipt' });
  }
};

module.exports = {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  generateReceiptPdf
};