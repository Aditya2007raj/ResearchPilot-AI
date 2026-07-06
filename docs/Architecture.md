# ResearchPilot AI - Backend Architecture

## Technology Stack
- **Framework**: FastAPI (Python 3.10+)
- **AI/ML**: Google Gemini API
- **Vector Database**: ChromaDB
- **PDF Processing**: PyPDF2, pdfplumber
- **Async**: asyncio, aiohttp
- **Validation**: Pydantic v2
- **Testing**: pytest, pytest-asyncio

## Architecture Overview

### Layered Architecture
```
┌─────────────────────────────────────┐
│         API Layer (FastAPI)         │
│  - Routes                           │
│  - Request/Response Validation      │
│  - Authentication (Future)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Service Layer (Core)          │
│  - Business Logic                   │
│  - Orchestration                    │
│  - Error Handling                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Data Access Layer (DB)         │
│  - ChromaDB Operations              │
│  - Vector Store Management          │
│  - File Storage                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     External Services               │
│  - Gemini API                       │
│  - File System                      │
└─────────────────────────────────────┘
```

## Core Components

### 1. API Layer (`app/api/`)

#### upload.py
- **POST /api/upload/pdf**
  - Accepts PDF file (max 10MB)
  - Validates file type
  - Stores temporarily
  - Returns file ID for processing
  - Async file upload handling

#### analysis.py
- **GET /api/analysis/{file_id}/summary**
  - Generates smart summary
  - Returns structured summary
  
- **GET /api/analysis/{file_id}/beginner**
  - Generates beginner-friendly explanation
  - Simplifies technical concepts
  
- **GET /api/analysis/{file_id}/review**
  - Generates research review
  - Critiques methodology, findings
  
- **GET /api/analysis/{file_id}/action-plan**
  - Generates action plan
  - Provides next steps for learning/research

#### chat.py
- **POST /api/chat**
  - Accepts user question
  - Performs RAG search
  - Returns context-aware answer
  - Streaming response support

### 2. Service Layer (`app/core/`)

#### pdf_processor.py
```python
class PDFProcessor:
    - extract_text(pdf_path: str) -> str
    - extract_metadata(pdf_path: str) -> dict
    - chunk_text(text: str, chunk_size: int) -> List[str]
    - clean_text(text: str) -> str
```

**Key Features**:
- Multi-page text extraction
- Metadata extraction (title, authors, abstract)
- Intelligent chunking for RAG
- Text cleaning and normalization

#### gemini_client.py
```python
class GeminiClient:
    - __init__(api_key: str)
    - generate_summary(text: str) -> str
    - generate_beginner_explanation(text: str) -> str
    - generate_review(text: str) -> str
    - generate_action_plan(text: str) -> str
    - chat_completion(messages: List[dict]) -> str
    - stream_completion(messages: List[dict]) -> AsyncIterator
```

**Key Features**:
- Singleton pattern for API client
- Retry logic with exponential backoff
- Rate limiting handling
- Prompt template management
- Streaming support for chat

#### rag_engine.py
```python
class RAGEngine:
    - __init__(vector_store: VectorStore)
    - index_document(file_id: str, chunks: List[str]) -> None
    - search(query: str, top_k: int = 5) -> List[dict]
    - delete_document(file_id: str) -> None
    - get_context(query: str) -> str
```

**Key Features**:
- Document indexing with embeddings
- Semantic search
- Context retrieval for chat
- Document lifecycle management

#### summarizer.py
```python
class Summarizer:
    - __init__(gemini_client: GeminiClient)
    - create_smart_summary(text: str) -> dict
    - create_beginner_explanation(text: str) -> dict
    - create_research_review(text: str) -> dict
    - create_action_plan(text: str) -> dict
```

**Key Features**:
- Orchestration of Gemini calls
- Response parsing and formatting
- Caching of results
- Progress tracking

### 3. Data Access Layer (`app/db/`)

#### chroma_client.py
```python
class ChromaClient:
    - __init__(persist_directory: str)
    - get_or_create_collection(name: str) -> Collection
    - close() -> None
```

**Key Features**:
- ChromaDB connection management
- Collection lifecycle
- Persistent storage configuration

#### vector_store.py
```python
class VectorStore:
    - __init__(chroma_client: ChromaClient)
    - add_embeddings(file_id: str, chunks: List[str], metadata: dict) -> None
    - query_embeddings(query: str, n_results: int) -> List[dict]
    - delete_by_file_id(file_id: str) -> None
    - get_file_ids() -> List[str]
```

**Key Features**:
- Embedding generation (via Gemini)
- Vector operations
- Metadata management
- Query optimization

### 4. Models (`app/models/`)

#### schemas.py
```python
class UploadResponse(BaseModel):
    file_id: str
    filename: str
    status: str

class SummaryResponse(BaseModel):
    file_id: str
    summary: str
    key_points: List[str]
    generated_at: datetime

class BeginnerResponse(BaseModel):
    file_id: str
    explanation: str
    simplified_concepts: List[str]
    generated_at: datetime

class ReviewResponse(BaseModel):
    file_id: str
    review: str
    strengths: List[str]
    weaknesses: List[str]
    generated_at: datetime

class ActionPlanResponse(BaseModel):
    file_id: str
    action_plan: str
    next_steps: List[str]
    resources: List[str]
    generated_at: datetime

class ChatRequest(BaseModel):
    file_id: str
    question: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]
    confidence: float
```

### 5. Middleware (`app/middleware/`)

#### error_handler.py
- Global exception handling
- Custom error responses
- Logging configuration
- CORS setup

## Data Flow

### PDF Upload Flow
```
User Upload PDF
    ↓
API validates file
    ↓
Store in uploads/ directory
    ↓
Extract text & metadata
    ↓
Chunk text for RAG
    ↓
Generate embeddings
    ↓
Store in ChromaDB
    ↓
Return file_id
```

### Analysis Generation Flow
```
Request analysis
    ↓
Retrieve text from ChromaDB
    ↓
Call Gemini API with prompt
    ↓
Parse response
    ↓
Cache result
    ↓
Return structured response
```

### Chat/RAG Flow
```
User asks question
    ↓
Embed question
    ↓
Search ChromaDB for relevant chunks
    ↓
Construct prompt with context
    ↓
Call Gemini API
    ↓
Stream response
    ↓
Return answer with sources
```

## Configuration

### config.py
```python
class Settings(BaseSettings):
    # API
    GEMINI_API_KEY: str
    API_PREFIX: str = "/api"
    
    # File Storage
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # ChromaDB
    CHROMA_PERSIST_DIR: str = "chroma_db"
    COLLECTION_NAME: str = "research_papers"
    
    # Processing
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K_RESULTS: int = 5
    
    # Gemini
    GEMINI_MODEL: str = "gemini-pro"
    TEMPERATURE: float = 0.7
    MAX_TOKENS: int = 2048
    
    class Config:
        env_file = ".env"
```

## Error Handling Strategy

### Error Types
- **ValidationError**: Invalid input (400)
- **FileProcessingError**: PDF parsing failed (422)
- **APIError**: Gemini API failure (502)
- **DatabaseError**: ChromaDB failure (500)
- **NotFoundError**: Resource not found (404)

### Retry Logic
- Gemini API: 3 retries with exponential backoff
- ChromaDB operations: 2 retries
- File operations: No retry (fail fast)

## Performance Considerations

### Async Operations
- All I/O operations are async
- Concurrent PDF processing
- Streaming responses for chat
- Background task for indexing

### Caching Strategy
- In-memory cache for analysis results
- TTL: 24 hours
- Cache key: `{file_id}_{analysis_type}`
- Invalidation on file deletion

### Rate Limiting
- Per-IP rate limit: 100 requests/minute
- Gemini API quota management
- Queue system for heavy operations

## Security Considerations

### Input Validation
- File type validation (PDF only)
- File size limits
- SQL injection prevention (ChromaDB)
- Prompt injection mitigation

### API Security
- API key management (environment variables)
- CORS configuration
- Request size limits
- Sanitization of user inputs

### File Security
- Temporary file cleanup
- Secure file naming
- Access control on uploads directory

## Monitoring & Logging

### Logging Levels
- INFO: API requests, successful operations
- WARNING: Retries, slow operations
- ERROR: Failed operations, API errors
- DEBUG: Detailed processing steps

### Metrics to Track
- Request latency
- API call count
- File processing time
- Cache hit rate
- Error rates

## Scalability Considerations

### Current MVP Design
- Single server deployment
- Local ChromaDB instance
- No user authentication
- No database persistence beyond ChromaDB

### Future Scalability
- Horizontal scaling with load balancer
- Distributed ChromaDB
- User authentication & multi-tenancy
- PostgreSQL for metadata
- Redis for caching
- Message queue for async processing
