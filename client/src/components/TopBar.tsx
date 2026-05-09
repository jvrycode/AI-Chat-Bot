import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

interface TopBarProps {
    title?: string;
    isAuthenticated?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Chatbot', isAuthenticated = true }) => {
    const navigate = useNavigate();

    return (
        <div className="topbar">
            <div className="topbar-content">
                {/* Title moved to Sidebar */}
            </div>
            {!isAuthenticated && (
                <div className="topbar-actions">
                    <button className="topbar-btn login" onClick={() => navigate('/login')}>Log in</button>
                    <button className="topbar-btn signup" onClick={() => navigate('/login?mode=signup')}>Sign up for free</button>
                </div>
            )}
        </div>
    );
};

export default TopBar;
