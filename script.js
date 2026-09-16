console.log("FitTrack JavaScript is working!");


let username = "Aditya Raj";
let age = 23;
let isworkoutcompleted = true;

console.log(username);
console.log(age);
console.log(isworkoutcompleted);
const appName = "FitTrack";

console.log(appName);
let calories = 2000;

console.log(calories + 500);
console.log(calories - 300);
console.log(calories * 2);
console.log(calories / 2);
console.log(17 % 5);
console.log(2 ** 4);


const result = document.getElementById("bmi-result");


const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const calculateButton = document.getElementById("calculate-bmi");
const exerciseInput = document.getElementById("exercise");
const setsInput = document.getElementById("sets");
const repsInput = document.getElementById("reps");
const workoutWeightInput = document.getElementById("workout-weight");
const workoutDateInput = document.getElementById("workout-date");
const addWorkoutButton = document.getElementById("add-workout");
const workoutList = document.getElementById("workout-list");
const totalWorkoutsElement = document.getElementById("total-workouts");
const totalSetsElement = document.getElementById("total-sets");
const totalVolumeElement = document.getElementById("total-volume");
const mealInput = document.getElementById("meal");
const caloriesInput = document.getElementById("calories");
const registerForm = document.getElementById("register-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const logoutButton = document.getElementById("logout-button");
const dropdownUserName = document.getElementById("dropdown-user-name");
const dropdownUserEmail = document.getElementById("dropdown-user-email");
const myProfileButton = document.getElementById("my-profile-button");
const profileModal = document.getElementById("profile-modal");
const closeProfileModal = document.getElementById("close-profile-modal");
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");




const profileButton = document.getElementById("profile-button");
const profileDropdown = document.getElementById("profile-dropdown");
const proteinInput = document.getElementById("protein");
const carbsInput = document.getElementById("carbs");
const fatsInput = document.getElementById("fats");
const addMealButton = document.getElementById("add-meal");
const nutritionList = document.getElementById("nutrition-list");
const totalCaloriesElement = document.getElementById("total-calories");
const totalProteinElement = document.getElementById("total-protein");
const totalCarbsElement = document.getElementById("total-carbs");
const totalFatsElement = document.getElementById("total-fats");
const dashboardCaloriesElement = document.getElementById("dashboard-calories");
const workoutStreakElement = document.getElementById("workout-streak");
const welcomeMessageElement = document.getElementById("welcome-message");
const dashboardBMIElement = document.getElementById("dashboard-bmi");
const dashboardBMIStatusElement = document.getElementById("dashboard-bmi-status");
const dashboardWeightElement = document.getElementById("dashboard-weight");
let workoutVolumeChart = null;
let caloriesChart = null;
const meals = [];







const savedMeals = localStorage.getItem("meals");

if (savedMeals) {
    meals.push(...JSON.parse(savedMeals));
}





addMealButton.addEventListener("click", async function() {

    const meal = mealInput.value;
    const calories = Number(caloriesInput.value);
    const protein = Number(proteinInput.value);
    const carbs = Number(carbsInput.value);
    const fats = Number(fatsInput.value);

    if (!meal || calories < 0 || protein < 0 || carbs < 0 || fats < 0) {
        alert("Please enter valid nutrition details.");
        return;
    }

    const mealData = {
        meal: meal,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fats: fats,
        date: new Date().toISOString().split("T")[0]
    };

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/nutrition", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(mealData)
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Meal saved successfully!");

        mealInput.value = "";
        caloriesInput.value = "";
        proteinInput.value = "";
        carbsInput.value = "";
        fatsInput.value = "";

        getNutritionFromBackend();

    } catch (error) {

        console.log("Nutrition error:", error);
        alert("Failed to save meal.");

    }

});


async function getNutritionFromBackend() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/nutrition", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        console.log("Nutrition data:", data);

       

        meals.length = 0;
meals.push(...data.meals);

displayNutritionMeals(data.meals);

createCaloriesChart(data.meals);

calculateWeeklyStats();

    } catch (error) {

        console.log("Nutrition fetch error:", error);

    }

}


function displayNutritionMeals(meals) {

    nutritionList.innerHTML = "";

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    meals.forEach(function(meal) {

        totalCalories += meal.calories;
        totalProtein += meal.protein;
        totalCarbs += meal.carbs;
        totalFats += meal.fats;

        const mealItem = document.createElement("div");

        mealItem.textContent =
            meal.meal + " - " +
            meal.calories + " kcal - " +
            meal.protein + "g protein - " +
            meal.carbs + "g carbs - " +
            meal.fats + "g fats";

        nutritionList.appendChild(mealItem);

    });

    totalCaloriesElement.textContent = totalCalories;
    totalProteinElement.textContent = totalProtein;
    totalCarbsElement.textContent = totalCarbs;
    totalFatsElement.textContent = totalFats;
    dashboardCaloriesElement.textContent = totalCalories + " kcal";

}
const workouts = [];

displayWorkouts();
calculateWorkoutStats();
createWorkoutVolumeChart();
createCaloriesChart(meals);

const token = localStorage.getItem("token");

if (token) {
    getWorkoutsFromBackend();
    getNutritionFromBackend();
}



calculateButton.addEventListener("click", function() {

    console.log("Calculate button clicked!");

    const height = Number(heightInput.value);
    const weight = Number(weightInput.value);

    if (!height || !weight || height <= 0 || weight <= 0) {
        result.textContent = "Please enter valid height and weight.";
        return;
    }

    console.log(height);
    console.log(weight);

    const bmi = calculateBMI(weight, height);
    const roundedBMI = bmi.toFixed(1);

    dashboardBMIElement.textContent = roundedBMI;
    dashboardWeightElement.textContent = weight + " kg";

    result.className = "";

    if (bmi < 18.5) {

        result.className = "bmi-underweight";
        result.textContent = "Your BMI is: " + roundedBMI + " - Underweight";
        dashboardBMIStatusElement.textContent = "Underweight";

    } else if (bmi < 25) {

        result.className = "bmi-normal";
        result.textContent = "Your BMI is: " + roundedBMI + " - Normal";
        dashboardBMIStatusElement.textContent = "Normal";

    } else if (bmi < 30) {

        result.className = "bmi-overweight";
        result.textContent = "Your BMI is: " + roundedBMI + " - Overweight";
        dashboardBMIStatusElement.textContent = "Overweight";

    } else {

        result.className = "bmi-obese";
        result.textContent = "Your BMI is: " + roundedBMI + " - Obese";
        dashboardBMIStatusElement.textContent = "Obese";
    }

    console.log(bmi);

});
addWorkoutButton.addEventListener("click", function() {

    const exercise = exerciseInput.value;
    const sets = Number(setsInput.value);
    const reps = Number(repsInput.value);
    const workoutWeight = Number(workoutWeightInput.value);
    const workoutDate = workoutDateInput.value;

    if (!exercise || sets <= 0 || reps <= 0 || workoutWeight < 0 || !workoutDate) {
        alert("Please enter valid workout details.");
        return;
    }

    const workout = {
        exercise: exercise,
        sets: sets,
        reps: reps,
        weight: workoutWeight,
        date: workoutDate
    };

    console.log(workout);

    workouts.push(workout);
    

    displayWorkouts();
    calculateWorkoutStats();
createWorkoutVolumeChart();
    saveWorkoutToBackend(workout);

    exerciseInput.value = "";
    setsInput.value = "";
    repsInput.value = "";
    workoutWeightInput.value = "";

});


function calculateBMI(weight, heightCm) {
    const heightInMeters = heightCm / 100;
    return weight / (heightInMeters ** 2);
}
function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
function calculateWorkoutStats() {
    const totalWorkouts = workouts.length;

    console.log("Total workouts:", totalWorkouts);
    totalWorkoutsElement.textContent = totalWorkouts;
    let totalSets = 0;

workouts.forEach(function(workout) {
    totalSets = totalSets + workout.sets;
});

console.log("Total sets:", totalSets);
totalSetsElement.textContent = totalSets;
let totalVolume = 0;

workouts.forEach(function(workout) {
    totalVolume = totalVolume + (workout.sets * workout.reps * workout.weight);
});

console.log("Total volume:", totalVolume);
totalVolumeElement.textContent = totalVolume + " kg";
let heaviestWeight = 0;

workouts.forEach(function(workout) {
    if (workout.weight > heaviestWeight) {
        heaviestWeight = workout.weight;
    }
});

console.log("Heaviest weight:", heaviestWeight);
}
function calculateWeeklyStats() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    const weeklyWorkouts = workouts.filter(function(workout) {

        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);

        return workoutDate >= weekStart && workoutDate <= today;
    });

    const weeklyWorkoutCount = weeklyWorkouts.length;

    let weeklySets = 0;
    let weeklyVolume = 0;

    weeklyWorkouts.forEach(function(workout) {

        weeklySets += workout.sets;

        weeklyVolume +=
            workout.sets * workout.reps * workout.weight;
    });

    const weeklyMeals = meals.filter(function(meal) {

        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);

        return mealDate >= weekStart && mealDate <= today;
    });

    let weeklyCalories = 0;

    weeklyMeals.forEach(function(meal) {
        weeklyCalories += meal.calories;
    });

    document.getElementById("weekly-workouts").textContent =
        weeklyWorkoutCount;

    document.getElementById("weekly-sets").textContent =
        weeklySets;

    document.getElementById("weekly-volume").textContent =
        weeklyVolume + " kg";

    document.getElementById("weekly-calories").textContent =
        weeklyCalories + " kcal";
}


function calculateWorkoutStreak() {

    if (workouts.length === 0) {
        workoutStreakElement.textContent = "0 days";
        return;
    }

    const dates = workouts.map(function(workout) {
        return workout.date;
    });

    const uniqueDates = [...new Set(dates)];

    uniqueDates.sort(function(a, b) {
        return new Date(b) - new Date(a);
    });

    const latestDate = new Date(uniqueDates[0]);
    const today = new Date();

    latestDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysSinceLatestWorkout =
        (today - latestDate) / (1000 * 60 * 60 * 24);

    if (daysSinceLatestWorkout > 1) {
        workoutStreakElement.textContent = "0 days";
        return;
    }

    let streak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {

        const currentDate = new Date(uniqueDates[i]);
        const previousDate = new Date(uniqueDates[i + 1]);

        const difference =
            (currentDate - previousDate) / (1000 * 60 * 60 * 24);

        if (difference === 1) {
            streak++;
        } else {
            break;
        }
    }

    workoutStreakElement.textContent =
        streak + (streak === 1 ? " day" : " days");
}



function displayWorkouts() {
    


    workoutList.innerHTML = "";

    workouts.forEach(function(workout, index) {

        const workoutItem = document.createElement("div");

       workoutItem.textContent =
    workout.exercise + " - " +
    workout.sets + " sets × " +
    workout.reps + " reps - " +
    workout.weight + " kg - " +
    formatDate(workout.date);

        
const editButton = document.createElement("button");
editButton.textContent = "Edit";



editButton.addEventListener("click", async function() {

    const choice = prompt(
        "What do you want to edit?\n\n1. Sets\n2. Reps\n3. Weight\n4. All"
    );

    if (choice === null) {
        return;
    }

    let newSets = workout.sets;
    let newReps = workout.reps;
    let newWeight = workout.weight;

    if (choice === "1") {

        const value = prompt("Enter new sets:", workout.sets);

        if (value === null) {
            return;
        }

        newSets = Number(value);

    } else if (choice === "2") {

        const value = prompt("Enter new reps:", workout.reps);

        if (value === null) {
            return;
        }

        newReps = Number(value);

    } else if (choice === "3") {

        const value = prompt("Enter new weight:", workout.weight);

        if (value === null) {
            return;
        }

        newWeight = Number(value);

    } else if (choice === "4") {

        const setsValue = prompt("Enter new sets:", workout.sets);

        if (setsValue === null) {
            return;
        }

        const repsValue = prompt("Enter new reps:", workout.reps);

        if (repsValue === null) {
            return;
        }

        const weightValue = prompt("Enter new weight:", workout.weight);

        if (weightValue === null) {
            return;
        }

        newSets = Number(setsValue);
        newReps = Number(repsValue);
        newWeight = Number(weightValue);

    } else {

        alert("Please select 1, 2, 3 or 4.");
        return;
    }

    if (
        !Number.isFinite(newSets) ||
        !Number.isFinite(newReps) ||
        !Number.isFinite(newWeight) ||
        newSets <= 0 ||
        newReps <= 0 ||
        newWeight < 0
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
                    sets: newSets,
                    reps: newReps,
                    weight: newWeight
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to update workout.");
            return;
        }

        workout.sets = newSets;
        workout.reps = newReps;
        workout.weight = newWeight;

        displayWorkouts();
        calculateWorkoutStats();
        calculateWorkoutStreak();
        createWorkoutVolumeChart();

    } catch (error) {
        alert("Failed to update workout.");
    }

});

const deleteButton = document.createElement("button");

 deleteButton.textContent = "Delete";
workoutItem.appendChild(editButton);

       

        workoutItem.appendChild(deleteButton);

       deleteButton.addEventListener("click", async function() {

    try {
       const token = localStorage.getItem("token");

const response = await fetch(
    "http://localhost:5000/api/workouts/" + workout._id,
    {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    }
);

        const data = await response.json();

        console.log(data);

        if (data.deletedCount === 1) {
            workouts.splice(index, 1);

            displayWorkouts();
            calculateWorkoutStats();
            calculateWorkoutStreak();
createWorkoutVolumeChart();
        } else {
            alert("Workout was not deleted from MongoDB.");
        }

    } catch (error) {
        console.log("Delete error:", error);
        alert("Failed to delete workout.");
    }

});

        workoutList.appendChild(workoutItem);

    });

}
async function saveWorkoutToBackend(workout) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/workouts", {
            method: "POST",
            headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
},
            body: JSON.stringify(workout)
        });

        const data = await response.json();

        console.log(data);

        // MongoDB generated ID ko frontend workout me save karo
        workout._id = data.workoutId;

    } catch (error) {
        console.log("Backend error:", error);
    }
}

async function getProfileFromBackend() {
    const token = localStorage.getItem("token");

    if (!token) {
        dropdownUserName.textContent = "Guest";
        dropdownUserEmail.textContent = "Login to view profile";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/profile", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;
        }

        dropdownUserName.textContent = data.name;
        dropdownUserEmail.textContent = data.email;

    } catch (error) {
        console.log("Profile error:", error);
    }
}
async function getWorkoutsFromBackend() {
    try {
        const token = localStorage.getItem("token");

const response = await fetch("http://localhost:5000/api/workouts", {
    headers: {
        "Authorization": "Bearer " + token
    }
});

        const data = await response.json();

        console.log(data);
        if (!response.ok) {
    console.log(data.message);
    return;
}

       workouts.length = 0;
workouts.push(...data.workouts);

displayWorkouts();
calculateWorkoutStats();
calculateWorkoutStreak();
calculateWeeklyStats();

createWorkoutVolumeChart();

    } catch (error) {
        console.log("Backend error:", error);
    }
}
function createWorkoutVolumeChart() {

    const chartElement = document.getElementById("workout-volume-chart");

    if (workoutVolumeChart) {
        workoutVolumeChart.destroy();
        workoutVolumeChart = null;
    }

    const dates = workouts.map(function(workout) {
        return formatDate(workout.date);
    });

    const volumes = workouts.map(function(workout) {
        return workout.sets * workout.reps * workout.weight;
    });

    workoutVolumeChart = new Chart(chartElement, {
        type: "line",

        data: {
            labels: dates,

            datasets: [{
                label: "Workout Volume (kg)",
                data: volumes,
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 5
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
function createCaloriesChart(meals) {

    const chartElement = document.getElementById("calories-chart");

    if (caloriesChart) {
        caloriesChart.destroy();
        caloriesChart = null;
    }

    const dates = meals.map(function(meal) {
        return formatDate(meal.date);
    });

    const calories = meals.map(function(meal) {
        return meal.calories;
    });

    caloriesChart = new Chart(chartElement, {
        type: "line",

        data: {
            labels: dates,

            datasets: [{
                label: "Calories (kcal)",
                data: calories,
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 5
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}



registerForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {

        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        console.log(data);

        alert(data.message);

        registerForm.reset();

    } catch (error) {

        console.log("Registration error:", error);
        alert("Registration failed.");

    }

});


loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    try {

        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        console.log(data);

       if (response.ok) {

    localStorage.setItem("token", data.token);
    getProfileFromBackend();
    localStorage.setItem("userName", data.name);
    

    alert("Login successful!");

    loginForm.reset();

    getWorkoutsFromBackend();
    getNutritionFromBackend();

} else {

    alert(data.message);

}

    } catch (error) {

        console.log("Login error:", error);
        alert("Login failed.");

    }

});
logoutButton.addEventListener("click", function() {

    localStorage.removeItem("token");
localStorage.removeItem("userName");
    alert("Logged out successfully!");

});
profileButton.addEventListener("click", function() {
    profileDropdown.classList.toggle("show");
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".profile-menu")) {
        profileDropdown.classList.remove("show");
    }
});
myProfileButton.addEventListener("click", function() {

    profileName.textContent = dropdownUserName.textContent;
    profileEmail.textContent = dropdownUserEmail.textContent;

    profileModal.classList.add("show");

    profileDropdown.classList.remove("show");
});


closeProfileModal.addEventListener("click", function() {

    profileModal.classList.remove("show");

});

myProfileButton.addEventListener("click", function() {

    profileName.textContent = dropdownUserName.textContent;
    profileEmail.textContent = dropdownUserEmail.textContent;

    profileModal.classList.add("show");

    profileDropdown.classList.remove("show");
});
closeProfileModal.addEventListener("click", function() {
    profileModal.classList.remove("show");
});
myProfileButton.addEventListener("click", function() {

    profileName.textContent = dropdownUserName.textContent;
    profileEmail.textContent = dropdownUserEmail.textContent;

    profileModal.classList.add("show");

    profileDropdown.classList.remove("show");
});


closeProfileModal.addEventListener("click", function() {

    profileModal.classList.remove("show");

});
