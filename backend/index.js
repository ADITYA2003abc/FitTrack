const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const workouts = [];
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("fittrack");
const workoutsCollection = db.collection("workouts");
const usersCollection = db.collection("users");
const nutritionCollection = db.collection("nutrition");
async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("MongoDB connection failed:", error);
    }
}

connectDB();

app.get("/", function(req, res) {
    res.send("FitTrack Backend is Running!");
});
app.get("/api/workouts",  authenticateToken, async function(req, res) {
    try {
        const workouts = await workoutsCollection
    .find({ userId: req.user.userId })
    .toArray();

        res.json({
            message: "Workouts fetched successfully!",
            workouts: workouts
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch workouts"
        });
    }
});
app.post("/api/register", async function(req, res) {

    try {

        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            name: name,
            email: email,
            password: hashedPassword
        };

        const result = await usersCollection.insertOne(user);

        res.json({
            message: "User registered successfully!",
            userId: result.insertedId
        });
        

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Registration failed"
        });

    }

});
app.post("/api/login", async function(req, res) {

    try {

        const { email, password } = req.body;

        const user = await usersCollection.findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(

    {
        userId: user._id,
        email: user.email,
        name: user.name
    },

    process.env.JWT_SECRET,

    {
        expiresIn: "7d"
    }

);
       res.json({
    message: "Login successful!",
    token: token,
    name: user.name
});
 } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Login failed"
        });

    }

});
function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, function(error, user) {

        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        req.user = user;

        next();
    });
}

// Get logged-in user's profile
app.get("/api/profile", authenticateToken, async function(req, res) {
    try {
        const user = await usersCollection.findOne(
            { _id: new ObjectId(req.user.userId) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            name: user.name,
            email: user.email
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch profile"
        });
    }
});



app.put("/api/workouts/:id",authenticateToken, async function(req, res) {
    try {
        const workoutId = req.params.id;
        const updatedWorkout = req.body;

       const result = await workoutsCollection.updateOne(
    {
        _id: new ObjectId(workoutId),
        userId: req.user.userId
    },
    {
        $set: updatedWorkout
    }
);

        res.json({
            message: "Workout updated successfully!",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update workout"
        });
    }
});
app.post("/api/workouts",authenticateToken, async function(req, res) {
    try {
        const workout = {
    ...req.body,
    userId: req.user.userId
};

        const result = await workoutsCollection.insertOne(workout);

        res.json({
            message: "Workout saved to MongoDB!",
            workoutId: result.insertedId
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to save workout"
        });
    }
});

app.delete("/api/workouts/:id", authenticateToken, async function(req, res) {
    try {
        const workoutId = req.params.id;

       const result = await workoutsCollection.deleteOne(
    {
        _id: new ObjectId(workoutId),
        userId: req.user.userId
    }
);

        res.json({
            message: "Workout deleted successfully!",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to delete workout"
        });
    }
}); 
app.post("/api/nutrition", authenticateToken, async function(req, res) {

    try {

        const meal = {
            ...req.body,
            userId: req.user.userId,
            date: new Date()
        };

        const result = await nutritionCollection.insertOne(meal);

        res.json({
            message: "Meal saved successfully!",
            mealId: result.insertedId
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to save meal"
        });

    }

});
app.get("/api/nutrition", authenticateToken, async function(req, res) {

    try {

        const meals = await nutritionCollection
            .find({ userId: req.user.userId })
            .toArray();

        res.json({
            message: "Nutrition fetched successfully!",
            meals: meals
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch nutrition"
        });

    }

});
app.listen(5000, function() {
    console.log("FitTrack server started on port 5000");
});