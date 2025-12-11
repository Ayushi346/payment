import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/validation';

const PaymentHistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    if (!user?.account_number) return;

    try {
      setRefreshing(true);
      const response = await paymentAPI.getPaymentHistory(user.account_number);
      if (response.success) {
        setPayments(response.data);
      }
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'partial':
        return '#FF9800';
      case 'pending':
        return '#2196F3';
      case 'failed':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading payment history...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadPaymentHistory} />
      }
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Payment History
        </Text>
        <Text style={styles.subtitle}>
          Account: {user?.account_number}
        </Text>

        {payments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No payment history found</Text>
          </Card>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <Text style={styles.paymentAmount}>
                  {formatCurrency(payment.amount)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(payment.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusLabel(payment.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentDate}>
                  {formatDate(payment.payment_date)}
                </Text>
                <Text style={styles.paymentId}>ID: {payment.id}</Text>
              </View>
            </Card>
          ))
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  paymentCard: {
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
  },
  paymentId: {
    fontSize: 12,
    color: '#999',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default PaymentHistoryScreen;

