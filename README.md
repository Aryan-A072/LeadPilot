# LeadPilot — AI Lead Qualification & Outreach Copilot

LeadPilot is an AI-powered lead management prototype that helps sales teams evaluate potential B2B customers, identify missing qualification information, and generate personalized outreach emails.

The project combines transparent, rule-based lead scoring with Generative AI to make lead qualification more structured and outreach preparation faster.

## Features

- **Lead Management:** Create, view, update, and delete leads.
- **Lead Qualification:** Evaluate leads against an Ideal Customer Profile (ICP), including industry, employee count, support automation needs, and relevant contact availability.
- **Transparent Scoring:** View qualification scores, scoring breakdowns, evidence coverage, and missing information.
- **AI Outreach Generation:** Generate concise, personalized B2B outreach email drafts using the Groq API.
- **Draft History:** Retrieve previously generated outreach drafts for a lead.
- **Responsive Dashboard:** View leads, search records, filter by qualification status, and monitor qualification statistics.

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Zod for request validation

**AI Integration**
- Groq API
- Configurable language model through environment variables

## Project Structure

```text
LeadPilot/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database, such as MongoDB Atlas
- A Groq API key for AI outreach generation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd LeadPilot
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Configure the backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

Replace the placeholder values with your own credentials. Keep `.env` out of version control.

Start the backend:

```bash
npm run dev
```

The API should be available at `http://localhost:5000`.

### 3. Configure the frontend

Open a second terminal:

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API Endpoints

The backend exposes the following endpoints under `/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check API health |
| POST | `/leads` | Create a lead |
| GET | `/leads` | Retrieve leads |
| GET | `/leads/:id` | Retrieve a lead |
| PATCH | `/leads/:id` | Update a lead |
| DELETE | `/leads/:id` | Delete a lead |
| POST | `/leads/:id/score` | Qualify and score a lead |
| POST | `/leads/:id/outreach` | Generate an outreach draft |
| GET | `/leads/:id/outreach` | Retrieve outreach draft history |
| POST | `/qualification/score` | Calculate a qualification score |

## How Qualification Works

LeadPilot uses a weighted, rule-based scoring system based on the configured ICP criteria:

- Industry match: 35 points
- Employee count match: 25 points
- Support automation need: 30 points
- Relevant contact availability: 10 points

The maximum score is 100. Missing information is tracked separately so users can distinguish confirmed evidence from incomplete data.

**Important:** The score is a qualification heuristic, not a statistically validated probability of conversion. Results depend on the supplied lead information and configured criteria.

## AI Outreach Workflow

1. Select a lead.
2. Review the available company information.
3. Request an outreach draft.
4. Review and edit the generated email before sending it.
5. Retrieve previous drafts when needed.

The language model is used to draft outreach content, while lead qualification uses the transparent scoring rules. Generated content should be reviewed for accuracy before use.

## Security Notes

- Never commit API keys, database credentials, or `.env` files.
- Keep the Groq API key exclusively on the backend.
- Validate incoming requests and protect database operations before deploying publicly.
- Add appropriate authentication, authorization, rate limiting, and production security configuration before exposing the application to real users.

## Future Improvements

- CRM integrations and lead enrichment
- More configurable ICP criteria
- Outreach templates and approval workflows
- Automated tests and CI/CD
- Production authentication and role-based access control
- Lead analytics and qualification performance tracking

## Project Goal

LeadPilot demonstrates how rule-based decision-making and Generative AI can work together to support B2B sales workflows: making qualification more explainable while reducing the effort required to prepare outreach.

---

**Note:** This is a project prototype. Actual results depend on the quality of the supplied data, configuration, and AI-generated drafts.
