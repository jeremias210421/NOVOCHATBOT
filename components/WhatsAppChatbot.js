import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react';

const defaultRoutines = [
  { id: 'welcome', name: 'Boas-vindas Automáticas', text: 'Olá! Bem-vindo(a) à nossa loja! Como posso te ajudar hoje?' },
  { id: 'info', name: 'Coleta de Informações', text: 'Por favor, informe seu nome completo para prosseguirmos.' },
  { id: 'menu', name: 'Menu de Opções', text: 'Como posso te ajudar?\n1️⃣ Informações sobre produtos\n2️⃣ Status do pedido\n3️⃣ Suporte técnico\n4️⃣ Falar com um atendente' },
  { id: 'autoResolve', name: 'Resolução Automática', text: 'Entendi sua solicitação. Estou processando as informações para resolver seu problema automaticamente.' },
  { id: 'human', name: 'Encaminhamento para Atendente', text: 'Entendo que você precisa de ajuda especializada. Vou te transferir para um de nossos atendentes humanos. Por favor, aguarde um momento.' },
  { id: 'schedule', name: 'Agendamento', text: 'Vamos agendar um horário para você. Por favor, escolha uma das opções disponíveis:\n1️⃣ Segunda-feira, 14h\n2️⃣ Terça-feira, 10h\n3️⃣ Quarta-feira, 16h' },
  { id: 'followUp', name: 'Follow-up', text: 'Olá! Espero que esteja tudo bem. Gostaria de saber se você está satisfeito com nosso atendimento e se há algo mais em que possamos ajudar.' },
  { id: 'feedback', name: 'Pesquisa de Satisfação', text: 'Sua opinião é muito importante para nós. Como você avalia nosso atendimento?\n⭐⭐⭐⭐⭐ Excelente\n⭐⭐⭐⭐ Muito Bom\n⭐⭐⭐ Bom\n⭐⭐ Regular\n⭐ Ruim' },
  { id: 'offHours', name: 'Fora do Horário', text: 'Olá! Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Por favor, deixe sua mensagem e retornaremos assim que possível.' },
  { id: 'reminder', name: 'Lembrete', text: 'Olá! Este é um lembrete amigável sobre seu compromisso agendado para amanhã às 10h. Confirmamos sua presença?' },
];

const WhatsAppChatbot = () => {
  const [step, setStep] = useState('configure');
  const [selectedRoutines, setSelectedRoutines] = useState({});
  const [routineTexts, setRoutineTexts] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [storeInfo, setStoreInfo] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

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
    setStep('collect');
    setChatHistory([
      { sender: 'bot', message: 'Olá! Vamos configurar o chatbot para sua loja. Qual é o nome da sua loja?' }
    ]);
  };

  const handleUserInput = () => {
    if (inputMessage.trim() === '') return;

    setChatHistory(prev => [...prev, { sender: 'user', message: inputMessage }]);
    setInputMessage('');
    
    setTimeout(() => {
      let botResponse = getBotResponse(inputMessage);
      setChatHistory(prev => [...prev, { sender: 'bot', message: botResponse }]);
    }, 1000);
  };

  const getBotResponse = (input) => {
    if (step === 'collect') {
      if (!storeInfo.name) {
        setStoreInfo(prev => ({ ...prev, name: input }));
        return "Ótimo! Qual é o ramo de atuação da sua loja?";
      } else if (!storeInfo.business) {
        setStoreInfo(prev => ({ ...prev, business: input }));
        return "Perfeito! Agora, me diga qual é o horário de funcionamento da sua loja?";
      } else if (!storeInfo.hours) {
        setStoreInfo(prev => ({ ...prev, hours: input }));
        setStep('test');
        return `Obrigado! Agora vou configurar o chatbot para a ${storeInfo.name}. Você pode começar a testar enviando uma mensagem como se fosse um cliente.`;
      }
    }

    // Simplified logic for demonstration
    if (input.toLowerCase().includes('produto')) {
      return routineTexts.menu || defaultRoutines.find(r => r.id === 'menu').text;
    } else if (input.toLowerCase().includes('pedido')) {
      return routineTexts.autoResolve || defaultRoutines.find(r => r.id === 'autoResolve').text;
    } else if (input.toLowerCase().includes('ajuda')) {
      return routineTexts.human || defaultRoutines.find(r => r.id === 'human').text;
    } else {
      return routineTexts.welcome || defaultRoutines.find(r => r.id === 'welcome').text;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-200 h-screen flex flex-col">
      {step === 'configure' && (
        <div className="p-4 overflow-y-auto flex-grow">
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
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
            onClick={handleCreateBot}
          >
            Criar Bot
          </button>
        </div>
      )}

      {(step === 'collect' || step === 'test') && (
        <>
          <div className="bg-green-500 p-4 text-white flex justify-between items-center">
            <div className="font-bold">{storeInfo.name || "WhatsApp Chatbot"}</div>
            <MoreVertical size={24} />
          </div>
          <div className="flex-grow overflow-y-auto p-4 bg-[url('/api/placeholder/400/800')] bg-cover">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`mb-4 flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <div className={`rounded-lg p-2 max-w-[70%] ${msg.sender === 'bot' ? 'bg-white' : 'bg-green-100'}`}>
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="bg-gray-100 p-4 flex items-center">
            <Smile size={24} className="text-gray-500 mr-2" />
            <Paperclip size={24} className="text-gray-500 mr-2" />
            <input
              type="text"
              className="flex-grow p-2 rounded-full"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
              placeholder="Digite uma mensagem"
            />
            <Send size={24} className="text-gray-500 ml-2 cursor-pointer" onClick={handleUserInput} />
          </div>
        </>
      )}
    </div>
  );
};

export default WhatsAppChatbot;
