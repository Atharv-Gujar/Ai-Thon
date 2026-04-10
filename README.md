# 📄 Research Paper Q&A — RAG AI Assistant

> Upload a research paper PDF and ask questions about it instantly, powered by **Gemini**, **Pinecone**, and **Cohere** embeddings.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![n8n](https://img.shields.io/badge/n8n-Automation-FF6D5A?logo=n8n)

---

## ✨ Features

- **PDF Upload & Indexing** — Drag-and-drop or click-to-browse file uploader with real-time status feedback
- **AI-Powered Q&A** — Ask natural language questions and get answers grounded in your paper's content
- **Chat History** — Persistent chat sessions saved to localStorage with session switching
- **New Chat / Clear Chat** — Start fresh conversations or clear current chat anytime
- **Auto-Titling** — Chat sessions auto-name from your first question
- **Typing Indicator** — Animated 3-dot loader while the AI generates a response
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Error Handling** — Graceful error messages in chat if API calls fail

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  Upload Page ─── POST /webhook/upload-paper ───────┐ │
│  Chat Page   ─── POST /webhook/rag-agent ────────┐ │ │
└──────────────────────────────────────────────────┼─┼─┘
                                                   │ │
┌──────────────────────────────────────────────────┼─┼─┐
│                  n8n Workflow                    │ │ │
│                                                  ▼ ▼ │
│  Upload Flow:                                        │
│    PDF → Cohere Embeddings → Pinecone (insert)       │
│                                                      │
│  Query Flow:                                         │
│    Question → Gemini 3 Pro → Pinecone (retrieve)     │
│            → RAG Agent → Response                    │
└──────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite 5, Tailwind CSS 3  |
| Icons     | Lucide React                      |
| HTTP      | Axios                             |
| Routing   | React Router DOM 6                |
| Backend   | n8n (workflow automation)         |
| LLM       | Google Gemini 3 Pro               |
| Embeddings| Cohere (embed-multilingual-v2.0)  |
| Vector DB | Pinecone                          |

---

## 📁 Project Structure

```
src/
├── api/
│   └── ragApi.js              # API client (uploadPaper, queryPaper)
├── components/
│   ├── ChatHistory.jsx        # Slide-out history sidebar
│   ├── ChatWindow.jsx         # Scrollable message list + empty state
│   ├── FileUploader.jsx       # Drag-and-drop PDF upload zone
│   ├── MessageBubble.jsx      # User/AI chat message bubble
│   ├── StatusBadge.jsx        # Upload status indicator
│   └── TypingIndicator.jsx    # Animated 3-dot loader
├── pages/
│   ├── UploadPage.jsx         # PDF upload page (route: /)
│   └── ChatPage.jsx           # Chat interface (route: /chat)
├── App.jsx                    # Router setup
├── main.jsx                   # Entry point
└── index.css                  # Design system + animations
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An active n8n workflow with the RAG pipeline (see [Backend Setup](#-backend-setup))

### Installation

```bash
# Clone the repository
git clone https://github.com/Atharv-Gujar/Ai-Thon.git
cd Ai-Thon

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Configuration

Edit `.env` with your n8n webhook URL:

```env
VITE_API_BASE_URL=https://your-n8n-instance.app.n8n.cloud/webhook
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Backend Setup

The backend is an **n8n workflow** with two webhook endpoints:

### 1. Upload Paper — `POST /webhook/upload-paper`
- Receives PDF as `multipart/form-data` (field: `data`)
- Splits text using Recursive Character Text Splitter (overlap: 200)
- Generates embeddings via Cohere (`embed-multilingual-v2.0`)
- Stores vectors in Pinecone (namespace: `RESEARCH_PAPER`)
- Returns: `"Paper uploaded and indexed successfully."`

### 2. Query Paper — `POST /webhook/rag-agent`
- Receives JSON: `{ "query": { "query": "your question" } }`
- Retrieves relevant context from Pinecone
- Generates answer using Gemini 3 Pro with system prompt
- Returns: plain text response

### n8n Webhook CORS

Add your frontend URL to the webhook node's **Allowed Origins (CORS)** option:
```
http://localhost:5173
```

---

## 📸 Screenshots

### Upload Page
- Centered card with drag-and-drop upload zone
- File preview with size badge
- Animated upload states (loading → success → redirect)

### Chat Page
- Full-height chat window with message bubbles
- History sidebar with session management
- Fixed input bar with Enter-to-send

---

## 📄 API Reference

### Upload Paper
```http
POST /webhook/upload-paper
Content-Type: multipart/form-data

Field: data (PDF file)
```

### Query Paper
```http
POST /webhook/rag-agent
Content-Type: application/json

{
  "query": {
    "query": "What is the main contribution of this paper?"
  }
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project was built for **Hackathon 2025**.

---

<p align="center">
  Made with ❤️ using React, n8n, Gemini, Pinecone & Cohere
</p>
