const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /payments - Create a new payment
router.post('/', async (req, res) => {
  try {
    const { customer_account_number, amount } = req.body;

    // Validation
    if (!customer_account_number || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Customer account number and amount are required'
      });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Verify customer exists
    const [customerRows] = await db.execute(
      'SELECT * FROM Customers WHERE account_number = ?',
      [customer_account_number]
    );

    if (customerRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customer = customerRows[0];
    const paymentAmount = parseFloat(amount);
    const paymentDate = new Date().toISOString().split('T')[0];
    
    // Determine payment status (you can add business logic here)
    // For example: if payment >= emi_amount, status = 'completed', else 'partial'
    const status = paymentAmount >= customer.emi_amount ? 'completed' : 'partial';

    // Insert payment
    const [result] = await db.execute(
      'INSERT INTO Payments (customer_account_number, amount, payment_date, status) VALUES (?, ?, ?, ?)',
      [customer_account_number, paymentAmount, paymentDate, status]
    );

    // Update customer's emi_due if payment is completed
    if (status === 'completed') {
      await db.execute(
        'UPDATE Customers SET emi_due = emi_due - 1 WHERE account_number = ?',
        [customer_account_number]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: {
        id: result.insertId,
        customer_account_number,
        amount: paymentAmount,
        payment_date: paymentDate,
        status
      }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /payments/:accountNumber - Get payment history for a customer
router.get('/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;

    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Account number is required'
      });
    }

    const [rows] = await db.execute(
      'SELECT * FROM Payments WHERE customer_account_number = ? ORDER BY payment_date DESC, id DESC',
      [accountNumber]
    );

    res.json({
      success: true,
      data: rows.map(payment => ({
        id: payment.id,
        customer_account_number: payment.customer_account_number,
        amount: parseFloat(payment.amount),
        payment_date: payment.payment_date,
        status: payment.status
      }))
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

