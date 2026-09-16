import { useEffect, useState } from "react";

function Workout() {
    const [exercise, setExercise] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");

    const [workouts, setWorkouts] = useState([]);

    async function loadWorkouts() {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/workouts",
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setWorkouts(data.workouts);
            }
        } catch (error) {
            console.log("Load workouts error:", error);
        }
    }

    useEffect(() => {
        loadWorkouts();
    }, []);

    async function handleAddWorkout(event) {
        event.preventDefault();

        if (!exercise || !sets || !reps || !weight || !date) {
            alert("Please fill all workout details.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/workouts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        exercise,
                        sets: Number(sets),
                        reps: Number(reps),
                        weight: Number(weight),
                        date
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Workout added successfully!");

            setExercise("");
            setSets("");
            setReps("");
            setWeight("");
            setDate("");

            loadWorkouts();

        } catch (error) {
            console.log("Workout error:", error);
            alert("Failed to add workout.");
        }
    }

   async function handleEdit(workout) {
    const newSets = prompt(
        "Enter new sets (leave blank to keep current):",
        workout.sets
    );

    const newReps = prompt(
        "Enter new reps (leave blank to keep current):",
        workout.reps
    );

    const newWeight = prompt(
        "Enter new weight (leave blank to keep current):",
        workout.weight
    );

    const updatedSets =
        newSets.trim() === ""
            ? workout.sets
            : Number(newSets);

    const updatedReps =
        newReps.trim() === ""
            ? workout.reps
            : Number(newReps);

    const updatedWeight =
        newWeight.trim() === ""
            ? workout.weight
            : Number(newWeight);

    if (
        updatedSets <= 0 ||
        updatedReps <= 0 ||
        updatedWeight < 0 ||
        Number.isNaN(updatedSets) ||
        Number.isNaN(updatedReps) ||
        Number.isNaN(updatedWeight)
    ) {
        alert("Please enter valid values.");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            "http://localhost:5000/api/workouts/" + workout._id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    sets: updatedSets,
                    reps: updatedReps,
                    weight: updatedWeight
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Workout updated successfully!");

        loadWorkouts();

    } catch (error) {
        console.log("Edit error:", error);
        alert("Failed to update workout.");
    }
}
       

    async function handleDelete(workoutId) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this workout?"
        );

        if (!confirmDelete) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/workouts/" + workoutId,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Workout deleted successfully!");

            loadWorkouts();

        } catch (error) {
            console.log("Delete error:", error);
            alert("Failed to delete workout.");
        }
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    return (
        <section id="workout" className="workout-section">

            <h2>Log Your Workout</h2>

            <div className="workout-layout">

                <div className="workout-image">
                    <img
                        src="/images/workout-weight.jpg"
                        alt="Gym weight plate"
                    />
                </div>

                <div className="workout-form-card">

                    <form onSubmit={handleAddWorkout}>

                        <label htmlFor="exercise">
                            Exercise
                        </label>

                        <input
                            id="exercise"
                            type="text"
                            placeholder="e.g. Bench Press"
                            value={exercise}
                            onChange={(e) =>
                                setExercise(e.target.value)
                            }
                        />

                        <label htmlFor="sets">
                            Sets
                        </label>

                        <input
                            id="sets"
                            type="number"
                            placeholder="e.g. 3"
                            min="1"
                            value={sets}
                            onChange={(e) =>
                                setSets(e.target.value)
                            }
                        />

                        <label htmlFor="reps">
                            Reps
                        </label>

                        <input
                            id="reps"
                            type="number"
                            placeholder="e.g. 10"
                            min="1"
                            value={reps}
                            onChange={(e) =>
                                setReps(e.target.value)
                            }
                        />

                        <label htmlFor="workout-weight">
                            Weight (kg)
                        </label>

                        <input
                            id="workout-weight"
                            type="number"
                            placeholder="e.g. 50"
                            min="0"
                            value={weight}
                            onChange={(e) =>
                                setWeight(e.target.value)
                            }
                        />

                        <label htmlFor="workout-date">
                            Date
                        </label>

                        <input
                            id="workout-date"
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                        />

                        <button type="submit">
                            Add Workout
                        </button>

                    </form>

                </div>

            </div>

            <div className="saved-workouts">

                <h3>Saved Workouts</h3>

                {workouts.length === 0 ? (
                    <p className="no-workouts">
                        No workouts added yet.
                    </p>
                ) : (
                    workouts.map((workout) => (
                        <div
                            className="workout-item"
                            key={workout._id}
                        >
                            <div className="workout-details">

                                <strong>
                                    {workout.exercise}
                                </strong>

                                <span>
                                    {workout.sets} sets ×{" "}
                                    {workout.reps} reps
                                </span>

                                <span>
                                    {workout.weight} kg
                                </span>

                                <span>
                                    {formatDate(workout.date)}
                                </span>

                            </div>

                            <div className="workout-actions">

                                <button
                                    onClick={() =>
                                        handleEdit(workout)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(workout._id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </section>
    );
}

export default Workout;