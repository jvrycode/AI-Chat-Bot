import React from 'react';
import './HelpModal.css';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="help-overlay" onClick={onClose}>
            <div className="help-modal" onClick={(e) => e.stopPropagation()}>
                <div className="help-header">
                    <h2>Help & FAQ</h2>
                    <button className="help-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="help-content">
                    <div className="faq-item">
                        <h3>What is Xenova?</h3>
                        <p>Xenova is a powerful, AI-driven conversational assistant designed to help you with research, coding, writing, and brainstorming.</p>
                    </div>
                    
                    <div className="faq-item">
                        <h3>Are my conversations saved?</h3>
                        <p>If you are logged in, your conversations are securely saved to your account so you can access them later. If you are using Guest Mode, your conversations are ephemeral and will be lost when you refresh.</p>
                    </div>
                    
                    <div className="faq-item">
                        <h3>What AI model powers Xenova?</h3>
                        <p>Xenova is powered by blazing-fast inference via the Groq API, enabling near-instantaneous responses.</p>
                    </div>
                </div>

                <div className="help-footer">
                    <p>@John Viray</p>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
