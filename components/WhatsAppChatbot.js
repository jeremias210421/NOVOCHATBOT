import React, { useState } from 'react';
import './WhatsAppChatbot.css'; // Supondo que você tem um arquivo CSS para estilização

const defaultRoutines = [
    { id: 'welcome', name: 'Boas-vindas Automáticas', text: 'Olá, bem-vindo(a) à nossa loja! Como posso te ajudar hoje?' },
    { id: 'info', name: 'Coleta de Informações', text: 'Por favor, informe seu nome completo para prosseguirmos.' },
    // ... (outros rotinas)
];

const WhatsAppChatbot = () => {
    const [step, setStep] = useState('configure');
    const [selectedRoutines, setSelectedRoutines] = useState({});
    const [chatHistory, setChatHistory] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    // ... (restantes das funções handleRoutineToggle, handleRoutineTextChange, etc.)

    return (
        <div className="whatsapp-chatbot-container">
            {step === 'configure' && (
                <div className="configure-step">
                    <h1>Configurador de Chatbot WhatsApp</h1>
                    <div className="routine-list">
                        {defaultRoutines.map((routine) => (
                            <div key={routine.id} className="routine-item">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedRoutines[routine.id]}
                                        onChange={() => handleRoutineToggle(routine.id)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span>{routine.name}</span>
                                {selectedRoutines[routine.id] && (
                                    <textarea
                                        value={routineTexts[routine.id] || routine.text}
                                        onChange={(e) => handleRoutineTextChange(routine.id, e.target.value)}
                                        placeholder="Personalize a mensagem desta rotina"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleCreateBot}>Criar Bot</button>
                </div>
            )}

            {step === 'test' && (
                <div className="test-step">
                    <div className="chat-history">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <strong>{msg.sender === 'bot' ? 'Bot: ' : 'Você: '}</strong>
                                {msg.message}
                            </div>
                        ))}
                    </div>
                    <div className="input-area">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
                            placeholder="Digite sua mensagem..."
                        />
                        <button onClick={handleUserInput}>
                            <span className="send-icon"></span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppChatbot;
