# ResearchPilot AI - Database Design

## Overview

ResearchPilot uses **ChromaDB** as the primary vector database for RAG (Retrieval-Augmented Generation) operations. ChromaDB is chosen for its:
- Simplicity and ease of use
- Built-in embedding support
- Local persistence
- Python-native integration
- Open-source and free

## Database Architecture

### ChromaDB Collection Structure

```
Collection: research_papers
├── Documents (text chunks)
├── Embeddings (vector representations)
├── Metadata (document attributes)
└── IDs (unique identifiers)
```

## Collection Schema

### Primary Collection: `research_papers`

#### Document Schema
```python
{
    "ids": ["chunk_001", "chunk_002", ...],
    "documents": [
        "Text chunk 1 content...",
        "Text chunk 2 content...",
        ...
    ],
    "embeddings": [
        [0.1, 0.2, 0.3, ...],  # Vector 1
        [0.4, 0.5, 0.6, ...],  # Vector 2
        ...
    ],
    "metadatas": [
        {
            "file_id": "abc123",
            "chunk_index": 0,
            "page_number": 1,
            "section": "abstract",
            "token_count": 150,
            "created_at": "2024-01-15T10:30:00Z"
        },
        {
            "file_id": "abc123",
            "chunk_index": 1,
            "page_number": 2,
            "section": "introduction",
            "token_count": 200,
            "created_at": "2024-01-15T10:30:00Z"
        },
        ...
    ]
}
```

### Metadata Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `file_id` | string | Unique identifier for the uploaded PDF | Yes |
| `chunk_index` | integer | Index of the chunk within the document | Yes |
| `page_number` | integer | Page number in the original PDF | Yes |
| `section` | string | Document section (abstract, intro, methods, etc.) | No |
| `token_count` | integer | Number of tokens in the chunk | Yes |
| `created_at` | string | ISO 8601 timestamp of chunk creation | Yes |
| `title` | string | Paper title (if available) | No |
| `authors` | string | Paper authors (if available) | No |
| `publication_year` | integer | Year of publication (if available) | No |

## Document Indexing Strategy

### Chunking Configuration

```python
CHUNK_SIZE = 1000          # Characters per chunk
CHUNK_OVERLAP = 200        # Overlap between chunks
MIN_CHUNK_SIZE = 100       # Minimum chunk size
MAX_CHUNK_SIZE = 2000      # Maximum chunk size
```

### Chunking Algorithm

1. **Text Extraction**: Extract full text from PDF
2. **Section Detection**: Identify document sections (abstract, introduction, methods, etc.)
3. **Intelligent Chunking**:
   - Prefer chunk boundaries at sentence ends
   - Respect section boundaries when possible
   - Maintain overlap for context continuity
4. **Metadata Assignment**: Attach relevant metadata to each chunk

### Embedding Strategy

```python
EMBEDDING_MODEL = "text-embedding-004"  # Gemini embedding model
EMBEDDING_DIMENSION = 768              # Vector dimension
BATCH_SIZE = 100                       # Documents per batch
```

## Query Operations

### Semantic Search

```python
# Search for relevant chunks
results = collection.query(
    query_texts=["What is the main contribution?"],
    n_results=5,
    where={"file_id": "abc123"},  # Optional: filter by file
    where_document={"$contains": "machine learning"}  # Optional: text filter
)
```

### Search Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `n_results` | 5 | Number of top results to return |
| `where` | None | Metadata filter conditions |
| `where_document` | None | Document content filter |

### Filter Examples

```python
# Filter by file
where={"file_id": "abc123"}

# Filter by section
where={"section": "abstract"}

# Filter by page range
where={"page_number": {"$gte": 1, "$lte": 5}}

# Combine filters
where={
    "file_id": "abc123",
    "section": {"$in": ["abstract", "introduction"]}
}
```

## Data Lifecycle

### Upload Flow

```
1. User uploads PDF
   ↓
2. Generate unique file_id (UUID)
   ↓
3. Extract text and metadata
   ↓
4. Chunk text into segments
   ↓
5. Generate embeddings for each chunk
   ↓
6. Store in ChromaDB with metadata
   ↓
7. Return file_id to frontend
```

### Deletion Flow

```
1. User requests deletion
   ↓
2. Retrieve all chunks for file_id
   ↓
3. Delete chunks from ChromaDB
   ↓
4. Delete original PDF file
   ↓
5. Clear any cached analysis results
```

### Update Flow (Future)

```
1. User uploads new version
   ↓
2. Delete old chunks (file_id)
   ↓
3. Process new PDF
   ↓
4. Store new chunks with same file_id
   ↓
5. Invalidate cached analysis
```

## Indexing Optimization

### Metadata Indexing

ChromaDB automatically indexes metadata fields for efficient filtering:

- **file_id**: Hash index for exact match lookups
- **page_number**: Numeric index for range queries
- **section**: String index for categorical filtering
- **created_at**: Timestamp index for time-based queries

### Vector Index

ChromaDB uses **HNSW (Hierarchical Navigable Small World)** for approximate nearest neighbor search:

- **M parameter**: 16 (max connections per node)
- **efConstruction parameter**: 200 (build-time search depth)
- **ef parameter**: 50 (query-time search depth)

## Storage Configuration

### Persistence Settings

```python
import chromadb

client = chromadb.PersistentClient(
    path="./chroma_db",  # Local directory for persistence
    settings=chromadb.Settings(
        anonymized_telemetry=False,
        allow_reset=True
    )
)
```

### Storage Structure

```
chroma_db/
├── chroma.sqlite3              # Metadata database
└── research_papers/            # Collection directory
    ├── index/                 # Vector index files
    ├── data/                  # Document data
    └── metadata/              # Collection metadata
```

## Memory Management

### Memory Limits

```python
MAX_DOCUMENTS_PER_COLLECTION = 10000    # Soft limit
MAX_MEMORY_USAGE = 4GB                   # ChromaDB memory limit
BATCH_OPERATION_SIZE = 100              # Documents per batch
```

### Cleanup Strategy

- **Automatic cleanup**: Delete files older than 30 days (configurable)
- **Manual cleanup**: User-initiated deletion
- **Cache invalidation**: Clear analysis cache on file deletion

## Query Performance

### Expected Performance

| Operation | Expected Time | Notes |
|-----------|---------------|-------|
| Single document add | 100-500ms | Depends on chunk count |
| Batch add (100 docs) | 2-5s | Parallel embedding generation |
| Semantic search (5 results) | 50-200ms | Depends on collection size |
| Metadata filter + search | 100-300ms | Combined operation |
| Delete by file_id | 100-500ms | Depends on chunk count |

### Performance Optimization

1. **Batch Operations**: Process multiple chunks together
2. **Async Embedding**: Generate embeddings concurrently
3. **Caching**: Cache frequent queries
4. **Index Tuning**: Adjust HNSW parameters based on data size

## Scaling Considerations

### Current MVP Design

- **Single collection**: All papers in one collection
- **Local storage**: File-based persistence
- **No sharding**: All data on single instance
- **No replication**: Single point of failure (acceptable for MVP)

### Future Scaling Options

#### Option 1: Multiple Collections
```
research_papers_2024
research_papers_2023
research_papers_2022
```

#### Option 2: Distributed ChromaDB
- ChromaDB Server mode
- Horizontal scaling
- Load balancing

#### Option 3: Hybrid Approach
- ChromaDB for vector search
- PostgreSQL for metadata
- Redis for caching

## Backup and Recovery

### Backup Strategy

```python
# Backup ChromaDB
import shutil
import datetime

def backup_chromadb():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"backups/chroma_db_{timestamp}"
    shutil.copytree("chroma_db", backup_path)
```

### Recovery Strategy

```python
# Restore from backup
def restore_chromadb(backup_path):
    shutil.rmtree("chroma_db")
    shutil.copytree(backup_path, "chroma_db")
```

### Backup Schedule

- **Daily backups**: Automated at midnight
- **Retention**: Keep last 7 days
- **Manual backup**: Before major changes

## Data Integrity

### Validation Rules

1. **File ID Validation**: UUID format
2. **Chunk Validation**: Minimum 50 characters
3. **Metadata Validation**: Required fields present
4. **Embedding Validation**: Correct dimension

### Error Handling

```python
try:
    collection.add(
        ids=chunk_ids,
        documents=chunk_texts,
        embeddings=chunk_embeddings,
        metadatas=chunk_metadata
    )
except Exception as e:
    # Log error
    # Rollback partial additions
    # Notify user
```

## Security Considerations

### Access Control

- **File-based permissions**: Restrict access to chroma_db directory
- **API-level filtering**: Ensure users can only access their files (future)
- **Input sanitization**: Validate all metadata inputs

### Data Privacy

- **Local storage**: No cloud exposure in MVP
- **No PII**: Avoid storing personal information
- **Encryption**: Consider encryption at rest (future)

## Monitoring

### Metrics to Track

- **Collection size**: Number of documents
- **Storage usage**: Disk space consumed
- **Query latency**: Average search time
- **Index health**: Fragmentation level
- **Error rate**: Failed operations

### Logging

```python
import logging

logging.basicConfig(
    filename='chromadb.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Log operations
logging.info(f"Added {len(chunk_ids)} chunks for file {file_id}")
logging.info(f"Query returned {len(results)} results in {latency}ms")
```

## Alternative Database Options (Future)

### Option 1: Pinecone
- **Pros**: Managed service, excellent performance
- **Cons**: Paid, requires cloud setup

### Option 2: Weaviate
- **Pros**: GraphQL API, multi-modal support
- **Cons**: More complex setup

### Option 3: Qdrant
- **Pros**: High performance, filter optimization
- **Cons**: Smaller community

### Option 4: pgvector (PostgreSQL)
- **Pros**: Single database for vectors + metadata
- **Cons**: Requires PostgreSQL expertise

## Migration Strategy

### ChromaDB to PostgreSQL + pgvector

```python
# Migration steps:
1. Export ChromaDB data
2. Create PostgreSQL schema
3. Import documents to PostgreSQL
4. Generate embeddings with pgvector
5. Build vector indexes
6. Update application code
7. Test thoroughly
8. Switch over
```

## Summary

### Key Design Decisions

1. **ChromaDB for MVP**: Simple, local, free
2. **Single collection**: Simplifies queries
3. **Rich metadata**: Enables advanced filtering
4. **Intelligent chunking**: Better RAG performance
5. **Local persistence**: No cloud dependencies

### Trade-offs

- **Simplicity vs. Scalability**: Chose simplicity for MVP
- **Performance vs. Cost**: Local storage is free but less performant
- **Features vs. Time**: Basic RAG for fast MVP delivery

### Next Steps

1. Implement ChromaDB client wrapper
2. Create indexing pipeline
3. Build query interface
4. Add monitoring and logging
5. Test with real research papers
