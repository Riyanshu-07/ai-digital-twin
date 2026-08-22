# 🧠 AI Digital Twin

A personalized AI system that combines **RAG, long-term memory, personality, voice interaction, and a real-time 3D VRM avatar**.

The goal is to create an AI system that doesn't just answer questions, but maintains context, remembers information, speaks naturally, and has a visual digital identity.

---

## ✨ Features

- 🧠 **Personalized AI Brain**
- 🔎 **Retrieval-Augmented Generation (RAG)**
- 💾 **Long-Term Memory**
- 🎭 **Personality Engine**
- 💬 **Natural Conversation**
- 🎙️ **Voice Input**
- 🔊 **Text-to-Speech**
- 👤 **Real-Time 3D VRM Avatar**
- 👄 **Audio-Based Lip Sync**
- 👁️ **Interactive Eye Tracking**
- 🗣️ **Avatar Speaking Animation**
- ⚡ **Futuristic AI Dashboard**

---

## 🧠 How It Works

```text
User
 │
 ├── Text
 │
 └── Voice
       │
       ▼
 Speech-to-Text
       │
       ▼
 Query Embedding
       │
       ├───────────────┐
       ▼               ▼
      RAG       Long-Term Memory
       │               │
       └───────┬───────┘
               ▼
        Personality Layer
               │
               ▼
              LLM
               │
               ▼
          AI Response
               │
        ┌──────┴──────┐
        ▼             ▼
   Chat Response    TTS
                      │
                      ▼
                  Audio
                      │
                      ▼
                3D VRM Avatar
                      │
                      ▼
              Lip Sync + Motion
```

---

## 🔎 RAG Pipeline

The system retrieves relevant knowledge before generating a response.

```text
User Question
      ↓
Query Embedding
      ↓
Semantic Retrieval
      ↓
Relevant Knowledge
      ↓
LLM
      ↓
Grounded Response
```

This allows the Digital Twin to answer using its available knowledge instead of relying only on the model's general knowledge.

---

## 💾 Long-Term Memory

The Digital Twin can store useful information from conversations and retrieve it later.

Example:

```text
User:
"I am working on an AI Digital Twin."

        ↓

Memory Processing

        ↓

Stored Memory

        ↓

Future Conversation

User:
"What project am I working on?"

        ↓

Digital Twin:
"You're working on an AI Digital Twin."
```

---

## 🎭 Personality

The AI response is generated using multiple context layers:

```text
Personality
+
Relevant Knowledge
+
Previous Conversation
+
Long-Term Memory
+
Current User Question
```

This helps maintain a consistent Digital Twin identity.

---

## 🎙️ Voice Interaction

The system supports voice-based interaction:

```text
Microphone
    ↓
Speech-to-Text
    ↓
AI Processing
    ↓
AI Response
    ↓
Text-to-Speech
    ↓
3D Avatar
```

---

## 👤 3D Avatar

The project uses a VRM avatar rendered with:

- Three.js
- @pixiv/three-vrm
- GLTFLoader
- OrbitControls
- Web Audio API

The avatar supports:

- Real-time 3D rendering
- Mouse-based look-at tracking
- Head movement
- Idle animation
- Blinking
- Speaking movement
- Facial expressions
- Audio lip synchronization

---

## 👄 Lip Sync

The avatar analyzes the generated speech audio:

```text
TTS Audio
    ↓
Web Audio API
    ↓
Audio Analyser
    ↓
Frequency Data
    ↓
Mouth Expression
```

The avatar's mouth movement changes according to the audio intensity.

---

## 🛠️ Tech Stack

### AI / Backend

- Python
- Streamlit
- Large Language Model
- RAG
- Semantic Embeddings
- Long-Term Memory
- Conversation Memory
- Speech-to-Text
- Text-to-Speech

### 3D / Frontend

- JavaScript
- Three.js
- VRM
- @pixiv/three-vrm
- GLTFLoader
- OrbitControls
- Web Audio API

### UI

- Streamlit
- HTML
- CSS
- JavaScript

---

## 📁 Project Structure

```text
AI_DIGITAL_TWIN/
│
├── app.py
│
├── avatar/
│   ├── index.html
│   ├── avatar.js
│   │
│   ├── models/
│   │   └── digital_twin.vrm
│   │
│   └── audio/
│       └── latest.mp3
│
├── core/
│   ├── llm.py
│   ├── personality.py
│   ├── memory.py
│   ├── memory_manager.py
│   ├── embeddings.py
│   ├── memory_store.py
│   ├── speech.py
│   └── tts.py
│
├── rag/
│   └── retriever.py
│
├── data/
│   └── knowledge/
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AI_DIGITAL_TWIN.git
cd AI_DIGITAL_TWIN
```

### 2. Create a virtual environment

#### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

If required:

```bash
pip install edge-tts
```

---

## 🔐 Environment Variables

Create a `.env` file for your API keys.

Example:

```env
OPENAI_API_KEY=your_api_key_here
```

Never commit API keys to GitHub.

Make sure `.env` is included in `.gitignore`:

```text
.env
```

---

## ▶️ Run the Project

The project requires two local servers.

### Terminal 1 — 3D Avatar

```bash
cd avatar
python3 -m http.server 8000
```

The avatar server runs at:

```text
http://localhost:8000
```

Keep this terminal running.

### Terminal 2 — Streamlit

From the project root:

```bash
streamlit run app.py
```

Open the Streamlit URL shown in the terminal.

---

## 🧪 Example Flow

```text
1. Open the Digital Twin
        ↓
2. 3D avatar loads
        ↓
3. Ask a question
        ↓
4. RAG retrieves relevant knowledge
        ↓
5. Long-term memory is checked
        ↓
6. Personality context is added
        ↓
7. LLM generates response
        ↓
8. TTS generates voice
        ↓
9. Avatar speaks
        ↓
10. Lip synchronization activates
```

---

## 🎯 Project Goal

Traditional chatbot:

```text
Input → AI → Text
```

AI Digital Twin:

```text
Input
  ↓
Understanding
  ↓
Knowledge
  ↓
Memory
  ↓
Personality
  ↓
Reasoning
  ↓
Voice
  ↓
3D Embodiment
```

The project explores how an AI system can become a more persistent and interactive digital presence rather than simply a text-based chatbot.

---

## 🚀 Future Improvements

- [ ] Real-time emotional expressions
- [ ] Better phoneme-level lip synchronization
- [ ] Advanced gesture animation
- [ ] Emotion-aware voice synthesis
- [ ] Real-time response streaming
- [ ] Improved memory ranking
- [ ] Multi-modal memory
- [ ] Personalized voice
- [ ] Cloud deployment
- [ ] Production web frontend
- [ ] Autonomous task execution
- [ ] Advanced avatar animations

---

## 📚 What This Project Demonstrates

- Retrieval-Augmented Generation
- Semantic Search
- Embeddings
- AI Memory
- Conversation Memory
- Prompt Engineering
- Personality Modeling
- Speech Recognition
- Text-to-Speech
- Web Audio APIs
- Three.js
- VRM Avatars
- Full-Stack AI Development

---

## 👨‍💻 Author

### Riyanshu

Aspiring AI/ML Engineer interested in:

- Machine Learning
- Deep Learning
- Generative AI
- NLP
- Computer Vision
- RAG Systems
- AI Agents
- Intelligent Applications

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is intended for educational, experimental, and personal development purposes.
