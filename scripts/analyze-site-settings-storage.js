const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function analyzeSiteSettingsStorage() {
  try {
    console.log('🔍 ANALYZING SITE SETTINGS STORAGE CAPACITY\n');
    console.log('='.repeat(50));
    
    // Get all current settings
    const settings = await prisma.siteSetting.findMany();
    
    console.log(`📊 Total Settings: ${settings.length}\n`);
    
    // Analyze each setting
    for (const setting of settings) {
      console.log(`🔑 KEY: ${setting.key.toUpperCase()}`);
      console.log(`📅 Last Updated: ${setting.updatedAt}`);
      
      // Analyze the JSON structure
      const value = setting.value;
      const jsonString = JSON.stringify(value);
      const jsonSize = new Blob([jsonString]).size;
      
      console.log(`📦 JSON Size: ${jsonSize} bytes`);
      console.log(`🏗️  Structure:`);
      
      // Recursively analyze structure
      analyzeJsonStructure(value, '  ');
      
      console.log(`✅ Storage Status: ${jsonSize < 1000000 ? 'OPTIMAL' : 'LARGE'}`);
      console.log('-'.repeat(40));
    }
    
    // Test storage capacity with our full dynamic content
    console.log('\n🧪 TESTING FULL DYNAMIC CONTENT STORAGE\n');
    
    const fullHeroContent = {
      title: 'ANTIQUE NEPAL - HANDCRAFTED HERITAGE BAGS',
      subtitle: 'Welcome to the finest collection of sustainable hemp bags crafted with centuries-old Himalayan traditions',
      description: 'Every bag tells a story of ancient wisdom meeting modern design. Our master artisans use traditional techniques passed down through generations, working with 100% organic hemp fiber sourced from the pristine Himalayan region. Each piece is adorned with authentic Nepali paper art and natural dyes, creating unique bags that embody both sustainability and cultural heritage. Experience the perfect blend of environmental consciousness and timeless craftsmanship.',
      backgroundImage: 'https://example.com/hero-bg-4k.jpg',
      features: {
        feature1: {
          title: '100% Eco-Friendly & Sustainable',
          description: 'Made from organic hemp fiber, completely biodegradable, supporting environmental conservation and sustainable fashion practices'
        },
        feature2: {
          title: 'Fair Trade & Ethical Production',
          description: 'Supporting local artisan communities with fair wages, safe working conditions, and preserving traditional craftsmanship heritage'
        },
        feature3: {
          title: 'Premium Quality & Durability',
          description: 'Handcrafted with 15+ years of expertise, using time-tested techniques that ensure maximum durability and unique character'
        }
      },
      ctaButtons: {
        primary: {
          text: 'Explore Our Heritage Collection',
          link: '/products',
          style: 'primary'
        },
        secondary: {
          text: 'Discover Our Artisan Story',
          link: '/about',
          style: 'outline'
        }
      }
    };
    
    const fullHomepageContent = {
      featuredTitle: 'FEATURED HERITAGE COLLECTION',
      featuredSubtitle: 'Discover Our Most Beloved Artisan Pieces',
      featuredDescription: 'Explore our handpicked selection of premium hemp bags, each representing the pinnacle of Himalayan craftsmanship and sustainable design philosophy',
      productHighlights: {
        title: 'Why Choose Our Handcrafted Hemp Bags',
        subtitle: 'Premium Quality Meets Environmental Responsibility',
        highlights: [
          {
            icon: 'leaf',
            title: 'Sustainable Materials',
            description: 'Made from 100% organic hemp, the most eco-friendly fiber on Earth'
          },
          {
            icon: 'users',
            title: 'Artisan Crafted',
            description: 'Each bag is individually handwoven by skilled Nepali artisans'
          },
          {
            icon: 'award',
            title: 'Cultural Heritage',
            description: 'Preserving centuries-old traditional weaving techniques'
          }
        ]
      },
      testimonials: {
        enabled: true,
        title: 'What Our Customers Say',
        items: [
          {
            name: 'Sarah Johnson',
            location: 'California, USA',
            text: 'The quality and craftsmanship is absolutely incredible. I love knowing my purchase supports artisan communities.',
            rating: 5
          }
        ]
      }
    };
    
    // Calculate sizes
    const heroSize = new Blob([JSON.stringify(fullHeroContent)]).size;
    const homepageSize = new Blob([JSON.stringify(fullHomepageContent)]).size;
    
    console.log(`🎯 Full Hero Content: ${heroSize} bytes`);
    console.log(`🏠 Full Homepage Content: ${homepageSize} bytes`);
    console.log(`📊 Total Dynamic Content: ${heroSize + homepageSize} bytes`);
    
    // PostgreSQL JSON field can store up to 1GB
    const postgresLimit = 1024 * 1024 * 1024; // 1GB
    const usagePercentage = ((heroSize + homepageSize) / postgresLimit * 100).toFixed(6);
    
    console.log(`\n✅ STORAGE ANALYSIS RESULT:`);
    console.log(`   PostgreSQL JSON Limit: ${(postgresLimit / 1024 / 1024).toFixed(0)} MB`);
    console.log(`   Our Usage: ${((heroSize + homepageSize) / 1024).toFixed(2)} KB`);
    console.log(`   Usage Percentage: ${usagePercentage}%`);
    console.log(`   Status: ${usagePercentage < 0.1 ? '🟢 EXCELLENT' : '🟡 GOOD'}`);
    
    console.log(`\n🎉 CONCLUSION: The current SiteSetting model with JSON field is PERFECT for storing all our dynamic content!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function analyzeJsonStructure(obj, indent = '') {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      console.log(`${indent}📋 Array (${obj.length} items)`);
    } else {
      const keys = Object.keys(obj);
      console.log(`${indent}📁 Object (${keys.length} properties):`);
      keys.forEach(key => {
        const value = obj[key];
        const type = typeof value;
        if (type === 'object' && value !== null) {
          console.log(`${indent}  ${key}:`);
          analyzeJsonStructure(value, indent + '    ');
        } else {
          const preview = type === 'string' && value.length > 30 
            ? value.substring(0, 30) + '...' 
            : value;
          console.log(`${indent}  ${key}: ${type} (${preview})`);
        }
      });
    }
  }
}

analyzeSiteSettingsStorage();
