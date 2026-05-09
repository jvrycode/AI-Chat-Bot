import React, { useState } from 'react';
import { conversationsAPI } from '../services/api';
import logo from '../assets/logo.png';
import SettingsModal from './SettingsModal';
import HelpModal from './HelpModal';
import './Sidebar.css';

interface ConversationSummary {
    conversationId: string;
    title: string;
    updatedAt: string;
}

interface Project {
    projectId: string;
    name: string;
}

interface SidebarProps {
    isOpen?: boolean;
    onNewChat: () => void;
    conversations?: ConversationSummary[];
    projects?: Project[];
    onLoadConversation?: (conversationId: string) => void;
    onCreateProject?: (name: string) => void;
    onSearch?: (query: string) => void;
    onLogout?: () => void;
    onToggleSidebar?: () => void;
    activeConversationId?: string;
    isAuthenticated?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen = true,
    isAuthenticated = true,
    onNewChat,
    conversations = [],
    projects = [],
    onLoadConversation,
    onCreateProject,
    onSearch,
    onLogout,
    onToggleSidebar,
    activeConversationId
}) => {
    const [showProjectPrompt, setShowProjectPrompt] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);

    const handleCreateProject = async () => {
        if (projectName.trim() && onCreateProject) {
            await onCreateProject(projectName.trim());
            setProjectName('');
            setShowProjectPrompt(false);
        }
    };



    const handleLoadChat = (conversationId: string) => {
        if (onLoadConversation) {
            onLoadConversation(conversationId);
        }
    };

    const handleDeleteChat = async (conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConversationToDelete(conversationId);
        setShowDeleteModal(true);
        setActiveMenu(null);
    };

    const confirmDelete = async () => {
        if (conversationToDelete) {
            try {
                await conversationsAPI.delete(conversationToDelete);
                window.location.reload();
            } catch (error) {
                console.error('Failed to delete conversation:', error);
                alert('Failed to delete conversation');
            }
        }
        setShowDeleteModal(false);
        setConversationToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setConversationToDelete(null);
    };

    const toggleMenu = (conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === conversationId ? null : conversationId);
    };

    const handleMenuAction = (action: string, conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenu(null);

        switch (action) {
            case 'share':
                alert('Share feature coming soon!');
                break;
            case 'group':
                alert('Group chat feature coming soon!');
                break;
            case 'rename':
                const newName = prompt('Enter new name:');
                if (newName) alert(`Rename to "${newName}" - coming soon!`);
                break;
            case 'move':
                alert('Move to project feature coming soon!');
                break;
            case 'archive':
                alert('Archive feature coming soon!');
                break;
        }
    };

    return (
        <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
            <div className="sidebar-branding">
                <div className="logo-wrapper">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                </div>
                <button className="sidebar-collapse-btn" title="Close sidebar" onClick={onToggleSidebar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
                        <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            <div className="sidebar-section main-nav">
                <button className="sidebar-item" onClick={onNewChat}>
                    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span>New chat</span>
                </button>

                {isAuthenticated && (
                    <>
                        <button className="sidebar-item" onClick={() => setShowProjectPrompt(true)}>
                            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                <line x1="12" y1="11" x2="12" y2="17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                                <line x1="9" y1="14" x2="15" y2="14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                            </svg>
                            <span>Projects</span>
                        </button>

                        {projects.length > 0 && projects.map((project) => (
                            <div key={project.projectId} className="sidebar-item project-item">
                                <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>{project.name}</span>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {showProjectPrompt && (
                <div className="project-prompt">
                    <input
                        type="text"
                        className="project-input"
                        placeholder="Enter project name..."
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                        autoFocus
                    />
                    <div className="project-actions">
                        <button className="project-btn" onClick={handleCreateProject}>Create</button>
                        <button className="project-btn cancel" onClick={() => setShowProjectPrompt(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {isAuthenticated && (
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Your chats</div>
                    <div className="chat-history">
                        {conversations.length === 0 ? (
                            <div className="empty-chats">No saved conversations yet</div>
                        ) : (
                            conversations.map((chat) => (
                                <div key={chat.conversationId} className={`chat-item-wrapper ${activeConversationId === chat.conversationId ? 'active' : ''}`}>
                                    <button
                                        className={`sidebar-item chat-item ${activeConversationId === chat.conversationId ? 'active' : ''}`}
                                        onClick={() => handleLoadChat(chat.conversationId)}
                                    >
                                        <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <span>{chat.title}</span>
                                    </button>
                                    <button
                                        className="chat-menu-btn"
                                        onClick={(e) => toggleMenu(chat.conversationId, e)}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                            <circle cx="12" cy="5" r="2" />
                                            <circle cx="12" cy="12" r="2" />
                                            <circle cx="12" cy="19" r="2" />
                                        </svg>
                                    </button>
                                    {activeMenu === chat.conversationId && (
                                        <div className="chat-menu">
                                            <button className="menu-item" onClick={(e) => handleMenuAction('share', chat.conversationId, e)}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                </svg>
                                                Share
                                            </button>
                                            <button className="menu-item" onClick={(e) => handleMenuAction('group', chat.conversationId, e)}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Start a group chat
                                            </button>
                                            <button className="menu-item" onClick={(e) => handleMenuAction('rename', chat.conversationId, e)}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Rename
                                            </button>
                                            <button className="menu-item" onClick={(e) => handleMenuAction('move', chat.conversationId, e)}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                </svg>
                                                Move to project
                                                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="12" height="12">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <button className="menu-item" onClick={(e) => handleMenuAction('archive', chat.conversationId, e)}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                </svg>
                                                Archive
                                            </button>
                                            <div className="menu-divider"></div>
                                            <button
                                                className="menu-item delete"
                                                onClick={(e) => handleDeleteChat(chat.conversationId, e)}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <div className="sidebar-bottom-menu">
                <button className="sidebar-item" onClick={() => setShowSettingsModal(true)}>
                    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span>Settings</span>
                </button>
                <button className="sidebar-item" onClick={() => setShowHelpModal(true)}>
                    <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span>Help</span>
                </button>
            </div>

            {isAuthenticated ? (
                onLogout && (
                    <div className="sidebar-footer" style={{ padding: '8px 16px', borderTop: '1px solid var(--border-subtle)' }}>
                        <button 
                            className="sidebar-item logout-btn" 
                            onClick={onLogout}
                        >
                            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Log out</span>
                        </button>
                    </div>
                )
            ) : (
                <div className="sidebar-footer guest-cta">
                    <h3>Get responses tailored to you</h3>
                    <p>Log in to get answers based on saved chats, plus create images and upload files.</p>
                    <button className="cta-btn" onClick={() => window.location.href = '/login'}>Log in</button>
                </div>
            )}

            {/* Custom Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete conversation?</h3>
                        <p>This will delete this conversation from your chat history.</p>
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={cancelDelete}>Cancel</button>
                            <button className="modal-btn delete" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
            <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
        </div>
    );
};

export default Sidebar;
