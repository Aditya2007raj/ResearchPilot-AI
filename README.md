<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=220&section=header&text=ResearchPilot&fontSize=52&fontColor=ffffff&animation=fadeIn&desc=Research%20Smarter.%20Verify%20Faster.%20Build%20Better.&descAlignY=60&descSize=18" width="100%"/>
<br/>
[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=24&duration=3000&pause=800&color=6366F1&center=true&vCenter=true&width=650&lines=Citation-Grounded+AI+Research+Workspace;Upload.+Analyze.+Review.+Replicate.+Chat.;FastAPI+%2B+ChromaDB+%2B+Gemini+%2B+React)](https://git.io/typing-svg)
 
<br/>
![Visitors](https://api.visitorbadge.io/api/visitors?path=Aditya2007raj%2FResearchPilot-AI&label=Visitors&countColor=%236366F1)
![Stars](https://img.shields.io/github/stars/Aditya2007raj/ResearchPilot-AI?style=for-the-badge&color=6366F1)
![Forks](https://img.shields.io/github/forks/Aditya2007raj/ResearchPilot-AI?style=for-the-badge&color=4F46E5)
![License](https://img.shields.io/badge/license-MIT-4338CA?style=for-the-badge)
 
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![ChromaDB](https://img.shields.io/badge/ChromaDB-6366F1?style=for-the-badge&logo=databricks&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
 
</div>
---
 
## 🧠 About The Project
 
**ResearchPilot** is a full-stack, citation-grounded AI research workspace. Instead of skimming a paper for hours or trusting a chatbot that quietly hallucinates statistics, you upload a PDF and get a structured, verifiable workspace: summary, critical review, replication roadmap, and a RAG chat — every claim traceable back to the exact source chunk it came from.
 
### 🎯 The Problem
 
Academic research workflows are fragmented and slow:
 
- 📚 **Information overload** — thousands of long papers, no fast way to filter them
- 🐢 **Manual review takes weeks** — synthesizing methodology and extraction plans by hand
- 🤥 **Weak AI grounding** — standard ChatGPT wrappers hallucinate metrics with no citation bounds
- 🧩 **Disconnected tools** — reading, planning, and chatting with a paper happen in five different apps
### 💡 Who It's For
 
- 🎓 Students and researchers who need to process papers fast, without losing rigor
- 🧑‍🔬 Anyone trying to replicate or extend published methodology
- 👩‍💻 Developers exploring **RAG + vector search + multi-stage LLM pipelines** in a real project
---
 
## 📸 Project Preview
 
| Dashboard | Analyze |
|:---:|:---:|
| ![Dashboard](./screenshots/dashboard.png) | ![Analyze](./screenshots/analyze.png) |
 
| Review | Action Plan |
|:---:|:---:|
| ![Review](./screenshots/review.png) | ![Action Plan](./screenshots/action-plan.png) |
 
| Chat with Citations |
|:---:|
| ![Chat](./screenshots/chat.png) |
 
---
 
## 🏗️ Architecture
 
```mermaid
flowchart TD
    A[React Frontend] --> B[FastAPI Backend]
    B --> C[PyMuPDF Text Extraction]
    C --> D[Text Chunker<br/>1000 chars · 200 overlap]
    D --> E[Sentence-Transformer Embeddings<br/>all-MiniLM-L6-v2 · 384-dim]
    E --> F[(ChromaDB Vector Store)]
    F --> G[Gemini LLM]
    G --> H[Summary · Review · Action Plan]
    F --> I[RAG Retrieval<br/>Top-5 Chunks]
    I --> G
    G --> J[Chat Answer + Confidence + Citations]
    H --> A
    J --> A
```
 
---
 
## 🔍 Research Workflow
 
```mermaid
flowchart LR
    U[📥 Ingest] --> P[🔬 Analyze]
    P --> B[🧪 Evaluate]
    B --> R[🛠️ Replicate]
    R --> O[💬 Inquire]
```
 
Every paper moves through the natural path of scientific inquiry — **Ingest → Analyze → Evaluate → Replicate → Inquire** — with citation chips linking every AI claim back to its source fragment in the References panel.
 
---
 
## 📂 Folder Structure
 
```
ResearchPilot/
├── backend/
│   ├── app/
│   │   ├── api/          # upload.py, analysis.py, review.py, action.py, chat.py, papers.py
│   │   ├── db/            # chroma_client.py, vector_store.py, metadata_store.py
│   │   ├── models/        # schemas.py
│   │   ├── services/      # pdf_processor.py, text_chunker.py, embedding_service.py, rag_engine.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/layout/    # Sidebar.jsx, Topbar.jsx, AppShell.jsx
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── upload/
│   │   │   └── workspace/        # AnalyzePage, ReviewPage, ActionPlanPage, ChatPage
│   │   ├── lib/                  # api.js, hooks.js, routes.js
│   │   └── routes/AppRoutes.jsx
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
└── README.md
```
 
---
 
## ⚙️ Installation
 
### 1. Clone the repository
```bash
git clone https://github.com/Aditya2007raj/ResearchPilot-AI.git
cd ResearchPilot-AI
```
 
### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # macOS/Linux
 
pip install -r requirements.txt
```
 
### 3. Configure Environment
```bash
cp .env.example .env
# Add your GEMINI_API_KEY
```
 
### 4. Run Backend
```bash
uvicorn app.main:app --reload
```
 
### 5. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
 
---
 
## 🔑 Environment Variables
 
| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key powering analysis, review, and chat |
 
---
 
## 🔌 API Endpoints
 
### Ingestion & Library
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/upload/pdf` | Upload and process a PDF |
| GET | `/api/v1/papers` | List all papers |
| GET | `/api/v1/papers/stats` | Dashboard statistics |
 
### Analysis
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/analysis/{file_id}/summary` | Problem, method, results, limitations, future work |
| GET | `/api/v1/analysis/{file_id}/review` | Quality scores, strengths, weaknesses |
| GET | `/api/v1/analysis/{file_id}/action-plan` | Skills, learning path, project extensions |
 
### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/chat/{file_id}` | Ask a question, get a grounded answer + confidence + sources |
 
---
 
## 🛠️ Tech Stack
 
<table align="center">
<tr>
<td valign="top" width="25%">
**Frontend**
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
</td>
<td valign="top" width="25%">
**Backend**
- FastAPI
- Pydantic
- SQLite
</td>
<td valign="top" width="25%">
**AI Layer**
- Google Gemini
- Sentence-Transformers
- RAG Pipeline
</td>
<td valign="top" width="25%">
**Vector Search**
- ChromaDB
- PyMuPDF
- Cosine Similarity Scoring
</td>
</tr>
</table>
---
 
## ✨ Features
 
| | | |
|---|---|---|
| 📤 Drag-and-Drop Ingestion | 🧠 AI Summarization | 📊 Live Dashboard Stats |
| 🔍 Critical Quality Review | 🗺️ Replication Action Plan | 💬 RAG Chat with Citations |
| 📎 Clickable Source References | 🎯 Confidence Scoring | 🧩 Progressive Disclosure UI |
| 🌙 Academic Dark Theme | ⚡ FastAPI Backend | 🧱 Clean Modular Architecture |
 
---
 
## 📌 Current Status
 
**✅ Completed**
- Drag-and-drop ingestion with progress pipeline and file validation
- SQLite metadata store with schema migrations
- Workspace shell with collapsible References panel
- Interactive Analyze accordion views
- Critical Quality Review scoring
- Action Plan replication tracker
- RAG chat with similarity-based confidence and citation binding
- Dashboard with live library statistics
**⚠️ Known Limitations**
- RAG retrieval is scoped to the active document only — cross-document corpus search is not yet implemented
---
 
## 🗺️ Roadmap
 
- [ ] 🔗 Cross-document corpus search
- [ ] 📄 Export analysis to PDF/Markdown
- [ ] 👥 Multi-user collaborative workspaces
- [ ] 🕸️ Citation graph visualization across a paper library
- [ ] 🔌 Support for additional LLM providers
- [ ] 🐳 Docker deployment
- [ ] 🔁 CI/CD pipeline
---
 
## 📈 GitHub Stats
 
<div align="center">
![Stats](https://github-readme-stats.vercel.app/api?username=Aditya2007raj&show_icons=true&theme=tokyonight&hide_border=true)
![Streak](https://github-readme-streak-stats.herokuapp.com/?user=Aditya2007raj&theme=tokyonight&hide_border=true)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=Aditya2007raj&layout=compact&theme=tokyonight&hide_border=true)
 
</div>
---
 
## 🤝 Contributing
 
1. Fork the repository
2. Create a branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open a Pull Request
---
 
## 📄 License
 
Distributed under the **MIT License**. See `LICENSE` for details.
 
---
 
## 📬 Contact
 
<div align="center">
[![GitHub](https://img.shields.io/badge/GitHub-Aditya2007raj-181717?style=for-the-badge&logo=github)](https://github.com/Aditya2007raj)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/aditya-raj-7a506a333/)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:aadiraj2007singh@gmail.com)
 
</div>
---
 
## ⭐ Support
 
If this project helped you, consider:
 
- ⭐ **Starring** the repo
- 🍴 **Forking** it
- 🐛 **Reporting issues**
- 🤝 **Contributing**
---
 
<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer"/>
Made with 🧠 by **Aditya Raj Singh Shekhawat**
 
</div>
