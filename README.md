# 🚀 Learning Buddy

**Learning Buddy** is an AI-powered learning assistant built for the **FutureForce Pseudo AI Hackathon**. It offers an intuitive chat interface—supporting both text and voice interactions—to help users discover, understand, and explore learning topics and courses.

A key highlight of Learning Buddy is its **Personalized Course Recommendation** engine, which intelligently tailors course suggestions based on your queries and learning preferences.

---

## 🎯 Key Features

### 💡 Personalized Course Recommendation *(Highlighted Feature)*

> 📚 **Tailored to Your Learning Goals**

- Analyzes user queries, interests, and chat history.
- Recommends relevant courses dynamically—whether you're into **machine learning**, **web development**, **data science**, or any other tech stack.
- Continuously adapts suggestions based on ongoing conversation context.
- Ideal for learners who want curated guidance without endless searching.

---

### 💬 Text-Based Chat

- Type questions and receive detailed, AI-generated responses about learning topics and courses.
- Messages are rendered using **Markdown formatting** (headings, bold text, bullet points) for improved readability.

---

### 🗣️ Voice Interaction

- **Speech-to-Text (STT)**: Ask questions by speaking—powered by **Azure Cognitive Services**.
- **Text-to-Speech (TTS)**: Bot replies can be spoken aloud. Choose between **auto-play** or **manual playback**.
- Supports multiple STT languages (e.g., `en-US`, `hi-IN`), configurable in settings.

---

### ❓ FAQ Retrieval

- Provides relevant FAQ responses from a backend knowledge base.
- Helps users quickly find common answers and explanations.

---

### ⚡ Quick Questions

- Instantly explore topics with predefined questions like “What is machine learning?”
- Useful for jumpstarting learning journeys.

---

### 🖥️ Responsive UI

- Clean, scrollable chat interface.
- Visual feedback with **loading indicators** and **error alerts**.
- Works seamlessly on desktops and mobile devices.

---

### 🧹 Clear History

- Easily reset your conversation with a single click.
- Great for starting fresh learning sessions.

---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **AI/ML Backend**: LLM and NLP-based Q&A engine
- **Speech Services**: Azure Cognitive Services (STT, TTS)
- **Recommendation Engine**: Context-aware system based on chat history and learning intent
- **Database**: Pinecone (Vector DB), MongoDB

---

---

## ⚙️ Setup & Installation

### 📦 Backend (ML Service - `backend-ml`)

1. **Navigate to the backend-ml folder**:

   ```bash
   cd backend-ml
   ```

2. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Create a `.env` file** in `backend-ml/` with the following content:

   ```
   COURSE_API_KEY=<YOUR_COURSE_API_KEY>
   FAQ_API_KEY=<YOUR_FAQ_API_KEY>
   SPEECH_KEY=<YOUR_AZURE_SPEECH_KEY>
   SPEECH_REGION=<YOUR_SPEECH_REGION>
   SPEECH_LANGUAGE=<YOUR_SPEECH_LANGUAGE>
   AZURE_OPENAI_ENDPOINT=<YOUR_AZURE_OPENAI_ENDPOINT>
   AZURE_OPENAI_KEY=<YOUR_AZURE_OPENAI_KEY>
   STORAGE_CONNECTION_STRING=<YOUR_AZURE_STORAGE_CONNECTION_STRING>
   LANGUAGE_KEY=<YOUR_LANGUAGE_API_KEY>
   LANGUAGE_ENDPOINT=<YOUR_LANGUAGE_API_ENDPOINT>
   ```

4. **Run the FastAPI server**:

   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

---

### 🧩 Backend (Node.js Service - `backend-node`)

1. **Navigate to the backend-node folder**:

   ```bash
   cd backend-node
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` file** in `backend-node/` with the following variables:

   ```
   CORS_ORIGIN=<YOUR_CORS_ORIGIN>
   MONGO_DB_URL=<YOUR_MONGO_DB_CONNECTION_STRING>
   PORT=<PORT_NUMBER>
   ACCESS_TOKEN_SECRET=<ACCESS_TOKEN_SECRET>
   ACCESS_TOKEN_EXPIRY=<EXPIRY_TIME>
   REFRESH_TOKEN_SECRET=<REFRESH_TOKEN_SECRET>
   REFRESH_TOKEN_EXPIRY=<EXPIRY_TIME>

   CLOUDINARY_CLOUD_NAME=<YOUR_CLOUD_NAME>
   CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
   CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
   FASTAPI_URL=<FASTAPI_BACKEND_URL>

   SPEECH_KEY=<YOUR_SPEECH_KEY>
   SPEECH_REGION=<YOUR_SPEECH_REGION>
   SPEECH_LANGUAGE=<YOUR_SPEECH_LANGUAGE>
   AZURE_OPENAI_ENDPOINT=<YOUR_AZURE_OPENAI_ENDPOINT>
   AZURE_OPENAI_KEY=<YOUR_AZURE_OPENAI_KEY>
   STORAGE_CONNECTION_STRING=<YOUR_STORAGE_CONNECTION_STRING>
   LANGUAGE_KEY=<YOUR_LANGUAGE_KEY>
   LANGUAGE_ENDPOINT=<YOUR_LANGUAGE_ENDPOINT>
   ```

4. **Run the Node.js server**:

   ```bash
   npm run dev
   ```

---

### 🌐 Frontend (Vite-based)

1. **Navigate to the frontend folder**:

   ```bash
   cd frontend
   ```

2. **Create a `.env` file** in `frontend/` with the following content:

   ```
   VITE_SPEECH_KEY=<YOUR_SPEECH_KEY>
   VITE_SPEECH_REGION=<YOUR_SPEECH_REGION>
   VITE_SPEECH_LANGUAGE=<YOUR_SPEECH_LANGUAGE>
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Run the frontend app**:

   ```bash
   npm run dev
   ```

---


## 📌 Use Cases

- Students exploring new technologies
- Professionals reskilling or upskilling
- Curious minds seeking curated learning resources

---


## 🧠 Future Improvements

- Deeper user profile integration for long-term learning recommendations
- Support for course enrollment and progress tracking
- Enhanced recommendation accuracy using collaborative filtering or embeddings

---


## 📄 License

MIT License. See `LICENSE` for more information.
