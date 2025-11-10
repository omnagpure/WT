const express = require('express');
const dbConnect = require('./mongodb');
const app = express();

app.use(express.json());

// Schema validation helper function
function isValidProfile(obj) {
    return (
        typeof obj.name === 'string' && obj.name.trim().length > 0 &&
        typeof obj.email === 'string' && obj.email.trim().length > 0 &&
        typeof obj.city === 'string' && obj.city.trim().length > 0
    );
}

// GET: List all profiles (only valid schema fields)
app.get('/', async (req, res) => {
    const collection = await dbConnect();
    const result = await collection.find({}, { projection: { _id: 0, name: 1, email: 1, city: 1 } }).toArray();
    res.json({
        status: "success",
        count: result.length,
        profiles: result
    });
});

// POST: Insert a profile (strict schema)
app.post('/', async (req, res) => {
    if (!isValidProfile(req.body)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid schema. Required: name (string), email (string), city (string)."
        });
    }
    const collection = await dbConnect();
    const insertResult = await collection.insertOne({
        name: req.body.name,
        email: req.body.email,
        city: req.body.city
    });
    res.json({
        status: "success",
        profile: req.body,
        insertedId: insertResult.insertedId
    });
});

// PUT: Update profile by name (partial schema)
app.put('/:name', async (req, res) => {
    const allowed = {};
    if (typeof req.body.email === 'string') allowed.email = req.body.email;
    if (typeof req.body.city === 'string') allowed.city = req.body.city;
    if (Object.keys(allowed).length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Provide at least one field: email or city (string)."
        });
    }
    const collection = await dbConnect();
    const result = await collection.updateOne(
        { name: req.params.name },
        { $set: allowed }
    );
    res.json({
        status: result.modifiedCount > 0 ? "success" : "fail",
        message: result.modifiedCount > 0 ? "Profile updated." : "No such profile found.",
        updated: allowed
    });
});

// DELETE: Remove profile by name
app.delete('/:name', async (req, res) => {
    const collection = await dbConnect();
    const result = await collection.deleteOne({ name: req.params.name });
    res.json({
        status: result.deletedCount > 0 ? "success" : "fail",
        message: result.deletedCount > 0 ? "Profile deleted." : "No such profile found.",
        deleted: req.params.name
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});