import React, { useState, useEffect, useRef } from 'react';
import './index.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
  error?: string;
}

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/Url" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff7b72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e3b341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const DBIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistoryLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear the history?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/history`, { method: 'DELETE' });
      if (res.ok) fetchHistory();
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  const createEmbeddings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/embeddings`, { method: 'POST' });
      if (res.ok) {
        alert("Embedding creation started in the background.");
      } else {
        alert("Failed to start embeddings.");
      }
    } catch (err) {
      console.error("Failed to create embeddings", err);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const currentPrompt = inputValue.trim();
    setInputValue('');
    
    const newUserMsg: Message = { role: 'user', content: currentPrompt };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
        sql: m.sql,
        results: m.results
      }));

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentPrompt,
          chat_history: chatHistory
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages([...newMessages, {
          role: 'assistant',
          content: data.message || "Here are the results:",
          sql: data.sql_query,
          results: data.results
        }]);
      } else {
        setMessages([...newMessages, {
          role: 'assistant',
          content: '',
          error: `${data.error || 'API Error'}: ${data.message || 'Unknown issue'}`
        }]);
      }
      fetchHistory(); // Refresh history
    } catch (error: any) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: '',
        error: `Connection Error: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={() => setMessages([])}>
          <PlusIcon /> New Chat
        </button>
        
        <div className="history-section">
          <h3 className="history-title">Actions</h3>
          <button className="sidebar-action-btn" onClick={clearHistory}>
            <TrashIcon /> Clear DB History
          </button>
          <button className="sidebar-action-btn" onClick={createEmbeddings}>
            <ZapIcon /> Create Embeddings
          </button>

          <h3 className="history-title" style={{ marginTop: '2rem' }}>History</h3>
          {historyLogs.length === 0 ? (
             <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No history yet.</div>
          ) : (
            [...historyLogs].reverse().slice(0, 10).map((log, i) => (
              <div key={i} className="history-item">
                <h4>{log.question}</h4>
                <span>{log.success ? '✅ Success' : '❌ Failed'}</span>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Area */}
      <main className="main-content">
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="greeting-container">
              <DBIcon />
              <div className="greeting-title">NL2SQL Engine</div>
              <div className="greeting-subtitle">
                Ask anything from the connected database—sales, trends, or customer insights. I will write the SQL and fetch the results for you.
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="message" style={{ backgroundColor: msg.role === 'user' ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                <div className="message-inner">
                  <div className={`avatar ${msg.role}`}>
                    {msg.role === 'user' ? '👤' : '✨'}
                  </div>
                  <div className="message-content">
                    {msg.content && <p>{msg.content}</p>}
                    
                    {msg.sql && (
                      <div className="sql-block">
                        {msg.sql}
                      </div>
                    )}
                    
                    {msg.results && msg.results.length > 0 && (
                      <div className="data-table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              {Object.keys(msg.results[0]).map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {msg.results.map((row, i) => (
                              <tr key={i}>
                                {Object.values(row).map((val: any, j) => (
                                  <td key={j}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {msg.results && msg.results.length === 0 && (
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>
                        No results returned.
                      </div>
                    )}

                    {msg.error && (
                      <div className="error-message">
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                           ⚠️ <strong>Error</strong>
                         </div>
                         {msg.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message">
              <div className="message-inner">
                <div className="avatar assistant">✨</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-wrapper">
          <form className="input-container" onSubmit={handleSubmit}>
            <input
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a query about the database..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!inputValue.trim() || isLoading}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
