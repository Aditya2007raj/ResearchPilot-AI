# ResearchPilot AI - API Endpoint Plan

## Base URL
```
Development: http://localhost:8000
Production: https://api.researchpilot.ai (future)
```

## API Version
```
Current: v1
Prefix: /api/v1
```

## Authentication
**MVP Status**: No authentication required
**Future**: JWT-based authentication for user accounts

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { /* additional error details */ }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Endpoints

### 1. Upload Endpoints

#### POST /api/v1/upload/pdf
Upload a research paper PDF for processing.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  ```json
  {
    "file": <PDF file>,
    "title": "Optional paper title" (optional)
  }
  ```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "research_paper.pdf",
    "file_size": 2456789,
    "status": "processing",
    "uploaded_at": "2024-01-15T10:30:00Z"
  },
  "message": "File uploaded successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid file type
- `413 Payload Too Large`: File exceeds 10MB limit
- `500 Internal Server Error`: Upload processing failed

**Validation Rules**:
- File type: PDF only
- File size: Max 10MB
- Filename: Valid UTF-8 string

---

#### GET /api/v1/upload/status/{file_id}
Check the processing status of an uploaded file.

**Request**:
- Method: `GET`
- Parameters:
  - `file_id` (path): UUID of the uploaded file

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "stages": {
      "upload": "completed",
      "extraction": "completed",
      "chunking": "completed",
      "indexing": "completed"
    },
    "chunks_count": 45,
    "processed_at": "2024-01-15T10:31:00Z"
  }
}
```

**Status Values**:
- `processing`: File is being processed
- `completed`: All stages completed
- `failed`: Processing failed

**Error Responses**:
- `404 Not Found`: File ID does not exist

---

### 2. Analysis Endpoints

#### GET /api/v1/analysis/{file_id}/summary
Generate a smart summary of the research paper.

**Request**:
- Method: `GET`
- Parameters:
  - `file_id` (path): UUID of the uploaded file
  - `force_refresh` (query, optional): Boolean to bypass cache

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "summary": "This paper presents a novel approach to...",
    "key_points": [
      "Point 1: The main contribution is...",
      "Point 2: The methodology uses...",
      "Point 3: Results show..."
    ],
    "main_contribution": "The paper introduces...",
    "methodology": "The authors used...",
    "results": "The experiments demonstrate...",
    "conclusion": "In conclusion, this paper...",
    "generated_at": "2024-01-15T10:32:00Z",
    "cached": false
  }
}
```

**Error Responses**:
- `404 Not Found`: File ID does not exist
- `422 Unprocessable Entity`: File processing not completed
- `502 Bad Gateway`: Gemini API error

**Performance**:
- Cached response: <100ms
- Fresh generation: 5-15 seconds

---

#### GET /api/v1/analysis/{file_id}/beginner
Generate a beginner-friendly explanation of the paper.

**Request**:
- Method: `GET`
- Parameters:
  - `file_id` (path): UUID of the uploaded file
  - `force_refresh` (query, optional): Boolean to bypass cache

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "explanation": "Imagine you're trying to teach a computer...",
    "simplified_concepts": [
      {
        "term": "Neural Network",
        "explanation": "Think of it like a brain..."
      },
      {
        "term": "Gradient Descent",
        "explanation": "It's like walking down a hill..."
      }
    ],
    "analogy": "This is similar to how...",
    "prerequisites": [
      "Basic understanding of programming",
      "High school mathematics"
    ],
    "difficulty_level": "intermediate",
    "generated_at": "2024-01-15T10:33:00Z",
    "cached": false
  }
}
```

**Error Responses**:
- `404 Not Found`: File ID does not exist
- `422 Unprocessable Entity`: File processing not completed
- `502 Bad Gateway`: Gemini API error

---

#### GET /api/v1/analysis/{file_id}/review
Generate a critical research review of the paper.

**Request**:
- Method: `GET`
- Parameters:
  - `file_id` (path): UUID of the uploaded file
  - `force_refresh` (query, optional): Boolean to bypass cache

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "review": "This paper makes a significant contribution to...",
    "strengths": [
      "Novel methodology",
      "Comprehensive experiments",
      "Clear presentation"
    ],
    "weaknesses": [
      "Limited dataset size",
      "Missing comparison with state-of-the-art",
      "Unclear reproducibility details"
    ],
    "methodology_critique": "The approach is innovative but...",
    "results_critique": "The results are promising but...",
    "overall_rating": 7.5,
    "recommendation": "Recommended for researchers in...",
    "generated_at": "2024-01-15T10:34:00Z",
    "cached": false
  }
}
```

**Error Responses**:
- `404 Not Found`: File ID does not exist
- `422 Unprocessable Entity`: File processing not completed
- `502 Bad Gateway`: Gemini API error

---

#### GET /api/v1/analysis/{file_id}/action-plan
Generate an action plan based on the paper.

**Request**:
- Method: `GET`
- Parameters:
  - `file_id` (path): UUID of the uploaded file
  - `force_refresh` (query, optional): Boolean to bypass cache

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "action_plan": "To implement the ideas from this paper...",
    "next_steps": [
      {
        "step": 1,
        "action": "Read the background papers",
        "estimated_time": "2-3 hours",
        "priority": "high"
      },
      {
        "step": 2,
        "action": "Set up the development environment",
        "estimated_time": "1-2 hours",
        "priority": "high"
      }
    ],
    "resources": [
      {
        "type": "paper",
        "title": "Related work",
        "url": "https://arxiv.org/..."
      },
      {
        "type": "tool",
        "title": "PyTorch",
        "url": "https://pytorch.org/"
      }
    ],
    "learning_path": [
      "Step 1: Understand the basics",
      "Step 2: Implement the core algorithm",
      "Step 3: Run experiments"
    ],
    "generated_at": "2024-01-15T10:35:00Z",
    "cached": false
  }
}
```

**Error Responses**:
- `404 Not Found`: File ID does not exist
- `422 Unprocessable Entity`: File processing not completed
- `502 Bad Gateway`: Gemini API error

---

#### GET /api/v1/analysis/{file_id}/all
Get all analysis types in a single request.

**Request**:
- Method: `GET`
- Parameters:
  - `file_id` (path): UUID of the uploaded file
  - `force_refresh` (query, optional): Boolean to bypass cache

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "summary": { /* summary data */ },
    "beginner": { /* beginner data */ },
    "review": { /* review data */ },
    "action_plan": { /* action plan data */ },
    "generated_at": "2024-01-15T10:36:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: File ID does not exist
- `422 Unprocessable Entity`: File processing not completed
- `502 Bad Gateway`: Gemini API error

**Performance**:
- Parallel generation: 15-30 seconds
- Cached response: <200ms

---

### 3. Chat/RAG Endpoints

#### POST /api/v1/chat
Ask a question about the uploaded paper using RAG.

**Request**:
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "question": "What is the main contribution of this paper?",
    "history": [
      {
        "role": "user",
        "content": "Previous question"
      },
      {
        "role": "assistant",
        "content": "Previous answer"
      }
    ]
  }
  ```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "answer": "The main contribution of this paper is...",
    "sources": [
      {
        "chunk_id": "chunk_001",
        "text": "The main contribution of this work is...",
        "page_number": 1,
        "section": "abstract",
        "relevance_score": 0.95
      },
      {
        "chunk_id": "chunk_015",
        "text": "We propose a novel method...",
        "page_number": 3,
        "section": "introduction",
        "relevance_score": 0.87
      }
    ],
    "confidence": 0.92,
    "follow_up_questions": [
      "How does this compare to previous work?",
      "What are the limitations?"
    ]
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid question format
- `404 Not Found`: File ID does not exist
- `422 Unprocessable Entity`: File processing not completed
- `502 Bad Gateway`: Gemini API error

**Performance**:
- Response time: 2-5 seconds

---

#### POST /api/v1/chat/stream
Stream chat responses for real-time interaction.

**Request**:
- Method: `POST`
- Content-Type: `application/json`
- Body: Same as `/api/v1/chat`

**Response**:
- Content-Type: `text/event-stream`
- Streaming chunks of the answer

**Stream Format**:
```
data: {"type": "chunk", "content": "The main"}

data: {"type": "chunk", "content": " contribution"}

data: {"type": "sources", "sources": [...]}

data: {"type": "done", "confidence": 0.92}
```

**Error Responses**:
- Same as `/api/v1/chat`

---

### 4. File Management Endpoints

#### GET /api/v1/files/{file_id}
Get metadata about an uploaded file.

**Request**:
- Method: `GET`
- Parameters:
  - `file_id` (path): UUID of the uploaded file

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "research_paper.pdf",
    "file_size": 2456789,
    "title": "Novel Approach to Machine Learning",
    "authors": ["John Doe", "Jane Smith"],
    "upload_date": "2024-01-15T10:30:00Z",
    "status": "completed",
    "chunks_count": 45,
    "analyses_available": {
      "summary": true,
      "beginner": true,
      "review": true,
      "action_plan": true
    }
  }
}
```

**Error Responses**:
- `404 Not Found`: File ID does not exist

---

#### DELETE /api/v1/files/{file_id}
Delete an uploaded file and all associated data.

**Request**:
- Method: `DELETE`
- Parameters:
  - `file_id` (path): UUID of the uploaded file

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "deleted_at": "2024-01-15T11:00:00Z"
  },
  "message": "File deleted successfully"
}
```

**Error Responses**:
- `404 Not Found`: File ID does not exist
- `500 Internal Server Error`: Deletion failed

---

#### GET /api/v1/files
List all uploaded files (MVP: no pagination).

**Request**:
- Method: `GET`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "file_id": "550e8400-e29b-41d4-a716-446655440000",
        "filename": "research_paper.pdf",
        "title": "Novel Approach to Machine Learning",
        "upload_date": "2024-01-15T10:30:00Z",
        "status": "completed"
      }
    ],
    "total": 1
  }
}
```

**Future Enhancement**: Add pagination, filtering, sorting

---

### 5. Health & System Endpoints

#### GET /api/v1/health
Health check endpoint.

**Request**:
- Method: `GET`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0",
    "services": {
      "chromadb": "connected",
      "gemini_api": "operational",
      "storage": "available"
    }
  }
}
```

**Response (503 Service Unavailable)**:
```json
{
  "success": false,
  "data": {
    "status": "unhealthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "services": {
      "chromadb": "disconnected",
      "gemini_api": "operational",
      "storage": "available"
    }
  }
}
```

---

#### GET /api/v1/stats
Get system statistics (MVP: basic stats).

**Request**:
- Method: `GET`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total_files": 10,
    "total_chunks": 450,
    "total_analyses": 40,
    "api_calls_today": 150,
    "average_response_time": 2.5
  }
}
```

**Future Enhancement**: Add detailed analytics, user-specific stats

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required (future) |
| `FORBIDDEN` | 403 | Access denied (future) |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `PAYLOAD_TOO_LARGE` | 413 | Request exceeds size limit |
| `UNPROCESSABLE_ENTITY` | 422 | Cannot process request |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests (future) |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `GATEWAY_TIMEOUT` | 504 | External service timeout |

## Rate Limiting

**MVP Status**: No rate limiting
**Future Implementation**:
- 100 requests per minute per IP
- 1000 requests per day per IP
- Burst allowance: 20 requests

## CORS Configuration

**Allowed Origins**:
- Development: `http://localhost:3000`
- Production: `https://researchpilot.ai`

**Allowed Methods**:
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers**:
- Content-Type, Authorization

## Request/Response Examples

### Example 1: Complete Upload Flow

```bash
# 1. Upload PDF
curl -X POST http://localhost:8000/api/v1/upload/pdf \
  -F "file=@research_paper.pdf"

# Response: {"file_id": "abc123", ...}

# 2. Check status
curl http://localhost:8000/api/v1/upload/status/abc123

# Response: {"status": "completed", ...}

# 3. Get summary
curl http://localhost:8000/api/v1/analysis/abc123/summary

# Response: {"summary": "...", ...}
```

### Example 2: Chat Interaction

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "abc123",
    "question": "What is the main contribution?"
  }'

# Response: {"answer": "...", "sources": [...]}
```

## API Versioning Strategy

### URL Versioning
- Current: `/api/v1/`
- Future: `/api/v2/` for breaking changes

### Deprecation Policy
- Notify 3 months before deprecation
- Maintain deprecated endpoints for 6 months
- Document migration guide

## Testing Endpoints

### Local Testing
```bash
# Start backend
cd Backend
uvicorn app.main:app --reload

# Test health
curl http://localhost:8000/api/v1/health

# Test upload
curl -X POST http://localhost:8000/api/v1/upload/pdf \
  -F "file=@test.pdf"
```

### API Documentation
FastAPI provides automatic Swagger UI at:
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## Security Considerations

### Input Validation
- All inputs validated with Pydantic
- File type and size validation
- SQL injection prevention (ChromaDB)
- Prompt injection mitigation

### API Key Management
- Gemini API key in environment variables
- Never expose in logs or responses
- Rotate keys regularly

### HTTPS (Production)
- Enforce HTTPS in production
- Use TLS 1.2+
- Valid SSL certificate

## Monitoring

### Logging
- Log all API requests
- Log errors with stack traces
- Log performance metrics

### Metrics
- Request count per endpoint
- Response time percentiles
- Error rate
- Cache hit rate

## Future Enhancements

### Phase 2
- User authentication endpoints
- User-specific file management
- Saved analyses
- Comparison endpoints

### Phase 3
- Batch analysis
- Export endpoints (PDF, Markdown)
- Collaboration features
- Advanced search filters
- Webhook notifications
