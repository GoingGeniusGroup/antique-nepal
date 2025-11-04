import { PrismaClient } from '@prisma/client';
import footerData from '../data/footer.json';

const prisma = new PrismaClient();

async function seedFooter() {
  console.log('🌱 Seeding footer data...');

  try {
    // Seed Footer Brand
    console.log('Creating footer brand...');
    const brand = await prisma.footerBrand.create({
      data: {
        name: footerData.brand.name,
        logo: footerData.brand.logo,
        tagline: footerData.brand.tagline,
        description: footerData.brand.description,
        isActive: true,
      },
    });
    console.log('✅ Footer brand created:', brand.name);

    // Seed Footer Socials
    console.log('Creating footer socials...');
    for (const social of footerData.social) {
      await prisma.footerSocial.create({
        data: {
          name: social.name,
          icon: social.icon,
          href: social.href,
          displayOrder: social.id,
          isActive: true,
        },
      });
    }
    console.log(`✅ Created ${footerData.social.length} social links`);

    // Seed Footer Contact
    console.log('Creating footer contact...');
    const contact = await prisma.footerContact.create({
      data: {
        email: footerData.contact.email,
        phone: footerData.contact.phone,
        address: footerData.contact.address,
        isActive: true,
      },
    });
    console.log('✅ Footer contact created');

    // Seed Footer Newsletter
    console.log('Creating footer newsletter...');
    const newsletter = await prisma.footerNewsletter.create({
      data: {
        title: footerData.newsletter.title,
        description: footerData.newsletter.description,
        isActive: true,
      },
    });
    console.log('✅ Footer newsletter created');

    // Seed Footer Sections and Links
    console.log('Creating footer sections and links...');
    for (const section of footerData.sections) {
      const createdSection = await prisma.footerSection.create({
        data: {
          title: section.title,
          displayOrder: section.id,
          isActive: true,
        },
      });

      // Create links for this section
      for (const link of section.links) {
        await prisma.footerLink.create({
          data: {
            sectionId: createdSection.id,
            name: link.name,
            href: link.href,
            displayOrder: link.id,
            isActive: true,
          },
        });
      }
    }
    console.log(`✅ Created ${footerData.sections.length} sections with their links`);

    console.log('\n🎉 Footer data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding footer:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedFooter()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
