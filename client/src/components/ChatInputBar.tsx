import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import './ChatInputBar.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface ChatInputBarProps {
    onSendMessage: (message: string, image?: string) => void;
    disabled?: boolean;
    isSidebarClosed?: boolean;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage, disabled = false, isSidebarClosed = false }) => {
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [input]);

    const handleSend = () => {
        if ((input.trim() || selectedImage) && !disabled) {
            onSendMessage(input.trim(), selectedImage || undefined);
            setInput('');
            setSelectedImage(null);
            // Reset height after sending
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            // Stop recording
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        audioChunksRef.current.push(e.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    // Send to server
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'recording.webm');

                    try {
                        const response = await fetch(`${API_URL}/api/chat/transcribe`, {
                            method: 'POST',
                            body: formData
                        });
                        const data = await response.json();
                        if (data.text) {
                            setInput(prev => prev + (prev.trim() ? ' ' : '') + data.text);
                        }
                    } catch (error) {
                        console.error('Transcription failed:', error);
                    }

                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (error) {
                console.error('Error accessing microphone:', error);
                alert('Could not access microphone.');
            }
        }
    };

    return (
        <div className={`chat-input-bar ${isSidebarClosed ? 'sidebar-closed' : ''}`}>
            {selectedImage && (
                <div className="image-preview-container">
                    <img src={selectedImage} alt="Preview" className="image-preview" />
                    <button className="remove-image-btn" onClick={() => setSelectedImage(null)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            )}
            <div className="input-container">
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleImageSelect} 
                />
                <button 
                    className="attachment-btn" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    title="Attach image"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                </button>
                
                <textarea
                    ref={textareaRef}
                    className="message-input"
                    placeholder="Ask anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={disabled}
                    rows={1}
                />
                
                <button 
                    className={`mic-btn ${isRecording ? 'recording' : ''}`} 
                    onClick={toggleRecording}
                    disabled={disabled}
                    title={isRecording ? "Stop recording" : "Record voice"}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                </button>

                <button
                    className="send-button"
                    onClick={handleSend}
                    disabled={(!input.trim() && !selectedImage) || disabled}
                >
                    <svg
                        className="send-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatInputBar;
