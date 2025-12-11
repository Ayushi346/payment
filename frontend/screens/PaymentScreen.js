import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { paymentAPI, customerAPI } from '../services/api';
import { validateAmount, formatCurrency, formatDate } from '../utils/validation';

const PaymentScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, setLoading, loading } = useAuth();
  const [customer, setCustomer] = useState(user);
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCustomerDetails();
  }, []);

  const loadCustomerDetails = async () => {
    if (!user?.account_number) return;

    try {
      setRefreshing(true);
      const response = await customerAPI.getCustomer(user.account_number);
      if (response.success) {
        setCustomer(response.data);
      }
    } catch (error) {
      console.error('Error loading customer:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    const amountError = validateAmount(amount);

    if (amountError) newErrors.amount = amountError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) {
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Do you want to proceed with payment of ${formatCurrency(parseFloat(amount))}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await paymentAPI.createPayment(
                customer.account_number,
                parseFloat(amount)
              );

              if (response.success) {
                Alert.alert('Success', 'Payment recorded successfully!', [
                  {
                    text: 'OK',
                    onPress: () => {
                      setAmount('');
                      loadCustomerDetails();
                    },
                  },
                ]);
              } else {
                Alert.alert('Error', response.message || 'Failed to process payment');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to process payment. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!customer) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadCustomerDetails} />
      }
    >
      <View style={styles.content}>
        <Card style={styles.customerCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>
            Customer Details
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{customer.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Number:</Text>
            <Text style={styles.detailValue}>{customer.account_number}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile:</Text>
            <Text style={styles.detailValue}>{customer.mobile}</Text>
          </View>
        </Card>

        <Card style={styles.loanCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>
            Loan Details
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>EMI Amount:</Text>
            <Text style={[styles.detailValue, styles.emiAmount]}>
              {formatCurrency(customer.emi_amount)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>EMI Due:</Text>
            <Text style={styles.detailValue}>{customer.emi_due}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Interest Rate:</Text>
            <Text style={styles.detailValue}>{customer.interest_rate}%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tenure:</Text>
            <Text style={styles.detailValue}>{customer.tenure} months</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Issue Date:</Text>
            <Text style={styles.detailValue}>{formatDate(customer.issue_date)}</Text>
          </View>
        </Card>

        <Card style={styles.paymentCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>
            Make Payment
          </Text>
          <Input
            label="Payment Amount"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              if (errors.amount) {
                setErrors({ ...errors, amount: null });
              }
            }}
            placeholder="Enter payment amount"
            keyboardType="decimal-pad"
            error={errors.amount}
          />
          <Text style={styles.hint}>
            Suggested EMI Amount: {formatCurrency(customer.emi_amount)}
          </Text>
          <Button
            title="Process Payment"
            onPress={handlePayment}
            loading={loading}
            style={styles.paymentButton}
          />
        </Card>

        <Button
          title="View Payment History"
          onPress={() => navigation.navigate('PaymentHistory')}
          variant="secondary"
          style={styles.historyButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  customerCard: {
    marginBottom: 16,
  },
  loanCard: {
    marginBottom: 16,
  },
  paymentCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  emiAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: -8,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  paymentButton: {
    marginTop: 8,
  },
  historyButton: {
    marginTop: 8,
  },
});

export default PaymentScreen;

