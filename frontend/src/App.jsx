import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { supabase } from './supabase.js';

// Landing Page Component
function LandingPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/chat',
      },
    });
    if (error) {
      alert('Error signing in with Google: ' + error.message);
    }
  };

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-left">
          <img src="/logo.png" alt="Zenalyse Logo" className="logo" />
          <span className="brand">ZENALYSE</span>
        </div>
        <div className="nav-right">
          <Link to="/tech">Tech</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/chat">Chat with Zenalyse</Link>
        </div>
      </nav>
      <div className="content-wrapper">
        <div className="landing-content">
          <div className="landing-text">
            <h1>Your Free Personal AI Therapist</h1>
            <p>Measure & improve your mental health in real time with your personal AI chat bot. No sign up. Available 24/7. Daily insights just for you!</p>
            <button onClick={handleGoogleSignIn} className="chat-button">
              Sign In with Google
            </button>
          </div>
          <div className="landing-image">
            <img src="/logo.png" alt="Zenalyse Mascot" className="mascot" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Chat Page Component
function ChatBox() {
  const [userEmail, setUserEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserEmail(session.user.email);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) setUserEmail(session.user.email);
      else setUserEmail('');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserEmail('');
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const currentMessage = inputMessage;
    setMessages((prev) => [...prev, { text: currentMessage, isUser: true }]);
    setInputMessage('');
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
      setMessages((prev) => [...prev, { text: 'Processing your message...', isUser: false }]);
    }, 30000);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ message: currentMessage }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const aiResponse = data.response || 'Processing your message...';
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error('Fetch error:', error.message);
      setMessages((prev) => [...prev, { text: `Error: ${error.message}`, isUser: false }]);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }

    setTimeout(() => {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }, 0);
  };

  const getAuthToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || '';
  };

  return (
    <div className="chat-container">
      <nav className="landing-nav">
        <div className="nav-left">
          <img src="/logo.png" alt="Zenalyse Logo" className="logo" />
          <span className="brand">ZENALYSE</span>
        </div>
        <div className="nav-right">
          <Link to="/tech">Tech</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/chat">Chat with Zenalyse</Link>
        </div>
      </nav>
      <div className="content-wrapper">
        <div className="chat-box">
          <h2 className="chat-title">Zenalyse Chatbot</h2>
          {userEmail ? (
            <p className="welcome-message">
              Welcome, {userEmail}! <button onClick={signOut}>Sign Out</button>
            </p>
          ) : (
            <p className="welcome-message">
              Please sign in with Google to chat. <Link to="/">Go to Sign In</Link>
            </p>
          )}
          <h3 className="chat-header">Talk to Zenalyse</h3>
          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="message ai-message">Typing...</div>}
          </div>
          <div className="chat-input">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              disabled={!userEmail}
            />
            <button onClick={sendMessage} disabled={!userEmail}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component with Tech, About, and Blog Pages
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatBox />} />
        <Route path="/tech" element={
          <div className="page-container">
            <nav className="landing-nav">
              <div className="nav-left">
                <img src="/logo.png" alt="Zenalyse Logo" className="logo" />
                <span className="brand">ZENALYSE</span>
              </div>
              <div className="nav-right">
                <Link to="/tech">Tech</Link>
                <Link to="/about">About</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/chat">Chat with Zenalyse</Link>
              </div>
            </nav>
            <div className="content-wrapper">
              <div className="page-content">
                <h2 className="page-title">Our Technology</h2>
                <p className="page-text">
                  Zenalyse leverages cutting-edge AI to provide real-time mental health support. Our chatbot is powered by a combination of BERT and Mistral, two advanced language models, ensuring empathetic and context-aware conversations.
                </p>
                <h3 className="page-subtitle">AI Models</h3>
                <ul className="page-list">
                  <li><strong>BERT (Bidirectional Encoder Representations from Transformers):</strong> Enables deep understanding of user input by analyzing context in both directions, ensuring accurate sentiment analysis and response generation.</li>
                  <li><strong>Mistral:</strong> A high-performance language model that enhances the chatbot's ability to generate natural, supportive responses tailored to your emotional needs.</li>
                </ul>
                <h3 className="page-subtitle">Tech Stack</h3>
                <ul className="page-list">
                  <li><strong>Frontend:</strong> Built with React and Vite for a fast, responsive user interface, styled with Tailwind CSS for a sleek, modern design.</li>
                  <li><strong>Backend:</strong> Powered by Python and FastAPI, providing a robust API for real-time chat interactions.</li>
                  <li><strong>Database:</strong> Integrated with Supabase for secure, scalable data management.</li>
                </ul>
                <p className="page-text">
                  Our tech stack ensures that Zenalyse is not only powerful but also accessible, available 24/7 to support your mental health journey.
                </p>
              </div>
            </div>
          </div>
        } />
        <Route path="/about" element={
          <div className="page-container">
            <nav className="landing-nav">
              <div className="nav-left">
                <img src="/logo.png" alt="Zenalyse Logo" className="logo" />
                <span className="brand">ZENALYSE</span>
              </div>
              <div className="nav-right">
                <Link to="/tech">Tech</Link>
                <Link to="/about">About</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/chat">Chat with Zenalyse</Link>
              </div>
            </nav>
            <div className="content-wrapper">
              <div className="page-content">
                <h2 className="page-title">About Zenalyse</h2>
                <p className="page-text">
                  Zenalyse is your free personal AI therapist, designed to help you measure and improve your mental health in real time. We believe that mental health support should be accessible to everyone, which is why Zenalyse is available 24/7 with no sign-up required—just for you!
                </p>
                <p className="page-text">
                  Our mission is to provide empathetic, AI-driven conversations that help you navigate your emotions and gain daily insights into your well-being. Powered by advanced models like BERT and Mistral, Zenalyse offers a safe space to reflect and grow.
                </p>
                <h3 className="page-subtitle">Meet the Creator</h3>
                <p className="page-text">
                  Zenalyse was created by a passionate developer dedicated to using technology for social good. Connect with me on:
                </p>
                <ul className="page-list">
                  <li><a href="[Your GitHub URL]" className="page-link">GitHub</a></li>
                  <li><a href="[Your LinkedIn URL]" className="page-link">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>
        } />
        <Route path="/blog" element={
          <div className="page-container">
            <nav className="landing-nav">
              <div className="nav-left">
                <img src="/logo.png" alt="Zenalyse Logo" className="logo" />
                <span className="brand">ZENALYSE</span>
              </div>
              <div className="nav-right">
                <Link to="/tech">Tech</Link>
                <Link to="/about">About</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/chat">Chat with Zenalyse</Link>
              </div>
            </nav>
            <div className="content-wrapper">
              <div className="page-content">
                <h2 className="page-title">Zenalyse Blog</h2>
                <p className="page-text">
                  Stay tuned for updates, tips, and insights on mental health, AI technology, and how Zenalyse can support your well-being journey.
                </p>
                <div className="blog-posts">
                  <article className="blog-post">
                    <h3 className="post-title">Coming Soon: How AI Can Support Your Mental Health</h3>
                    <p className="post-text">
                      Learn how AI-powered tools like Zenalyse can provide real-time emotional support and daily insights to improve your mental well-being.
                    </p>
                  </article>
                  <article className="blog-post">
                    <h3 className="post-title">Coming Soon: The Power of BERT and Mistral in Zenalyse</h3>
                    <p className="post-text">
                      A deep dive into the AI models that make Zenalyse an empathetic and effective personal therapist.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;