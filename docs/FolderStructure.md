# ResearchPilot AI - Folder Structure

## Project Root
```
ResearchPilot/
├── Backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI application entry point
│   │   ├── config.py          # Configuration settings
│   │   ├── api/               # API routes
│   │   │   ├── __init__.py
│   │   │   ├── upload.py      # PDF upload endpoints
│   │   │   ├── analysis.py    # Analysis endpoints
│   │   │   └── chat.py        # Chat/RAG endpoints
│   │   ├── services/              # Core business logic
│   │   │   ├── __init__.py
│   │   │   ├── pdf_processor.py    # PDF parsing & extraction
│   │   │   ├── gemini_client.py    # Gemini API integration
│   │   │   ├── rag_engine.py       # RAG implementation
│   │   │   ├── summarizer.py       # Summary generation
│   │   │   ├── review_generator.py    # Review generation
│   │   │   └── action_generator.py    # Action generation
│   │   ├── models/            # Pydantic models
│   │   │   ├── __init__.py
│   │   │   └── schemas.py     # Request/Response schemas
│   │   ├── db/                # Database layer
│   │   │   ├── __init__.py
│   │   │   ├── chroma_client.py   # ChromaDB client
│   │   │   └── vector_store.py    # Vector store operations
│   │   ├── utils/             # Utilities
│   │   │   ├── __init__.py
│   │   │   ├── file_utils.py
│   │   │   └── text_utils.py
│   │   └── middleware/        # Custom middleware
│   │       ├── __init__.py
│   │       └── error_handler.py
│   ├── tests/                 # Backend tests
│   │   ├── __init__.py
│   │   ├── test_api/
│   │   ├── test_core/
│   │   └── test_db/
│   ├── uploads/               # Temporary PDF storage
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Environment variables template
│   └── README.md              # Project documentation
│
├── Frontend/                   # React Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # UI components (Button, Card, etc.)
│   │   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   │   ├── upload/        # Upload-related components
│   │   │   └── analysis/      # Analysis display components
│   │   ├── pages/             # Page components
│   │   │   ├── Home/
│   │   │   ├── Upload/
│   │   │   └── Analysis/
│   │   ├── services/          # API services
│   │   │   ├── api.js         # Axios/Fetch configuration
│   │   │   ├── uploadService.js
│   │   │   └── analysisService.js
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useUpload.js
│   │   │   └── useAnalysis.js
│   │   ├── context/           # React Context
│   │   │   └── AppContext.js
│   │   ├── utils/             # Utilities
│   │   │   └── helpers.js
│   │   ├── styles/            # Global styles
│   │   │   ├── index.css
│   │   │   └── variables.css
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── .env.example           # Environment variables template
│
├── docs/                       # Documentation
│   ├── PRD.md                 # Product Requirements Document
│   ├── Architecture.md        # Architecture documentation
│   ├── FolderStructure.md     # This file
│   ├── API.md                 # API documentation
│   ├── Database.md            # Database design
│   └── Roadmap.md             # Development roadmap
│
├── scripts/                    # Utility scripts
│   ├── setup.sh               # Development setup script
│   └── deploy.sh              # Deployment script
│
├── .gitignore                 # Git ignore rules
├── README.md                  # Project README
└── docker-compose.yml         # Docker orchestration (optional)
```

## Key Design Decisions

### Backend Structure
- **Layered Architecture**: API → Core → DB for separation of concerns
- **Modular Design**: Each feature has its own module for maintainability
- **Service Pattern**: Core logic separated from API routes
- **Type Safety**: Pydantic models for request/response validation

### Frontend Structure
- **Component-Based**: Reusable UI components
- **Page-Based Routing**: Clear page separation
- **Service Layer**: API calls abstracted into services
- **Custom Hooks**: Reusable stateful logic
- **Context API**: Global state management

### File Organization Principles
1. **Co-location**: Related files kept together
2. **Scalability**: Structure supports future growth
3. **Clarity**: Purpose of each directory is obvious
4. **Solo Developer Friendly**: Simple enough for one person to navigate
