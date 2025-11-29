# FormBuilder AI - Complete Guide

An intelligent form builder where users describe forms in plain English and AI generates them. Forms are shareable via public links, accept submissions with image uploads, and the AI remembers past forms intelligently using context-aware memory.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Core Architecture](#core-architecture)
- [Context-Aware Memory System](#context-aware-memory-system)
- [Bonus Features](#bonus-features)
- [Usage Examples](#usage-examples)
- [Deployment](#deployment)
- [Limitations & Future](#limitations--future)

---

## ✨ Features

### Core Features
- ✅ **AI-Powered Form Generation**: Describe forms in plain English, AI generates JSON schema
- ✅ **Smart Context Memory**: AI remembers past forms and adapts to user patterns
- ✅ **Shareable Public Links**: Each form gets a unique public URL (`/form/abc123`)
- ✅ **Image Upload Support**: Users can upload images/documents during form submission
- ✅ **Submissions Dashboard**: View all forms and their responses in one place
- ✅ **User Authentication**: Secure email/password login with JWT tokens
- ✅ **Form Templates**: Pre-built templates for common use cases (Job Application, Signup, Survey, etc.)

### Bonus Features
- 🚀 **Semantic Search with Embeddings**: Use Pinecone for vector-based form similarity matching
- 🔄 **Response Caching**: Cache frequently accessed form retrieval results
- 📦 **Form Templates**: Quick-start with pre-built forms
- 💾 **MongoDB Vector Search**: Alternative to Pinecone for embeddings
- 📊 **Advanced Validation Rules**: Custom field validation

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 15 + TypeScript + React + Tailwind CSS |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | MongoDB Atlas |
| **AI/ML** | Google Gemini API + HuggingFace Embeddings |
| **Images** | Cloudinary |
| **Vector DB** | Pinecone (optional, for embeddings) |
| **Auth** | JWT + bcryptjs |
| **Deployment** | Vercel (frontend) + MongoDB Atlas (backend) |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB Atlas account (free tier available)
- Google Gemini API key
- Cloudinary account
- Pinecone account (optional, for embeddings)
- HuggingFace API key (optional, for embeddings)

### Step 1: Clone and Install

```bash
cd /Users/parthsharma/Downloads/marathon
npm install
```

### Step 2: Environment Variables

Create `.env.local` and fill in your credentials:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/form-builder?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NEXT_PUBLIC_API_URL=http://localhost:3000

# AI - Gemini
GEMINI_API_KEY=your_gemini_api_key

# Image Upload - Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Embeddings - Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=us-west-2
PINECONE_INDEX_NAME=form-builder

# Optional: HuggingFace Embeddings
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### Step 3: Run Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📁 Project Structure

```
marathon/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts         # Login endpoint
│   │   │   └── signup/route.ts        # Signup endpoint
│   │   ├── forms/
│   │   │   ├── generate/route.ts      # AI form generation
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts           # Get form by share link
│   │   │   │   ├── submit/route.ts    # Submit form response
│   │   │   │   └── submissions/route.ts # Get submissions
│   │   │   └── route.ts               # List user's forms
│   │   ├── upload/route.ts            # Image upload to Cloudinary
│   │   ├── templates/route.ts         # Form templates
│   │   └── middleware.ts              # Auth middleware
│   ├── login/page.tsx                 # Login page
│   ├── signup/page.tsx                # Signup page
│   ├── dashboard/page.tsx             # User dashboard
│   ├── create/page.tsx                # Form creation page
│   ├── form/[id]/page.tsx             # Public form page
│   ├── page.tsx                       # Landing page
│   ├── layout.tsx                     # Root layout
│   └── globals.css                    # Global styles
├── components/
│   ├── FormRenderer.tsx               # Dynamic form renderer
│   ├── FormGenerator.tsx              # Form prompt input
│   ├── Dashboard.tsx                  # Dashboard component
│   ├── AuthForm.tsx                   # Login/Signup form
│   └── ClientRoot.tsx                 # Client wrapper
├── lib/
│   ├── db.ts                          # MongoDB connection & schemas
│   ├── auth.ts                        # JWT utilities
│   ├── password.ts                    # Password hashing
│   ├── ai.ts                          # Gemini API integration
│   ├── cloudinary.ts                  # Image upload
│   ├── retrieval.ts                   # Context retrieval system
│   ├── templates.ts                   # Form templates (bonus)
│   ├── embeddings.ts                  # Pinecone integration (bonus)
│   ├── huggingface.ts                 # HF embeddings (bonus)
│   └── cache.ts                       # Caching utilities (bonus)
├── public/                            # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🔌 API Documentation

### Authentication

#### POST `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

#### POST `/api/auth/login`
Login to existing account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** Same as signup

---

### Forms

#### POST `/api/forms/generate`
Generate a form from natural language prompt.

**Request:**
```json
{
  "prompt": "I need a job application form with name, email, resume upload, and cover letter",
  "useEmbeddings": false
}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Job Application Form",
  "purpose": "job hiring",
  "keywords": ["job", "application", "resume"],
  "schema": [
    {
      "name": "fullName",
      "type": "text",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "name": "resume",
      "type": "image",
      "required": true
    }
  ],
  "shareLink": "abc123xyz",
  "url": "/form/abc123xyz"
}
```

#### GET `/api/forms`
Get all user's forms.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "forms": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Job Application",
      "purpose": "job hiring",
      "shareLink": "abc123xyz",
      "createdAt": "2025-11-29T10:00:00Z",
      "url": "/form/abc123xyz"
    }
  ]
}
```

#### GET `/api/forms/{shareLink}`
Get form schema by share link (public).

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Job Application",
  "purpose": "job hiring",
  "schema": {
    "title": "Job Application",
    "fields": [...]
  }
}
```

#### POST `/api/forms/{shareLink}/submit`
Submit form response (public).

**Request:**
```json
{
  "responses": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "resume": "resume.pdf"
  },
  "imageUrls": {
    "resume": "https://res.cloudinary.com/.../resume.pdf"
  }
}
```

**Response:**
```json
{
  "message": "Submission received",
  "submissionId": "507f1f77bcf86cd799439012"
}
```

#### GET `/api/forms/{formId}/submissions`
Get all submissions for a form.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "formId": "507f1f77bcf86cd799439011",
  "formTitle": "Job Application",
  "submissions": [
    {
      "id": "507f1f77bcf86cd799439012",
      "responses": {
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "imageUrls": {
        "resume": "https://res.cloudinary.com/.../resume.pdf"
      },
      "submittedAt": "2025-11-29T11:00:00Z"
    }
  ]
}
```

---

### Image Upload

#### POST `/api/upload`
Upload image to Cloudinary.

**Request:**
```
multipart/form-data
- file: File object
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/.../uploaded_file.jpg"
}
```

---

### Templates (Bonus)

#### GET `/api/templates`
Get all available form templates.

**Response:**
```json
{
  "templates": [
    {
      "id": "jobApplication",
      "title": "Job Application Form",
      "description": "Standard job application form"
    },
    {
      "id": "signup",
      "title": "User Signup Form",
      "description": "Basic user registration form"
    }
  ]
}
```

---

## 🧠 Core Architecture

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: string,
  password: string (hashed with bcrypt),
  createdAt: Date
}
```

#### Forms Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  purpose: string,
  keywords: string[],
  schema: {
    title: string,
    fields: Array<{
      name: string,
      type: 'text'|'email'|'number'|'image'|'checkbox'|'select',
      required: boolean,
      placeholder?: string,
      options?: string[]
    }>
  },
  shareLink: string (unique),
  embedding?: number[] (if using Pinecone),
  createdAt: Date,
  updatedAt: Date
}
```

#### Submissions Collection
```javascript
{
  _id: ObjectId,
  formId: ObjectId,
  responses: Record<string, any>,
  imageUrls: Record<string, string>,
  submittedAt: Date
}
```

#### Cache Collection
```javascript
{
  _id: ObjectId,
  key: string,
  value: any,
  expiresAt: Date,
  createdAt: Date
}
```

---

## 🧠 Context-Aware Memory System

This is the critical innovation of FormBuilder AI. Instead of sending all past forms to the AI (which would be expensive and slow), we intelligently retrieve only relevant forms.

### How It Works

#### Step 1: Form Creation
When a form is generated:
1. AI generates schema + keywords
2. Keywords are extracted and stored
3. (Optional) Embedding is generated via HuggingFace
4. (Optional) Embedding is stored in Pinecone

```typescript
// Example: User creates "job application form"
const generatedForm = {
  title: "Job Application",
  keywords: ["job", "application", "resume", "hiring", "career"],
  fields: [...],
  embedding: [0.12, 0.45, 0.98, ...] // 384-dim vector
}
```

#### Step 2: New Form Request
User asks: "I need an internship form with resume and GitHub link"

1. Extract keywords: `["internship", "resume", "github", "hiring"]`
2. Search for relevant forms (two options):
   - **Keyword Matching**: Find forms with overlapping keywords
   - **Embedding Search**: Find forms with similar embeddings

```typescript
// Keyword-based retrieval
const relevantForms = await db.forms.find({
  userId: userId,
  keywords: { $in: ["internship", "resume", "github", "hiring"] }
}).limit(5)

// Embedding-based retrieval (better accuracy)
const embedding = await generateEmbedding(userPrompt)
const similarForms = await pinecone.query({
  vector: embedding,
  topK: 5,
  filter: { userId: userId }
})
```

#### Step 3: AI Generation with Context
Pass only relevant forms to AI:

```
You are a form schema generator.

Here are relevant forms the user created before:
- Title: "Job Application", Fields: ["name", "email", "resume", "photo"]
- Title: "Career Fair Registration", Fields: ["name", "email", "github", "portfolio"]

Now generate a schema for: "I need an internship form with resume and GitHub link"

Return JSON schema...
```

AI now understands the user's style and can maintain consistency.

#### Step 4: Caching
Cache the retrieval result for 1 hour:
- Key: MD5(query + userId)
- Value: List of relevant form IDs
- TTL: 3600 seconds

Next time the same user makes a similar request, we get cached results instantly.

### Why This Matters

| Scenario | Without Memory | With Memory |
|----------|---|---|
| **Consistency** | Each form might look different | Forms follow user's established patterns |
| **Quality** | Generic forms | Personalized forms matching user's style |
| **Speed** | AI must think from scratch | AI uses past examples as reference |
| **Token Usage** | High (more thinking required) | Lower (leverages examples) |
| **Scalability** | Can't handle 1000+ forms | Only sends 5-10 most relevant forms |

---

## 🚀 Bonus Features

### 1. Pinecone Embeddings (Semantic Search)

**What it does:** Instead of keyword matching, uses vector similarity to find relevant forms.

**Setup:**
```bash
# Install Pinecone
npm install @pinecone-database/pinecone

# Configure in .env.local
PINECONE_API_KEY=your_key
PINECONE_INDEX_NAME=form-builder
```

**Usage:**
```typescript
import { storeFormEmbedding, queryFormsByEmbedding } from '@/lib/embeddings'

// When creating a form
const embedding = await generateFormEmbedding(title, purpose, keywords)
await storeFormEmbedding(formId, embedding, { userId, title, purpose })

// When retrieving forms
const similarForms = await queryFormsByEmbedding(queryEmbedding, topK=5)
```

**Benefits:**
- More accurate matching
- Works with synonyms ("job" ≈ "employment")
- Semantic understanding

### 2. Response Caching

**What it does:** Caches form retrieval results to avoid repeated database queries.

**How it works:**
```typescript
import { getCachedValue, setCachedValue } from '@/lib/cache'

// First request - query DB
let forms = await getCachedValue(`forms-${userId}-${queryHash}`)
if (!forms) {
  forms = await db.forms.find(...).toArray()
  await setCachedValue(`forms-${userId}-${queryHash}`, forms, 3600000) // 1 hour TTL
}

// Next request with same query - instant cache hit!
```

**Benefits:**
- 100-1000x faster for repeated queries
- Reduced database load
- Better UX

### 3. Form Templates

**What it does:** Pre-built forms users can quickly start with.

**Available Templates:**
- Job Application Form
- User Signup Form
- Customer Feedback Survey
- Event Registration Form

**Usage:**
```typescript
import { listTemplates, getTemplateByName } from '@/lib/templates'

// List all templates
const templates = listTemplates()

// Use a template
const template = getTemplateByName('jobApplication')
```

### 4. MongoDB Vector Search (Alternative to Pinecone)

**What it does:** Use MongoDB's native vector search instead of Pinecone.

**Setup:**
```bash
# Create vector index in MongoDB Atlas
db.forms.createIndex({ embedding: "cosmosSearch" })
```

**Query:**
```typescript
const similarForms = await db.forms
  .aggregate([
    {
      $search: {
        cosmosSearch: {
          vector: queryEmbedding,
          k: 5
        },
        returnStoredSource: true
      }
    }
  ])
  .toArray()
```

---

## 📚 Usage Examples

### Example 1: Create Job Application Form

**User Input:**
```
"I need a job application form with name, email, phone, resume upload, and cover letter"
```

**AI Output:**
```json
{
  "title": "Job Application Form",
  "purpose": "Collect job applications",
  "keywords": ["job", "application", "resume", "hiring"],
  "fields": [
    {
      "name": "fullName",
      "type": "text",
      "required": true,
      "placeholder": "John Doe"
    },
    {
      "name": "email",
      "type": "email",
      "required": true,
      "placeholder": "john@example.com"
    },
    {
      "name": "phone",
      "type": "text",
      "required": true,
      "placeholder": "+1 (555) 000-0000"
    },
    {
      "name": "resume",
      "type": "image",
      "required": true,
      "placeholder": "Upload PDF"
    },
    {
      "name": "coverLetter",
      "type": "text",
      "required": false,
      "placeholder": "Optional cover letter"
    }
  ]
}
```

**Shareable Link:** `https://yoursite.com/form/abc123xyz`

---

### Example 2: Using Form Memory

**Session:**
1. User creates "Job Application" form → keywords: [job, application, resume]
2. User creates "Internship Application" form → keywords: [internship, application, resume, student]
3. User creates "Startup Founder Form" → AI retrieves past 2 forms and generates consistent schema

**AI Prompt:**
```
Previous forms:
- "Job Application": name, email, phone, resume, cover letter
- "Internship Application": name, email, school, resume, availability

Generate: "Startup founder application with LinkedIn, pitch deck, team size"
```

AI maintains naming consistency, field types, and structure!

---

### Example 3: Image Upload During Submission

**Form Submission with Image:**
```javascript
const formData = new FormData()
formData.append('file', resumeFile) // User selects file

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})

const { url } = await uploadResponse.json()
// url: "https://res.cloudinary.com/.../resume-2025-11-29.pdf"

// Submit form with image URL
await fetch('/api/forms/abc123xyz/submit', {
  method: 'POST',
  body: JSON.stringify({
    responses: { name: "John", email: "john@example.com" },
    imageUrls: { resume: url }
  })
})
```

---

## 🚀 Deployment

### Deploy to Vercel

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/form-builder.git
git push -u origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `PINECONE_API_KEY` (optional)
   - `HUGGINGFACE_API_KEY` (optional)

#### Step 3: Deploy
Click "Deploy" - your app will be live in seconds!

**Your app will be available at:** `https://form-builder-ai.vercel.app`

### Database Setup (MongoDB Atlas)

1. Create free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create database user with password
3. Add your Vercel IP to whitelist (or 0.0.0.0/0 for testing)
4. Copy connection string to `MONGODB_URI`

### Image Upload Setup (Cloudinary)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to "Settings" → "API Keys"
3. Copy Cloud Name, API Key, API Secret
4. Add to environment variables

### AI Setup (Gemini API)

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Create new project
4. Copy API key to `GEMINI_API_KEY`

### Embeddings Setup (Optional)

**Option A: Pinecone**
1. Sign up at [pinecone.io](https://pinecone.io)
2. Create index named "form-builder" (1536 dimensions)
3. Copy API key and environment

**Option B: HuggingFace**
1. Sign up at [huggingface.co](https://huggingface.co)
2. Create API token
3. Add to environment

---

## ⚠️ Limitations & Future Work

### Current Limitations
- AI generation quality depends on Gemini API performance
- Keyword matching not as accurate as embeddings (without Pinecone)
- Image uploads limited by Cloudinary free tier (25GB/month)
- No field validation rules (can be added)
- No form versioning (forms can't have historical versions)
- No analytics (can't track which forms are most popular)

### Future Enhancements
- [ ] Advanced field validation (regex, custom rules)
- [ ] Form versioning & A/B testing
- [ ] Analytics dashboard (response rates, submission times)
- [ ] Conditional logic (show field if other field = X)
- [ ] Branching/multi-step forms
- [ ] Form pre-filling from URLs
- [ ] Export submissions as CSV/Excel
- [ ] Webhook integrations
- [ ] Form builder UI (drag-drop interface)
- [ ] Mobile app (React Native)
- [ ] Better error handling & logging
- [ ] Rate limiting per user
- [ ] Form access control (limit responses per email)
- [ ] Payment integration (Stripe)
- [ ] Form templates marketplace

---

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Check `MONGODB_URI` is correct
- Verify IP is whitelisted in MongoDB Atlas
- Ensure database user has correct password

### "Gemini API returns empty"
- Verify `GEMINI_API_KEY` is valid
- Check request payload format
- Look at console logs for error messages

### "Image upload fails"
- Verify Cloudinary credentials
- Check file size (max 100MB)
- Ensure file format is supported

### "Form doesn't show up after creation"
- Check if form is stored in MongoDB
- Verify share link is correctly generated
- Check browser network tab for 404 errors

---

## 📞 Support & Contact

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review API documentation
3. Check console logs and network tab
4. Verify all environment variables are set

---

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Form Building! 🚀**
