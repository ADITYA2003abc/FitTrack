import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Workout from "./components/Workout";
import Nutrition from "./components/Nutrition";
import BMI from "./components/BMI";
import About from "./components/About";
import Auth from "./components/Auth";

import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Cta from "./components/Cta";
import Footer from "./components/footer";


function App() {
   const [bmiData, setBmiData] = useState({
        weight: null,
        bmi: null,
        status: ""
    });
    return (
        <>
            <Navbar />
            <Hero />
            <BMI setBmiData={setBmiData} />
            <Cta />
            <Features />
            <Dashboard bmiData={bmiData} />

            <Workout />

            <Analytics />
            <Nutrition />
            <About />
            <Auth />
            
            
            <footer />
            
            
        </>
    );
}

export default App;