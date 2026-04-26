# 🧠 AI SQL Agent

A GenAI-powered intelligent SQL assistant that converts natural language questions into executable SQL queries, provides autonomous visualizations, and maintains conversational context.

> **Built using:** LangChain + Pinecone + Groq + React + Streamlit  
> **Backend:** FastAPI (Python) + SQLite (Chinook DB)

---

## ✨ Recent Upgrades
- **Modern React Frontend**: Added a beautifully styled, lightning-fast Single Page Application (SPA) using React & Vite located in the `frontend/` directory. Features a premium dark mode UI, native chat-like interface, and SVG icons.
- **FastAPI CORS Integration**: Expanded the backend API (`server.py`) to seamlessly accept cross-origin requests (`CORSMiddleware`), effectively decoupling the frontend and backend architectures completely.
- **Dual Support**: Fully preserves the legacy Streamlit (`app.py`) application while allowing users to run the premium React web frontend using the same FastAPI interface!

---

## 🚀 Problem Statement

Non-technical stakeholders (like managers, marketers, and analysts) often struggle to retrieve insights from raw databases because they don't know SQL.

### 🔍 Example Problems:

> "Show me the top five customers by total invoice value"  
> "How many orders did we receive from each country?"  
> "Show total sales grouped by country"

Manually writing SQL queries for such questions is slow, repetitive, and requires technical knowledge.

---

## ✅ Use Case

This tool bridges the gap between business users and SQL databases by allowing anyone to ask data questions in plain English.

### 💼 Ideal For:

- Business dashboards
- Internal analytics tools
- Data teams working with non-technical users
- Students and developers building RAG-based AI apps

---

## 🛠 Tech Stack

| Component     | Tool / Framework                                       |
| ------------- | ------------------------------------------------------ |
| LLM           | [Groq](https://groq.com/) (Llama3.3 70B Turbo)         |
| RAG Framework | [LangChain](https://www.langchain.com/)                |
| Vector DB     | [Pinecone](https://www.pinecone.io/) (Cloud Vector DB) |
| Frontend      | [React](https://react.dev/) (Vite) & [Streamlit](https://streamlit.io/) |
| Database      | Chinook SQLite (sample DB)                             |

---

## 🧩 Folder Structure

```
ai-sql-agent/
├── data/
│   └── chinook.db              # SQLite database
├── src/
│   ├── ingestion.py            # Vector store creation/doc embedding
│   ├── rag.py                  # Core RAG logic & SQL generation
│   ├── database.py             # Database operations & safety checks
│   ├── logger.py               # Query logging
│   ├── visualization.py        # Dynamic chart generation
│   └── config.py               # Configuration constants
├── app.py                      # Legacy Streamlit application
├── server.py                   # FastAPI backend
├── frontend/                   # Modern React Frontend (Vite)
├── requirements.txt            # Project dependencies
└── .env                        # API Keys (Groq, Pinecone)
```

---

## ▶️ How to Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/Ujjval009/NL2SQL-Engine.git
   cd ai_sql_agent
   ```

2. **Install Dependencies** (Recommended: [uv](https://github.com/astral-sh/uv))
   ```bash
   uv pip install -r requirements.txt
   ```

3. **Set Environment Variables**
   Create a `.env` file:
   ```env
   GROQ_API_KEY=your_groq_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_index_name
   ```

4. **Initialize Data**
   ```bash
   python src/ingestion.py
   ```

5. **Start Backend & App**
   Run the FastAPI server and your choice of frontend:

   ```bash
   # Terminal 1: Start Backend API
   python server.py
   ```
   
   **Option A: React Frontend (Recommended)**
   ```bash
   # Terminal 2: Start Vite Dev Server
   cd frontend
   npm install
   npm run dev
   ```

   **Option B: Streamlit Frontend**
   ```bash
   # Terminal 2: Start Streamlit App
   streamlit run app.py
   ```

---

## Task to complete

After the initial showcase, the following advanced agentic features are planned:
- [ ] **Agentic Self-Correction**: Implement a reflection loop to self-heal SQL syntax errors in real-time.
- [ ] **Dynamic Few-Shot RAG**: Inject similar "Golden SQL" examples into the prompt for complex query accuracy.
- [ ] **SQL Explainability**: Add a Chain-of-Thought toggle to explain the logic behind generated queries.
- [ ] **Security Auditor Agent**: A dedicated LLM layer to validate SQL safety beyond standard regex checks.

---

## 🙋‍♂️ Author

**Ujjval Sharma**  
📍 GenAI Engineer 
🔗 [LinkedIn](https://www.linkedin.com/in/ujjval-sharma-b49938263/)  
🚀 Deep Learning | Multi-Agent Systems | RAG Pipelines

---

## ⭐️ Support the Project
If you find this project useful, please give it a ⭐️ on GitHub and connect with me for collaborations!
