import { useEffect } from "react";
import Particles from "react-tsparticles";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config.js";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import "./Login.css";

function Login() {
    const navigate = useNavigate(); // useNavigate hook for navigation

    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth();

        // Check if the user is already signed in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // If user is logged in, redirect to the profile page
                navigate('/profile'); // Use navigate to redirect
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    const handleGoogleSignIn = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider);
    };

    let particles_options = {
        "particles": {
          "number": {
            "value": 60,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 5,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "events": {
            "onhover": {
              "enable": true,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true,
        "config_demo": {
          "hide_card": false,
          "background_color": "#b61924",
          "background_image": "",
          "background_position": "50% 50%",
          "background_repeat": "no-repeat",
          "background_size": "cover"
        }
    };

    return (
        <div className="wrapper">
            <Particles params={particles_options} />
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 d-flex justify-content-center align-items-center vh-100 mx-auto">
                        <div className="card card-body text-center">
                            <h4 className="text-dark mb-0">Login to Continue</h4>
                            <GoogleButton
                                className="my-5 mx-auto"
                                onClick={handleGoogleSignIn}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;