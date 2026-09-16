import { useEffect, useState } from "react";

function Nutrition() {
    const [meal, setMeal] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fats, setFats] = useState("");

    const [meals, setMeals] = useState([]);

    async function loadMeals() {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/nutrition",
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMeals(data.meals);
            }

        } catch (error) {
            console.log("Load nutrition error:", error);
        }
    }

    useEffect(() => {
        loadMeals();
    }, []);

    async function handleAddMeal(event) {
        event.preventDefault();

        if (
            !meal ||
            !calories ||
            !protein ||
            !carbs ||
            !fats
        ) {
            alert("Please fill all nutrition details.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/nutrition",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        meal,
                        calories: Number(calories),
                        protein: Number(protein),
                        carbs: Number(carbs),
                        fats: Number(fats)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Meal added successfully!");

            setMeal("");
            setCalories("");
            setProtein("");
            setCarbs("");
            setFats("");

            loadMeals();

        } catch (error) {
            console.log("Nutrition error:", error);
            alert("Failed to add meal.");
        }
    }

    const totalCalories = meals.reduce(
        (total, item) => total + Number(item.calories),
        0
    );

    const totalProtein = meals.reduce(
        (total, item) => total + Number(item.protein),
        0
    );

    const totalCarbs = meals.reduce(
        (total, item) => total + Number(item.carbs),
        0
    );

    const totalFats = meals.reduce(
        (total, item) => total + Number(item.fats),
        0
    );

    return (
        <section id="nutrition" className="nutrition-section">

            <h2>Track Your Nutrition</h2>

            <div className="nutrition-form-card">

                <form onSubmit={handleAddMeal}>

                    <label htmlFor="meal">
                        Meal
                    </label>

                    <input
                        id="meal"
                        type="text"
                        placeholder="e.g. Breakfast"
                        value={meal}
                        onChange={(e) =>
                            setMeal(e.target.value)
                        }
                    />

                    <label htmlFor="calories">
                        Calories
                    </label>

                    <input
                        id="calories"
                        type="number"
                        placeholder="e.g. 500"
                        min="0"
                        value={calories}
                        onChange={(e) =>
                            setCalories(e.target.value)
                        }
                    />

                    <label htmlFor="protein">
                        Protein (g)
                    </label>

                    <input
                        id="protein"
                        type="number"
                        placeholder="e.g. 30"
                        min="0"
                        value={protein}
                        onChange={(e) =>
                            setProtein(e.target.value)
                        }
                    />

                    <label htmlFor="carbs">
                        Carbs (g)
                    </label>

                    <input
                        id="carbs"
                        type="number"
                        placeholder="e.g. 50"
                        min="0"
                        value={carbs}
                        onChange={(e) =>
                            setCarbs(e.target.value)
                        }
                    />

                    <label htmlFor="fats">
                        Fats (g)
                    </label>

                    <input
                        id="fats"
                        type="number"
                        placeholder="e.g. 15"
                        min="0"
                        value={fats}
                        onChange={(e) =>
                            setFats(e.target.value)
                        }
                    />

                    <button type="submit">
                        Add Meal
                    </button>

                </form>

                <div className="nutrition-totals">

                    <h3>Today's Nutrition</h3>

                    <p>
                        Total Calories:
                        <span>{totalCalories}</span> kcal
                    </p>

                    <p>
                        Total Protein:
                        <span>{totalProtein}</span> g
                    </p>

                    <p>
                        Total Carbs:
                        <span>{totalCarbs}</span> g
                    </p>

                    <p>
                        Total Fats:
                        <span>{totalFats}</span> g
                    </p>

                </div>

            </div>

            <div className="saved-meals">

                <h3>Saved Meals</h3>

                {meals.length === 0 ? (
                    <p className="no-meals">
                        No meals added yet.
                    </p>
                ) : (
                    meals.map((item) => (
                        <div
                            className="meal-item"
                            key={item._id}
                        >
                            <div className="meal-details">

                                <strong>
                                    {item.meal}
                                </strong>

                                <span>
                                    {item.calories} kcal
                                </span>

                                <span>
                                    Protein: {item.protein}g
                                </span>

                                <span>
                                    Carbs: {item.carbs}g
                                </span>

                                <span>
                                    Fats: {item.fats}g
                                </span>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </section>
    );
}

export default Nutrition;