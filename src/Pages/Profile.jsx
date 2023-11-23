import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    photoURL: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Fetch basic user info from authentication
          const { photoURL, displayName, email } = user;
  
          // Check if user profile exists in Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            // If profile exists, fetch and set user data
            const userData = userDocSnap.data();
            setUserProfile({ ...userData });
          } else {
            // If profile doesn't exist, create a new profile in Firestore
            const [firstName, lastName] = displayName.split(' ');
  
            const initialProfileData = {
              photoURL,
              firstName,
              lastName,
              email,
              age: '',
              gender: '',
              phone: '',
            };
  
            // Store initial profile data in Firestore
            await setDoc(userDocRef, initialProfileData);
            setUserProfile(initialProfileData);              
          }
        }
      });

    return () => {
      unsubscribe();
    };
  }, [navigate]);


  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, 'user_profile_images/' + file.name);
  
    try {
      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
  
      // Update the profile image URL in Firestore
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
  
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });
      }
  
      // Update the state with the new photoURL
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        photoURL: downloadURL,
      }));

      setSuccessMessage('your profile image has uploaded successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
        setErrorMessage('an error occurred updating your profile picture!');
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);

      try {
        await setDoc(userDocRef, userProfile, { merge: true });
        setSuccessMessage('your profile has been updated successfully');
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
      } catch (error) {
        setErrorMessage('an error occurred updating your profile!');
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      try {
        await deleteUser(user);
        // Redirect or perform actions after successful deletion
        navigate('/'); // Redirect to the desired location
      } catch (error) {
        console.error('An error occurred while deleting your account:', error);
      }
    }
  };  
  return (
    <div className="profile_wrapper">
      <div className="container">
        <div className="row">
            <div className="col-md-10 mx-auto mt-5">
            <div className="row w-100">
                <div className="col-12 text-center mb-2">
                    <h4>My Profile</h4>
                </div>
                <div className="col-12">
                    <div className="card card-body px-4 rounded pt-4">
                    <div className="row">
                    {Object.values(userProfile).some(value => value === '') && (
                        <div className="col-12 mb-3">
                            <div className="alert alert-danger" role="alert">
                            Please complete your profile
                            </div>
                        </div>
                        )}
                    <div className="col-12 text-center mb-3">
                        <label htmlFor="profile-image" className="upload-profile">
                        <input type="file" id="profile-image" onChange={handleProfileImageChange} style={{ display: 'none' }} />
                        <div className="image-container">
                            <img src={userProfile.photoURL} alt="profile img" className="img-fluid rounded-circle border user_img" />

                            <div className="overlay">
                            <div className="overlay-text">Upload</div>
                            </div>
                        </div>
                        </label>
                    </div>
                        <div className="col-md-6 mb-3">
                        <label htmlFor="first_name">First Name</label>
                        <div className="input-group">
                            <div class="input-group-prepend">
                                <i class="input-group-text fas fa-user"></i>
                            </div>
                            <input type="text" id="first_name" className="form-control" value={userProfile.firstName} onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })} />
                        </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" id="last_name" className="form-control" value={userProfile.lastName} onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })} />
                        </div>
                        <div className="col-md-6 mb-3">
                        <label htmlFor="email">Email</label>
                        <div className="input-group">
                            <div class="input-group-prepend">
                                <i class="input-group-text far fa-envelope"></i>
                            </div>
                            <input type="email" id="email" className="form-control" value={userProfile.email} onChange={handleInputChange} />
                        </div>
                        </div>
                        <div className="col-md-6 mb-3">
                        <label htmlFor="phone">Phone</label>
                        <div className="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-mobile-alt p-1"></i></span>
                            </div>
                            <input type="tel" id="phone" className="form-control" value={userProfile.phone} onChange={handleInputChange} />
                        </div>
                        </div>
                        <div className="col-md-6 mb-3">
                        <label htmlFor="age">Age</label>
                        <div className="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-user-clock py-1"></i></span>
                            </div>
                            <input type="number" id="age" className="form-control" value={userProfile.age} onChange={handleInputChange} />
                        </div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="gender">Gender</label>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="male"
                                    name="gender"
                                    value="male"
                                    checked={userProfile.gender === 'male'} // Assuming userProfile holds user data
                                    onChange={(e) => setUserProfile({ ...userProfile, gender: 'male' })}
                                />
                                <label className="form-check-label" htmlFor="male">
                                    Male
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="female"
                                    name="gender"
                                    value="female"
                                    checked={userProfile.gender === 'female'} // Assuming userProfile holds user data
                                    onChange={(e) => setUserProfile({ ...userProfile, gender: 'female' })}
                                />
                                <label className="form-check-label" htmlFor="female">
                                    Female
                                </label>
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <hr className="text-muted w-50 mx-auto" />
                            <button type="button" className="btn btn-success" onClick={handleSaveChanges}>Save Changes</button>
                        </div>
                        <div className="col-12 text-center mt-2">
                        {successMessage && (
                            <>
                            <i className="fas fa-check-circle text-success mr-2"></i>
                            <span className="text-success"> {successMessage}</span>
                            </>
                        )}
                        {errorMessage && (
                            <>
                            <i className="fas fa-times-circle text-danger mr-2"></i>
                            <span className="text-danger"> {errorMessage}</span>
                            </>
                        )}
                        </div>
                    </div>
                    </div>
                </div>
                <div className="col-10 mx-auto mt-4">
                  <div className="card card-body">
                    <div>
                      <p className="text-danger mb-2">Deleting your account will permanently remove all your data.</p>
                      <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete My Account</button>
                    </div>
                  </div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;