const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixSiteSettings() {
  try {
    console.log('🔧 Fixing corrupted site settings...\n');
    
    // Fix/Create proper settings
    const properSettings = [
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
    
    for (const setting of properSettings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting
      });
      console.log(`✅ Fixed: ${setting.key}`);
    }
    
    console.log('\n🎉 All settings fixed successfully!');
    
    // Verify the fix
    console.log('\n🔍 Verifying fixed data...');
    const settings = await prisma.siteSetting.findMany();
    
    settings.forEach(setting => {
      console.log(`\n${setting.key}:`);
      console.log(JSON.stringify(setting.value, null, 2));
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSiteSettings();
