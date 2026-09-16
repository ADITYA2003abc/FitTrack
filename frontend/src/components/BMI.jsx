import { useState } from "react";

function BMI({ setBmiData }) {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState("");

    function handleCalculateBMI(event) {
        event.preventDefault();

        const heightInMeters = Number(height) / 100;
        const weightInKg = Number(weight);

        if (
            !heightInMeters ||
            !weightInKg ||
            heightInMeters <= 0 ||
            weightInKg <= 0
        ) {
            alert("Please enter valid height and weight.");
            return;
        }

        const calculatedBMI =
            weightInKg / (heightInMeters * heightInMeters);

        setBmi(calculatedBMI.toFixed(1));
        setBmiData({
    weight: weightInKg,
    bmi: Number(calculatedBMI.toFixed(1)),
    status: status
});

        if (calculatedBMI < 18.5) {
            setStatus("Underweight");
        } else if (calculatedBMI < 25) {
            setStatus("Normal");
        } else if (calculatedBMI < 30) {
            setStatus("Overweight");
        } else {
            setStatus("Obese");
        }
    }

    return (
        <section className="bmi-section">

            <h2>BMI Calculator</h2>

            <form onSubmit={handleCalculateBMI}>

                <label htmlFor="height">
                    Height (cm)
                </label>

                <input
                    id="height"
                    type="number"
                    placeholder="e.g. 175"
                    min="1"
                    value={height}
                    onChange={(e) =>
                        setHeight(e.target.value)
                    }
                />

                <label htmlFor="weight">
                    Weight (kg)
                </label>

                <input
                    id="weight"
                    type="number"
                    placeholder="e.g. 70"
                    min="1"
                    value={weight}
                    onChange={(e) =>
                        setWeight(e.target.value)
                    }
                />

                <button type="submit">
                    Calculate BMI
                </button>

            </form>

            <div id="bmi-result">

                {bmi === null ? (
                    "Enter your height and weight to calculate BMI."
                ) : (
                    <>
                        Your BMI: <strong>{bmi}</strong>
                        <br />
                        Status: <strong>{status}</strong>
                    </>
                )}

            </div>

        </section>
    );
}

export default BMI;