function Hero() {
    return (
        <section id="home" className="hero">

            <div className="hero-content">

                <div className="hero-text">

                    <span className="hero-badge">
                        BUILT FOR CONSISTENCY
                    </span>

                    <h1>
                        Your Fitness.<br />
                        <span>Your Progress.</span>
                    </h1>

                    <p>
                        Track your workouts, nutrition and fitness
                        analytics — all in one place.
                    </p>

                    <a href="#workout" className="cta-button">
                        Start Tracking
                    </a>

                </div>

                <div className="hero-image">
                    <img
                        src="/images/virat-kohli.jpg"
                        alt="Fitness training"
                    />
                </div>

            </div>

        </section>
    );
}

export default Hero;