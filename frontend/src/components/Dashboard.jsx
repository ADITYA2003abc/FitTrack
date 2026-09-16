import { useEffect, useState } from "react";
function Dashboard({ bmiData }) {
    const [workouts, setWorkouts] = useState(0);
    const [sets, setSets] = useState(0);
    const [volume, setVolume] = useState(0);
    const [calories, setCalories] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        async function loadDashboard() {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const workoutResponse = await fetch(
                    "https://fittrack-0hov.onrender.com/api/workouts",
                    {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    }
                );

                const nutritionResponse = await fetch(
                    "https://fittrack-0hov.onrender.com/api/nutrition",
                    {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    }
                );

                const workoutData = await workoutResponse.json();
                const nutritionData = await nutritionResponse.json();

                if (workoutResponse.ok) {
                    setWorkouts(workoutData.workouts.length);

                    let totalSets = 0;
                    let totalVolume = 0;

                    workoutData.workouts.forEach((workout) => {
                        totalSets += Number(workout.sets);
                        totalVolume +=
                            Number(workout.sets) *
                            Number(workout.reps) *
                            Number(workout.weight);
                    });

                    setSets(totalSets);
                    setVolume(totalVolume);

                    const dates = workoutData.workouts
    .map((workout) => workout.date)
    .filter(Boolean);
                    const uniqueDates = [...new Set(dates)];

                    setStreak(uniqueDates.length);
                }

                if (nutritionResponse.ok) {
                    let totalCalories = 0;

                    nutritionData.meals.forEach((meal) => {
                        totalCalories += Number(meal.calories);
                    });

                    setCalories(totalCalories);
                }

            } catch (error) {
                console.log("Dashboard error:", error);
            }
        }

        loadDashboard();
    }, []);

    return (
        <section className="dashboard">

            <h2>Fitness Dashboard</h2>

            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h3>Workouts</h3>
                    <p className="dashboard-value">
                        {workouts}
                    </p>
                    <span>All Workouts</span>
                </div>

                <div className="dashboard-card">
                    <h3>Total Sets</h3>
                    <p className="dashboard-value">
                        {sets}
                    </p>
                    <span>All Workouts</span>
                </div>

                <div className="dashboard-card">
                    <h3>Total Volume</h3>
                    <p className="dashboard-value">
                        {volume} kg
                    </p>
                    <span>All Workouts</span>
                </div>

                <div className="dashboard-card">
                    <h3>Calories</h3>
                    <p className="dashboard-value">
                        {calories} kcal
                    </p>
                    <span>Nutrition</span>
                </div>

                <div className="dashboard-card">
                    <h3>Weight</h3>
                   <p className="dashboard-value">
    {bmiData.weight !== null ? `${bmiData.weight} kg` : "--"}
</p>
                    <span>Current Weight</span>
                </div>

                <div className="dashboard-card">
                    <h3>BMI</h3>
                    <p className="dashboard-value">
    {bmiData.bmi !== null ? bmiData.bmi : "--"}
</p>

<span>
    {bmiData.status || "Calculate BMI"}
</span>
                </div>

                <div className="dashboard-card">
                    <h3>Workout Streak</h3>
                    <p className="dashboard-value">
                        {streak} days
                    </p>
                    <span>Current Streak 🔥</span>
                </div>

            </div>
        </section>
    );
}

export default Dashboard;