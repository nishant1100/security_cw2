import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
    const { id: userId } = useParams(); // Get userId from route params

    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        bio: "",
        profileImage: "",
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch user data on component mount
    //   useEffect(() => {
    //     const fetchUser = async () => {
    //       try {
    //         const res = await fetch(`/api/users/${userId}`);
    //         const data = await res.json();
    //         setUser(data);
    //         setFormData(data);
    //         setLoading(false);
    //       } catch (err) {
    //         console.error("Failed to fetch user:", err);
    //         setLoading(false);
    //       }
    //     };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/user/${userId}`);
                const data = await res.json();

                setUser(data);  // directly from backend (not wrapped in { user: ... })

                setFormData({
                    email: data.email || "",
                    username: data.username || "",
                    bio: data.bio || "",
                    profileImage: data.profileImage || "",
                });
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    // Handle form input changes
    // const handleChange = (e) => {
    //     const { name, value, files } = e.target;
    //     if (name === "profileImage" && files[0]) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setFormData({ ...formData, profileImage: reader.result });
    //         };
    //         reader.readAsDataURL(files[0]);
    //     } else {
    //         setFormData({ ...formData, [name]: value });
    //     }
    // };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "profileImage" && files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };



    // Submit updated user profile
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setMessage("Profile updated successfully!");
                setEditMode(false);
            } else {
                setMessage(data.error || "Update failed.");
            }
        } catch (err) {
            console.error("Update error:", err);
            setMessage("Server error.");
        }
    };

    if (loading) return <p className="text-center mt-6">Loading profile...</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

            {message && <p className="text-blue-600 mb-3">{message}</p>}

            <form onSubmit={handleUpdate}>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Profile Picture</label>
                    {formData.profileImage && (
                        <img
                            src={formData.profileImage}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover mb-2"
                        />
                    )}
                    {editMode && (
                        <input
                            type="file"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    )}
                </div>

                {editMode ? (
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEditMode(false);
                                setFormData(user);
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Edit Profile
                    </button>
                )}
            </form>
        </div>
    );
};

export default UserProfile;
