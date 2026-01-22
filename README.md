# Academic Paper Finder Agent

A full-stack web application that helps researchers search and scrape academic databases for relevant research papers, extract metadata, manage PDF downloads, generate citations, and organize research materials using AI-powered LangChain agents.

---

## Project Overview

Academic Paper Finder Agent is designed to streamline the research process by providing a centralized interface for searching multiple academic databases, organizing papers into reading lists, generating citations in various formats, and discovering related papers through AI analysis.

### Key Features

- **Multi-Database Search**: Search across multiple academic databases using natural language queries
- **AI-Powered Metadata Extraction**: Use LangChain agents and LLMs to extract structured paper metadata
- **PDF Download Management**: Download and store PDF files locally with download status tracking
- **Citation Generation**: Generate citations in multiple formats (APA, MLA, Chicago, etc.) using LLM formatting
- **Related Paper Suggestions**: Discover related papers using AI-powered similarity analysis
- **Reading List Organization**: Create and manage reading lists to organize research by topic
- **User Authentication**: Secure authentication using Firebase Authentication

---

## Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Firebase SDK** - Authentication

### Backend
- **Python 3.12+** - Programming language
- **FastAPI** - REST API framework
- **Uvicorn** - ASGI server
- **SQLite** - Database for application data
- **LangChain** - AI agent framework
- **Google Gemini LLM** - Language model for analysis and formatting

### Development Tools
- **UV** - Python package manager
- **npm** - Node package manager
- **Git** - Version control

---

## Project Structure

```
academic-paper-finder-agent/
├── Backend/                    # FastAPI backend application
│   ├── main.py                 # Main backend server file
│   ├── pyproject.toml          # Python project configuration
│   ├── requirements.txt        # Python dependencies
│   ├── uv.lock                 # UV lock file
│   └── .env                    # Environment variables
│
├── Frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js          # Vite configuration
│
├── issues/                      # Project issues (15-20 issues)
│   ├── issue-01-project-setup.md
│   ├── issue-02-landing-page-ui.md
│   └── ...
│
├── project_details.md          # Detailed project planning document
└── PROJECT-README.md           # This file
```

---

## Issue Flow

The project is broken down into 19 issues that progress from foundation to advanced features:

### Foundation (Issues 1-8)
1. **Project Setup** - Initialize project structure and dependencies
2. **Landing Page UI** - Create static landing page
3. **Signup Page UI** - Create signup form (static)
4. **Login Page UI** - Create login form (static)
5. **Firebase Auth Setup** - Configure Firebase Authentication
6. **Integrate Signup with Firebase** - Connect signup form to Firebase
7. **Integrate Login with Firebase** - Connect login form to Firebase
8. **Dashboard UI** - Create protected dashboard page

### Core Features (Issues 9-15)
9. **Search Feature** - Implement search interface and API endpoint
10. **Paper Metadata Extraction** - Add LangChain/LLM processing for search
11. **Save Paper Feature** - Allow users to save papers with optional reading list assignment
12. **Display Saved Papers** - Show user's saved papers on Dashboard
13. **Paper Detail View** - Create detailed paper view page
14. **Delete Paper Feature** - Allow users to delete saved papers
15. **PDF Download Feature** - Implement PDF download and storage

### Advanced Features (Issues 16-18)
16. **Citation Generation** - Generate citations in multiple formats using LLM
17. **Related Papers Feature** - Find related papers using AI analysis
18. **Reading List Management** - Create, view, and manage reading lists

### Final (Issue 19)
19. **Final Testing** - Complete application flow verification and documentation

---

## API Endpoints

### Search & Papers
- `POST /api/search` - Search academic databases (LLM integration)
- `GET /api/papers` - Get all saved papers (optional filter by reading_list_id)
- `GET /api/papers/:id` - Get single paper details
- `POST /api/papers/:id/save` - Save paper to database
- `DELETE /api/papers/:id` - Delete saved paper
- `POST /api/papers/:id/download` - Download PDF for paper
- `GET /api/papers/:id/citation` - Generate citation (LLM integration)
- `GET /api/papers/:id/related` - Get related paper suggestions (LLM integration)

### Reading Lists
- `GET /api/reading-lists` - Get all reading lists
- `POST /api/reading-lists` - Create new reading list
- `GET /api/reading-lists/:id` - Get reading list details
- `DELETE /api/reading-lists/:id` - Delete reading list

**Note:** All endpoints except landing page require Firebase authentication.

---

## Pages and Routes

| Page | Route | Protected | Description |
|------|-------|-----------|-------------|
| Landing | `/` | No | Welcome page with app information |
| Signup | `/signup` | No | User registration page |
| Login | `/login` | No | User authentication page |
| Dashboard | `/dashboard` | Yes | Main interface with search and saved papers |
| Search Results | `/search` | Yes | Display search results |
| Paper Detail | `/papers/:id` | Yes | View single paper details |
| Reading Lists | `/reading-lists` | Yes | Manage reading lists |
| Reading List Detail | `/reading-lists/:id` | Yes | View reading list contents |

---

## Database Schema

### Tables

**papers**
- Stores paper metadata and information
- Essential fields: identifier, user reference, title, authors, abstract, publication date, DOI, metadata JSON, file path (if downloaded), reading_list_id (nullable foreign key)
- Papers can optionally belong to one reading list (one-to-many relationship)

**reading_lists**
- Stores reading lists created by users
- Essential fields: identifier, user reference, name, description, creation date
- Each reading list can contain multiple papers

**Note:** Database schema is designed by students. Only essential fields are suggested; students can modify or improve the structure as needed.

---

## Key Components

### Core Components
- **Navbar** - Navigation header with user info and logout
- **SearchBar** - Search input interface
- **SearchResults** - Display search results grid
- **PaperCard** - Single paper card display
- **PaperDetail** - Full paper information view
- **PaperList** - Display saved papers list
- **CitationView** - Display citation in selected format
- **RelatedPapers** - Display related paper suggestions
- **DownloadButton** - Download PDF button
- **ReadingListList** - Display all reading lists
- **ReadingListCard** - Single reading list card
- **ReadingListDetail** - Full list view with papers
- **CreateListModal** - Create list form modal
- **Filters** - Filter search results
- **LoadingSpinner** - Loading indicator
- **ErrorMessage** - Error display

---

## User Journey

1. **First Visit**: User lands on Landing page, sees features, clicks "Sign Up"
2. **Registration**: User fills signup form, Firebase creates account, redirects to login
3. **Login**: User enters credentials, Firebase authenticates, redirects to Dashboard
4. **Search**: User enters search query, LangChain agent searches databases, results displayed
5. **View Details**: User clicks paper card, views full metadata, citation, related papers
6. **Save & Organize**: User saves paper, optionally assigns to reading list, creates lists
7. **Manage Research**: User views saved papers, manages reading lists, generates citations

---

## Data Flow

```
User Action → Frontend Component → API Call → Backend Endpoint → LangChain Agent → Database/File Storage → Response → UI Update
```

**Example:**
```
Search Query → SearchBar → POST /api/search → FastAPI → LangChain Agent (web scraping) → Extract Metadata → Store in SQLite → Return Results → Display in SearchResults
```

---

## LLM Integration Points

1. **Search & Metadata Extraction** (Issue #10)
   - LangChain agent searches academic databases
   - LLM extracts structured metadata from search results

2. **Citation Generation** (Issue #16)
   - LLM formats paper metadata into citation styles (APA, MLA, Chicago, etc.)

3. **Related Papers** (Issue #17)
   - LLM analyzes paper content and metadata
   - Finds similar papers using semantic analysis

---

## Development Guidelines

### For Students

- Follow the issue flow sequentially (Issues 1-19)
- Each issue builds upon previous ones
- Read issue requirements carefully before starting
- Ask for help when stuck
- Test your code after each issue
- Document your decisions and learnings

### Code Structure

- **Backend**: API helper functions should be in the same file as endpoints (Backend/main.py or Backend/routes/)
- **Frontend**: Components should be reusable and well-organized
- **Database**: Design your own schema based on essential fields suggested
- **Styling**: Use Tailwind CSS for all styling

### Important Notes

- Firebase handles ALL authentication (no backend auth logic)
- SQLite stores ONLY application data (not authentication)
- LangChain + LLMs handle ALL AI features (no OCR libraries)
- Papers belong to ONE reading list (one-to-many relationship)
- Students design their own database schemas

---

## Getting Started

1. **Clone the repository**
2. **Follow Issue #01** for project setup instructions
3. **Complete issues sequentially** (Issues 1-19)
4. **Test thoroughly** after each issue
5. **Document your progress** and any issues encountered

---

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [LangChain Documentation](https://python.langchain.com/)
- [Google Gemini Documentation](https://ai.google.dev/docs)

---

## Success Criteria

### Technical Success
- All endpoints work correctly
- Firebase authentication functions properly
- LangChain agent successfully searches academic databases
- Paper metadata extraction is accurate
- PDF downloads work reliably
- Citation generation produces correct formats
- Related paper suggestions are relevant
- Reading list management functions properly

### Learning Success
- Students understand full-stack development
- Students can connect frontend to backend
- Students learn Firebase authentication
- Students understand LangChain agents and tools
- Students learn web scraping concepts
- Students understand file management
- Students can debug and fix issues independently

---

## License

This is a template project for educational purposes.
