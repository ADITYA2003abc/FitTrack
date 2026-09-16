import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function Analytics() {
    const workoutChartRef = useRef(null);
    const caloriesChartRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        async function loadAnalyticsData() {
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
                const workouts = workoutData.workouts || [];
const meals = nutritionData.meals || [];

                const workoutLabels = workouts.map(
                    (workout) => workout.date
                );

                const workoutVolumes = workouts.map(
                    (workout) =>
                        workout.sets *
                        workout.reps *
                        workout.weight
                );

                const calorieLabels = meals.map(
                    (meal) =>
                        meal.date ||
                        new Date(meal.createdAt).toLocaleDateString()
                );

                const calories = meals.map(
                    (meal) => meal.calories
                );

                const workoutChart = new Chart(
                    workoutChartRef.current,
                    {
                        type: "line",
                        data: {
                            labels: workoutLabels,
                            datasets: [
                                {
                                    label: "Workout Volume (kg)",
                                    data: workoutVolumes,
                                    borderWidth: 3,
                                    tension: 0.3,
                                    pointRadius: 5
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    }
                );

                const caloriesChart = new Chart(
                    caloriesChartRef.current,
                    {
                        type: "line",
                        data: {
                            labels: calorieLabels,
                            datasets: [
                                {
                                    label: "Calories (kcal)",
                                    data: calories,
                                    borderWidth: 3,
                                    tension: 0.3,
                                    pointRadius: 5
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    }
                );

                return () => {
                    workoutChart.destroy();
                    caloriesChart.destroy();
                };

            } catch (error) {
                console.log("Analytics error:", error);
            }
        }

        loadAnalyticsData();
    }, []);

    return (
        <section className="analytics-section">

            <h2>Fitness Analytics</h2>

            <div className="chart-card">
                <h3>Workout Analysis</h3>
                <div className="chart-container">
                    <canvas ref={workoutChartRef}></canvas>
                </div>
            </div>

            <div className="chart-card">
                <h3>Calories Analysis</h3>
                <div className="chart-container">
                    <canvas ref={caloriesChartRef}></canvas>
                </div>
            </div>

        </section>
    );
}

export default Analytics;