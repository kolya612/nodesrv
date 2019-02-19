const Postgrator = require('postgrator');
const config = require('./shared/config');

const postgrator = new Postgrator({
  driver: 'pg',
  migrationDirectory: '../migrations/',
  host: '127.0.0.1',
  port: 5432,
  database: 'testdb',
  username: 'root',
  password: '111111'
});

postgrator
    .migrate()
    .then(appliedMigrations => {
        if (!appliedMigrations.length) return;

        console.log('Applied migrations:');
        for (const migration of appliedMigrations) {
            console.log('-', migration.filename);
        }
    })
    .catch(error => {
        console.error('Migration failed:', error);
    });
