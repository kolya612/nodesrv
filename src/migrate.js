const Postgrator = require('postgrator');
const path = require('path');
//const config = require('./shared/config');

const postgrator = new Postgrator({
  driver: 'pg',
  migrationDirectory: path.resolve(__dirname, '../migrations'),
  connectionString: 'postgres://root:111111@database:5432/testdb',
  ssl: false,
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