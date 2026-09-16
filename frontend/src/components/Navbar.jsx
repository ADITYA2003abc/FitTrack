import { useEffect, useState } from "react";

function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [userName, setUserName] = useState("Guest");
    const [userEmail, setUserEmail] = useState("Login to view profile");

    useEffect(() => {
        async function loadProfile() {
            const token = localStorage.getItem("token");

            if (!token) {
                setUserName("Guest");
                setUserEmail("Login to view profile");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/profile",
                    {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setUserName(data.name);
                    setUserEmail(data.email);
                }
            } catch (error) {
                console.log("Profile error:", error);
            }
        }

        loadProfile();
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");

        setUserName("Guest");
        setUserEmail("Login to view profile");
        setDropdownOpen(false);
        setProfileOpen(false);

        alert("Logged out successfully!");
    }

    return (
        <nav>
            <h2>FitTrack</h2>

            <div className="nav-links">
                <a href="#home">Home</a>
                <a href="#features">Features</a>
                <a href="#about">About</a>
                <a href="#workout">Workout</a>
                <a href="#nutrition">Nutrition</a>
            </div>

            <div className="profile-menu">

                <button
                    className="profile-button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <span className="profile-icon">👤</span>
                    <span className="profile-arrow">▾</span>
                </button>

                {dropdownOpen && (
                    <div className="profile-dropdown">

                        <div className="profile-info">
                            <strong>{userName}</strong>
                            <span>{userEmail}</span>
                        </div>

                        <button
                            onClick={() => {
                                setProfileOpen(true);
                                setDropdownOpen(false);
                            }}
                        >
                            My Profile
                        </button>

                        <button>
                            Change Password
                        </button>

                        <button onClick={handleLogout}>
                            Logout
                        </button>

                    </div>
                )}

                {profileOpen && (
                    <div className="profile-modal">
                        <div className="profile-modal-content">

                            <button
                                className="close-profile-modal"
                                onClick={() => setProfileOpen(false)}
                            >
                                ×
                            </button>

                            <h2>My Profile</h2>

                            <div className="profile-detail">
                                <span>Name</span>
                                <strong>{userName}</strong>
                            </div>

                            <div className="profile-detail">
                                <span>Email</span>
                                <strong>{userEmail}</strong>
                            </div>

                            <div className="profile-detail">
                                <span>Account</span>
                                <strong>Active</strong>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </nav>
    );
}

export default Navbar;