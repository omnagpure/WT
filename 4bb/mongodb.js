const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017';
const database = 'student';

async function dbConnect() {
    const client = await mongodb.MongoClient.connect(url);
    const db = client.db(database);
    return db.collection('profile');
}

module.exports = dbConnect;