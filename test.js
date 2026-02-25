import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/IremeCorner'
});

client.connect()
  .then(() => {
    console.log('✅ PostgreSQL connected successfully!');
    return client.end();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection failed:', err);
  });
