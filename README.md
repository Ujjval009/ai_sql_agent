# AI SQL Agent

A GenAI-powered intelligent SQL assistant that converts natural language questions into executable SQL queries, provides autonomous visualizations, and maintains conversational context.

## Features

- **Natural Language to SQL** - Ask questions in plain English and get SQL queries
- **Smart Visualizations** - Automatic chart generation for query results
- **Dual Frontend Support** - React SPA or Streamlit interface
- **RAG-powered** - Uses LangChain and Pinecone for accurate SQL generation

## Tech Stack

| Component | Technology |
|-----------|------------|
| LLM | Groq (Llama3.3 70B Turbo) |
| RAG | LangChain |
| Vector DB | Pinecone |
| Backend | FastAPI |
| Database | SQLite (Chinook) |
| Frontend | React + Vite / Streamlit |

## Project Structure

```
ai-sql-agent/
├── src/
│   ├── config.py          # Configuration
│   ├── database.py        # DB operations & safety
│   ├── ingestion.py       # Vector store creation
│   ├── rag.py             # Core RAG logic
│   ├── logger.py          # Query logging
│   └── visualization.py   # Chart generation
├── frontend/              # React + Vite frontend
├── data/
│   └── chinook.db         # Sample SQLite database
├── app.py                 # Streamlit app
├── server.py              # FastAPI backend
└── requirements.txt       # Python dependencies
```

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Ujjval009/NL2SQL-Engine.git
cd ai_sql_agent
uv pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file:
```env
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
```

### 3. Initialize Data

```bash
python src/ingestion.py
```

### 4. Run the Application

**Backend:**
```bash
python server.py
```

**Frontend (choose one):**

React (recommended):
```bash
cd frontend
npm install
npm run dev
```

Or Streamlit:
```bash
streamlit run app.py
```

## Usage Examples

- "Show top 5 customers by total invoice value"
- "How many orders from each country?"
- "Total sales grouped by billing city"

## License

MIT