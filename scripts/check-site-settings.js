const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSiteSettings() {
  try {
    console.log('🔍 Checking site_settings table...\n');
    
    // Get all settings
    const settings = await prisma.siteSetting.findMany();
    
    console.log('📊 Current settings in database:');
    console.log('================================');
    
    settings.forEach(setting => {
      console.log(`Key: ${setting.key}`);
      console.log(`Value:`, setting.value);
      console.log(`Updated: ${setting.updatedAt}`);
      console.log('---');
    });
    
    if (settings.length === 0) {
      console.log('❌ No settings found in database');
      console.log('\n🔧 Creating default settings...');
      
      // Create default settings
      const defaultSettings = [
        {
          key: 'general',
          value: {
            siteName: 'Antique Nepal',
            logo: 'https://example.com/logo.png'
          }
        },
        {
          key: 'hero',
          value: {
            title: 'ANTIQUE NEPAL',
            subtitle: 'Welcome to best website',
            description: 'Every bag tells a story. Crafted by master artisans using centuries-old techniques, sustainable hemp, and adorned with traditional Nepali paper art. Experience the perfect blend of ancient wisdom and modern design.',
            features: {
              feature1: {
                title: '100% Eco-Friendly',
                description: 'Sustainable hemp fiber'
              },
              feature2: {
                title: 'Fair Trade',
                description: 'Supporting local artisans'
              },
              feature3: {
                title: 'Quality Crafted',
                description: '15+ years tradition'
              }
            }
          }
        },
        {
          key: 'banner',
          value: {
            text: '100% Sustainable • Handcrafted in Nepal • Est. 2010',
            isVisible: true
          }
        },
        {
          key: 'homepage',
          value: {
            featuredTitle: 'FEATURED COLLECTION',
            featuredSubtitle: 'Discover Our Best Sellers',
            featuredDescription: 'Discover our most beloved pieces, each crafted with centuries of tradition',
            productHighlights: {
              title: 'Why Choose Our Products',
              subtitle: 'Premium Quality & Sustainable'
            }
          }
        },
        {
          key: 'footer',
          value: {
            text: '© 2024 Antique Nepal. All rights reserved.'
          }
        }
      ];
      
      for (const setting of defaultSettings) {
        await prisma.siteSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: setting
        });
        console.log(`✅ Created/Updated: ${setting.key}`);
      }
      
      console.log('\n🎉 Default settings created successfully!');
    } else {
      console.log(`\n✅ Found ${settings.length} settings in database`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSiteSettings();
