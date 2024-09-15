import React, { useState } from 'react';

const defaultRoutines = [
  { id: 'welcome', name: 'Boas-vindas Automáticas', text: 'Olá, bem-vindo(a) à nossa loja! Como posso te ajudar hoje?' },
  { id: 'info', name: 'Coleta de Informações', text: 'Por favor, informe seu nome completo para prosseguirmos.' },
  // ... (outros rotinas)
];

const WhatsAppChatbot = () => {
  const [step, setStep] = useState('configure');
  const [selectedRoutines, setSelectedRoutines] = useState({});
  const [routineTexts, setRoutineTexts] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleRoutineToggle = (id) => {
    setSelectedRoutines(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRoutineTextChange = (id, text) => {
    setRoutineTexts(prev => ({
      ...prev,
      [id]: text
    }));
  };

  const handleCreateBot = () => {
    setStep('test');
    setChatHistory([
      { sender: 'bot', message: routineTexts.welcome || defaultRoutines.find(r => r.id === 'welcome').text }
    ]);
  };

  const handleUserInput = () => {
    if (inputMessage.trim() === '') return;

    setChatHistory(prev => [...prev, { sender: 'user', message: inputMessage }]);
    setInputMessage('');
    
    setTimeout(() => {
      let botResponse = getBotResponse(inputMessage.toLowerCase());
      setChatHistory(prev => [...prev, { sender: 'bot', message: botResponse }]);
    }, 1000);
  };

  const getBotResponse = (input) => {
    // Simplified logic for demonstration
    if (input.includes('produto')) {
      return routineTexts.menu || defaultRoutines.find(r => r.id === 'menu').text;
    } else if (input.includes('pedido')) {
      return routineTexts.autoResolve || defaultRoutines.find(r => r.id === 'autoResolve').text;
    } else if (input.includes('ajuda')) {
      return routineTexts.human || defaultRoutines.find(r => r.id === 'human').text;
    } else {
      return "Desculpe, não entendi. Pode reformular sua pergunta?";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {step === 'configure' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Configurador de Chatbot WhatsApp</h1>
          <h2 className="text-xl mb-2">Selecione as rotinas de atendimento:</h2>
          {defaultRoutines.map((routine) => (
            <div key={routine.id} className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRoutines[routine.id]}
                  onChange={() => handleRoutineToggle(routine.id)}
                  className="mr-2"
                />
                <label>{routine.name}</label>
              </div>
              {selectedRoutines[routine.id] && (
                <textarea
                  className="w-full p-2 border rounded mt-2"
                  value={routineTexts[routine.id] || routine.text}
                  onChange={(e) => handleRoutineTextChange(routine.id, e.target.value)}
                  placeholder="Personalize a mensagem desta rotina"
                />
              )}
            </div>
          ))}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleCreateBot}
          >
            Criar Bot
          </button>
        </div>
      )}

      {step === 'test' && (
        <div>
          <div className="h-64 overflow-y-auto border p-2 mb-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'bot' ? 'text-blue-600' : 'text-green-600'}`}>
                <strong>{msg.sender === 'bot' ? 'Bot: ' : 'Você: '}</strong>{msg.message}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-grow p-2 border rounded-l"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
              placeholder="Digite sua mensagem..."
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
              onClick={handleUserInput}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChatbot;
