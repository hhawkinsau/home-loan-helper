const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Prisma client properties:');
const props = Object.getOwnPropertyNames(prisma);
console.log(props.filter(p => !p.startsWith('_') && !p.startsWith('$')));

console.log('\nChecking specific models:');
console.log('user:', !!prisma.user);
console.log('serverSession:', !!prisma.serverSession);
console.log('passkey:', !!prisma.passkey);

prisma.$disconnect();
