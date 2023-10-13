const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.$connect();
    await database.category.createMany({
      data: [
        {
          name: 'Words',
        },
        {
          name: 'Expressions',
        },
      ],
    });
    console.log('Successfully seeded the database');
  } catch (e) {
    console.log("Error seeding the database categories", e)
  } finally {
    await database.$disconnect();
  }
}

main()
// Execute the main function
// cli command -> node scripts\seed.ts