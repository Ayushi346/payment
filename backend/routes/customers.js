const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /customers/login - Verify customer credentials
router.post('/login', async (req, res) => {
  try {
    const { account_number, mobile } = req.body;

    // Validation
    if (!account_number || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Account number and mobile number are required'
      });
    }

    // Query database
    const [rows] = await db.execute(
      'SELECT * FROM Customers WHERE account_number = ? AND mobile = ?',
      [account_number, mobile]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid account number or mobile number'
      });
    }

    const customer = rows[0];
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        account_number: customer.account_number,
        name: customer.name,
        mobile: customer.mobile,
        emi_due: customer.emi_due,
        emi_amount: customer.emi_amount,
        interest_rate: customer.interest_rate,
        issue_date: customer.issue_date,
        tenure: customer.tenure
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /customers/:accountNumber - Get customer details
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
      'SELECT * FROM Customers WHERE account_number = ?',
      [accountNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customer = rows[0];
    res.json({
      success: true,
      data: {
        account_number: customer.account_number,
        name: customer.name,
        mobile: customer.mobile,
        emi_due: customer.emi_due,
        emi_amount: customer.emi_amount,
        interest_rate: customer.interest_rate,
        issue_date: customer.issue_date,
        tenure: customer.tenure
      }
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

