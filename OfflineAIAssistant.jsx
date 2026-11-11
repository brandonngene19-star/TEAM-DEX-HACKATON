import React, { useState } from 'react';
import { LogoMark } from './Logo.jsx';

const OFFLINE_KNOWLEDGE_BASE = [
  { keywords: ['fever', 'malaria', 'temperature', 'hot'], response: "High fever or malaria symptoms? Visit Clinique Bon Pasteur or Centre Médical Sainte-Thérèse for rapid diagnostic blood tests (approx. 2,500 - 3,000 FCFA)." },
  { keywords: ['fee', 'cost', 'price', 'cheapest'], response: "Consultation fees range from 1,800 FCFA at Hôpital District Nyalla up to 3,000 FCFA at private centers like Sainte-Thérèse." },
  { keywords: ['emergency', 'accident', 'urgent'], response: "For immediate emergencies, Hôpital District Nyalla offers 24/7 acute care services. Call your local emergency line or head to the nearest hub." },
  { keywords: ['pharmacy', 'medicine', 'drugs'], response: "All featured partner clinics have on-site licensed pharmacies open during standard operating hours." }
];

export default function OfflineAIAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am your CarePath Offline Assistant. Ask me about symptoms, clinic fees, or locations." }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    // Local pattern matching engine
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let matchedResponse = "I have saved your query locally. For general symptoms, ensure you consult a verified provider near Akwa or Bonamoussadi.";
      
      for (const item of OFFLINE_KNOWLEDGE_BASE) {
        if (item.keywords.some(kw => lower.includes(kw))) {
          matchedResponse = item.response;
          break;
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: matchedResponse }]);
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col h-[400px] overflow-hidden">
      <div className="bg-slate-900 text-white p-4 font-semibold flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
            <LogoMark size={26} /> CarePath Offline AI
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Offline Mode Ready"></span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask offline assistant (e.g. fever, fees)..."
          className="flex-1 bg-slate-100 border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition">
          Send
        </button>
      </form>
    </div>
  );
}