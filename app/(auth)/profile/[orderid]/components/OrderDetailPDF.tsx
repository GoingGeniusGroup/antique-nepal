'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { Order, OrderItem, ProductVariant, Product, ProductImage, Address } from '@prisma/client';

// Define serializable types
type SerializableProduct = Omit<Product, "price" | "createdAt" | "updatedAt"> & {
    price: string;
    createdAt: string;
    updatedAt: string;
    images: ProductImage[];
  };
  
type SerializableProductVariant = Omit<
    ProductVariant,
    "price" | "weight" | "createdAt" | "updatedAt"
  > & {
    price: string | null;
    weight: string | null;
    createdAt: string;
    updatedAt: string;
    product: SerializableProduct;
  };
  
type SerializableOrderItem = Omit<
    OrderItem,
    "price" | "total" | "createdAt"
  > & {
    price: string;
    total: string;
    createdAt: string;
    productVariant: SerializableProductVariant;
  };
  
type SerializableOrder = Omit<
    Order,
    "subtotal" | "shippingCost" | "tax" | "total" | "createdAt" | "updatedAt"
  > & {
    subtotal: string;
    shippingCost: string;
    tax: string;
    total: string;
    createdAt: string;
    updatedAt: string;
    items: SerializableOrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
  };

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#F8F8F8',
        padding: 20,
        fontFamily: 'Helvetica',
    },
    card: {
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 20,
        borderBottom: '1px solid #E5E7EB',
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
    },
    cardContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderInfo: {
        flexDirection: 'column',
    },
    orderNumber: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 12,
        color: '#6B7280',
    },
    totalAmount: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: '#DC2626',
    },
    itemsGrid: {
        flexDirection: 'column',
    },
    itemRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #E5E7EB',
        paddingVertical: 15,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    itemDetails: {
        flexDirection: 'column',
        flexGrow: 1,
    },
    itemName: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 5,
    },
    itemVariant: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: '#DC2626',
        marginTop: 'auto',
    },
    addressSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    address: {
        width: '48%',
    },
    summaryContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    summary: {
        width: '50%',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
    },
    summaryTotal: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: '#DC2626',
    },
});

const OrderDetailPDF = ({ order }: { order: SerializableOrder }) => (
  <Document>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.title}>Order Details</Text>
        </View>

        {/* Order Header */}
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                        <Text style={styles.orderDate}>Ordered on {new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    </View>
                    <View>
                        <Text style={styles.totalAmount}>NPR {Number(order.total).toLocaleString()}</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* Items Ordered */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Items Ordered</Text>
            </View>
            <View style={styles.cardContent}>
                {order.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Image style={styles.itemImage} src={item.productVariant.product.images[0]?.url || "/product_placeholder.jpeg"} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.productName}</Text>
                            <Text style={styles.itemVariant}>Color: {item.productVariant.color || 'N/A'}, Size: {item.productVariant.size || 'N/A'}</Text>
                            <Text style={styles.itemVariant}>Quantity: {item.quantity}</Text>
                            <Text style={styles.itemPrice}>NPR {Number(item.price).toLocaleString()}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        <View style={styles.addressSection}>
            {/* Shipping Address */}
            <View style={[styles.card, styles.address]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Shipping Address</Text>
                </View>
                <View style={styles.cardContent}>
                    <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 5 }}>{order.shippingAddress.fullName}</Text>
                    <Text style={{ fontSize: 12 }}>{order.shippingAddress.addressLine1}</Text>
                    {order.shippingAddress.addressLine2 && <Text style={{ fontSize: 12 }}>{order.shippingAddress.addressLine2}</Text>}
                    <Text style={{ fontSize: 12 }}>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</Text>
                    <Text style={{ fontSize: 12 }}>{order.shippingAddress.country}</Text>
                    <Text style={{ fontSize: 12, marginTop: 10 }}>{order.shippingAddress.phone}</Text>
                </View>
            </View>

            {/* Order Summary */}
            <View style={[styles.card, styles.address]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Order Summary</Text>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>NPR {Number(order.subtotal).toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>NPR {Number(order.shippingCost).toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax</Text>
                        <Text style={styles.summaryValue}>NPR {Number(order.tax).toLocaleString()}</Text>
                    </View>
                    <View style={[styles.summaryRow, { borderTop: '1px solid #E5E7EB', paddingTop: 10, marginTop: 10 }]}>
                        <Text style={[styles.summaryLabel, { fontFamily: 'Helvetica-Bold' }]}>Total</Text>
                        <Text style={styles.summaryTotal}>NPR {Number(order.total).toLocaleString()}</Text>
                    </View>
                </View>
            </View>
        </View>
    </Page>
  </Document>
);

export default OrderDetailPDF;
