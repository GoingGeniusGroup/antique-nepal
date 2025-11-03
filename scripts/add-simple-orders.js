const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🛒 Adding simple orders...');

  // Get existing users and products
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  if (users.length === 0 || products.length === 0) {
    console.log('❌ No users or products found. Run seed-dummy-data.js first.');
    return;
  }

  // Create a simple address for orders
  const address = await prisma.address.create({
    data: {
      userId: users[0].id,
      type: 'BOTH',
      fullName: 'John Doe',
      phone: '+977-9841234567',
      addressLine1: 'Thamel, Kathmandu',
      city: 'Kathmandu',
      state: 'Bagmati',
      postalCode: '44600',
      country: 'Nepal',
      isDefault: true,
    },
  });

  // Create dummy orders
  const orders = [
    {
      orderNumber: 'ORD-2024-001',
      userId: users[0].id,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      subtotal: 2500.00,
      shippingCost: 100.00,
      tax: 325.00,
      total: 2925.00,
      shippingAddressId: address.id,
      billingAddressId: address.id,
    },
    {
      orderNumber: 'ORD-2024-002',
      userId: users[1].id,
      status: 'PROCESSING',
      paymentStatus: 'PAID',
      subtotal: 4300.00,
      shippingCost: 150.00,
      tax: 558.50,
      total: 5008.50,
      shippingAddressId: address.id,
      billingAddressId: address.id,
    },
    {
      orderNumber: 'ORD-2024-003',
      userId: users[0].id,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      subtotal: 1800.00,
      shippingCost: 100.00,
      tax: 247.00,
      total: 2147.00,
      shippingAddressId: address.id,
      billingAddressId: address.id,
    },
  ];

  for (const orderData of orders) {
    await prisma.order.create({
      data: orderData,
    });
  }

  console.log('✅ Created orders:', orders.length);
  console.log('🎉 Simple orders added successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error adding orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
