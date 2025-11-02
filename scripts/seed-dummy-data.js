const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding dummy data...');

  // Create dummy users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+977-9841234567',
        role: 'CUSTOMER',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+977-9851234567',
        role: 'CUSTOMER',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@antiqueNepal.com' },
      update: {},
      create: {
        email: 'admin@antiqueNepal.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+977-9861234567',
        role: 'ADMIN',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created users:', users.length);

  // Create dummy products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'HB-001' },
      update: {},
      create: {
        name: 'Handwoven Hemp Tote Bag',
        slug: 'handwoven-hemp-tote-bag',
        sku: 'HB-001',
        price: 2500.00,
        description: 'Beautiful handwoven hemp tote bag made by local artisans',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'HB-002' },
      update: {},
      create: {
        name: 'Traditional Dhaka Crossbody Bag',
        slug: 'traditional-dhaka-crossbody-bag',
        sku: 'HB-002',
        price: 1800.00,
        description: 'Authentic Dhaka fabric crossbody bag with traditional patterns',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'HB-003' },
      update: {},
      create: {
        name: 'Vintage Leather Messenger Bag',
        slug: 'vintage-leather-messenger-bag',
        sku: 'HB-003',
        price: 3200.00,
        description: 'Premium vintage leather messenger bag with brass fittings',
        isActive: false,
      },
    }),
  ]);

  console.log('✅ Created products:', products.length);

  console.log('⏭️ Skipping orders for now (requires addresses setup)');

  // Create some site settings
  await prisma.siteSetting.upsert({
    where: { key: 'general' },
    update: {},
    create: {
      key: 'general',
      value: JSON.stringify({
        siteName: 'Antique Nepal',
        logo: 'https://example.com/logo.png'
      }),
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: 'hero' },
    update: {},
    create: {
      key: 'hero',
      value: JSON.stringify({
        title: 'Handcrafted Hemp Bags',
        subtitle: 'Woven with Himalayan Heritage'
      }),
    },
  });

  console.log('✅ Created site settings');

  console.log('🎉 Dummy data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
