import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/password.utils';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cricketglow.com' },
    update: {},
    create: {
      email: 'admin@cricketglow.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
    },
  });
  console.log('Admin user created:', admin.email);

  // Create test customer
  const customerPassword = await hashPassword('customer123');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'Test',
      lastName: 'Customer',
      role: Role.CUSTOMER,
    },
  });
  console.log('Customer user created:', customer.email);

  // Create categories
  const categories = [
    {
      name: 'Cricket Bats',
      description: 'Professional and beginner cricket bats',
      slug: 'cricket-bats',
      image: 'https://example.com/images/categories/bats.jpg',
    },
    {
      name: 'Cricket Balls',
      description: 'Match and practice cricket balls',
      slug: 'cricket-balls',
      image: 'https://example.com/images/categories/balls.jpg',
    },
    {
      name: 'Protective Gear',
      description: 'Helmets, pads, gloves and other protective equipment',
      slug: 'protective-gear',
      image: 'https://example.com/images/categories/protective-gear.jpg',
    },
    {
      name: 'Clothing',
      description: 'Cricket uniforms and apparel',
      slug: 'clothing',
      image: 'https://example.com/images/categories/clothing.jpg',
    },
    {
      name: 'Accessories',
      description: 'Cricket bags, stumps, and other accessories',
      slug: 'accessories',
      image: 'https://example.com/images/categories/accessories.jpg',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('Categories created');

  // Create subcategories
  const subcategories = [
    {
      name: 'English Willow',
      slug: 'english-willow',
      categorySlug: 'cricket-bats',
    },
    {
      name: 'Kashmir Willow',
      slug: 'kashmir-willow',
      categorySlug: 'cricket-bats',
    },
    {
      name: 'Junior Bats',
      slug: 'junior-bats',
      categorySlug: 'cricket-bats',
    },
    {
      name: 'Match Balls',
      slug: 'match-balls',
      categorySlug: 'cricket-balls',
    },
    {
      name: 'Practice Balls',
      slug: 'practice-balls',
      categorySlug: 'cricket-balls',
    },
    {
      name: 'Helmets',
      slug: 'helmets',
      categorySlug: 'protective-gear',
    },
    {
      name: 'Batting Pads',
      slug: 'batting-pads',
      categorySlug: 'protective-gear',
    },
    {
      name: 'Batting Gloves',
      slug: 'batting-gloves',
      categorySlug: 'protective-gear',
    },
    {
      name: 'Jerseys',
      slug: 'jerseys',
      categorySlug: 'clothing',
    },
    {
      name: 'Cricket Shoes',
      slug: 'cricket-shoes',
      categorySlug: 'clothing',
    },
    {
      name: 'Cricket Bags',
      slug: 'cricket-bags',
      categorySlug: 'accessories',
    },
    {
      name: 'Stumps',
      slug: 'stumps',
      categorySlug: 'accessories',
    },
  ];

  for (const subcategory of subcategories) {
    const category = await prisma.category.findUnique({
      where: { slug: subcategory.categorySlug },
    });

    if (category) {
      await prisma.subcategory.upsert({
        where: { slug: subcategory.slug },
        update: {},
        create: {
          name: subcategory.name,
          slug: subcategory.slug,
          categoryId: category.id,
        },
      });
    }
  }
  console.log('Subcategories created');

  // Create tags
  const tags = [
    'Featured',
    'New Arrival',
    'Best Seller',
    'Sale',
    'Premium',
    'Beginner',
    'Professional',
    'Junior',
    'Adult',
  ];

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
      },
    });
  }
  console.log('Tags created');

  // Create sample products
  // Note: In a real implementation, you would add more products with complete data
  const englishWillowCategory = await prisma.category.findUnique({
    where: { slug: 'cricket-bats' },
  });
  
  const englishWillowSubcategory = await prisma.subcategory.findUnique({
    where: { slug: 'english-willow' },
  });

  if (englishWillowCategory && englishWillowSubcategory) {
    const product = await prisma.product.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'Pro Cricket Bat - English Willow',
        description: 'Professional grade English willow bat with premium grip and perfect balance. Designed for competitive play and maximum performance.',
        price: 199.99,
        salePrice: 179.99,
        stock: 25,
        categoryId: englishWillowCategory.id,
        subcategoryId: englishWillowSubcategory.id,
        brand: 'CricketPro',
        rating: 4.8,
        reviewCount: 124,
        isNew: true,
        isFeatured: true,
      },
    });

    // Add product image
    await prisma.productImage.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        url: 'https://example.com/images/products/bat1.jpg',
        productId: product.id,
        isMain: true,
      },
    });

    // Add product specifications
    const specifications = [
      { key: 'Weight', value: '1.2kg' },
      { key: 'Handle', value: 'Premium Grip' },
      { key: 'Material', value: 'Grade A English Willow' },
      { key: 'Size', value: 'Full Size (SH)' },
    ];

    for (const spec of specifications) {
      await prisma.specification.create({
        data: {
          key: spec.key,
          value: spec.value,
          productId: product.id,
        },
      });
    }

    // Add product tags
    const featuredTag = await prisma.tag.findUnique({
      where: { name: 'Featured' },
    });

    const newArrivalTag = await prisma.tag.findUnique({
      where: { name: 'New Arrival' },
    });

    const professionalTag = await prisma.tag.findUnique({
      where: { name: 'Professional' },
    });

    if (featuredTag && newArrivalTag && professionalTag) {
      await prisma.productTag.createMany({
        data: [
          {
            productId: product.id,
            tagId: featuredTag.id,
          },
          {
            productId: product.id,
            tagId: newArrivalTag.id,
          },
          {
            productId: product.id,
            tagId: professionalTag.id,
          },
        ],
      });
    }
  }
  console.log('Sample product created');

  console.log('Database seeding completed');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
