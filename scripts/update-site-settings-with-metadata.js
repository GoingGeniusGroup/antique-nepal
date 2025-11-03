const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateSiteSettingsWithMetadata() {
  try {
    console.log('🔧 Adding metadata to existing site settings...\n');
    
    // Define metadata for each setting
    const settingsMetadata = [
      {
        key: 'general',
        description: 'General site configuration including site name and logo',
        category: 'general'
      },
      {
        key: 'hero',
        description: 'Hero section content including title, subtitle, description and feature cards',
        category: 'homepage'
      },
      {
        key: 'banner',
        description: 'Top banner configuration and visibility settings',
        category: 'homepage'
      },
      {
        key: 'homepage',
        description: 'Homepage sections including featured collections and product highlights',
        category: 'homepage'
      },
      {
        key: 'footer',
        description: 'Footer content and copyright information',
        category: 'footer'
      }
    ];
    
    // Get current settings
    const currentSettings = await prisma.siteSetting.findMany();
    console.log(`Found ${currentSettings.length} existing settings`);
    
    // Update each setting with metadata (if the schema supports it)
    for (const metadata of settingsMetadata) {
      const existingSetting = currentSettings.find(s => s.key === metadata.key);
      
      if (existingSetting) {
        try {
          // Try to update with new fields (will work if migration was successful)
          await prisma.siteSetting.update({
            where: { key: metadata.key },
            data: {
              description: metadata.description,
              category: metadata.category,
              isActive: true
            }
          });
          console.log(`✅ Updated metadata for: ${metadata.key}`);
        } catch (error) {
          // If update fails, the new fields don't exist yet
          console.log(`⚠️  Schema not updated yet for: ${metadata.key}`);
        }
      }
    }
    
    console.log('\n📊 Current settings structure:');
    const updatedSettings = await prisma.siteSetting.findMany();
    updatedSettings.forEach(setting => {
      console.log(`\n${setting.key}:`);
      console.log(`  Category: ${setting.category || 'N/A'}`);
      console.log(`  Description: ${setting.description || 'N/A'}`);
      console.log(`  Active: ${setting.isActive !== undefined ? setting.isActive : 'N/A'}`);
      console.log(`  Value keys: ${Object.keys(setting.value).join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateSiteSettingsWithMetadata();
