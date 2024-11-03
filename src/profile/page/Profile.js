import useProfile from "../hook/useProfile";

const ProfilePage = () => {
    const { username, email, error } = useProfile();
    
    return ( 
        <div className="profile-page-container">
            <aside className="profile-sidebar">
                <div className="profile-summary-card">
                    <h2>Profile Summary</h2>
                    <div className="profile-avatar">
                        <div className="avatar-placeholder">{username ? username[0].toUpperCase() : 'U'}</div>
                    </div>
                    <p className="profile-username">{username}</p>
                    <p className="profile-email">{email}</p>
                </div>
                
                <div className="profile-actions">
                    <section className="profile-section">
                        <h3>Learn More</h3>
                        <ul>
                            <li><a href="#usage">Usage</a></li>
                            <li><a href="#tutorials">Tutorials</a></li>
                            <li><a href="#support">Support</a></li>
                            
                        </ul>
                    </section>
                    <section className="profile-section">
                        <h3>Account Settings</h3>
                        <ul>
                            <li><a href="#appearance">Appearance</a></li>
                            <li><a href="#privacy">Privacy Settings</a></li>
                            
                        </ul>
                    </section>
                </div>
            </aside>
            
            <main className="profile-main-content">
                <h1>Profile Details</h1>
                {error ? (
                    <p className="profile-error">{error}</p>
                ) : (
                    <div className="profile-details">
                        <div className="profile-field">
                            <label>Username:</label>
                            <p>{username}</p>
                        </div>
                        <div className="profile-field">
                            <label>Email:</label>
                            <p>{email}</p>
                        </div>
                        {/* Add more profile fields as needed */}
                    </div>
                )}
                <form className="additional-user-profile">
                    <label>Tell us more about yourself</label>
                    <textarea placeholder="Write about yourself..."></textarea>
                    <input type="submit" value="Send Information"/>
                </form>
            </main>
        </div>
     );
}

export default ProfilePage;



