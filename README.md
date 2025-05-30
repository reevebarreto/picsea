# Picsea

A prototype image search engine inspired by early systems like Google Image Search. Picsea leverages a dataset of 12,500 images scraped from Pexels, enriched with textual descriptions and ResNet-generated tags, indexed using a custom-built Tf-Idf Vector Space Model (VSM) for efficient semantic search.

## 🚀 Features
- Web crawler built with Python Selenium to collect image data from Pexels.
- Image annotation combining Pexels alt text and ResNet CNN-generated tags.
- Custom Tf-Idf VSM implemented in Node.js & TypeScript to index image annotations.
- Efficient image retrieval using cosine similarity between query and image vectors.
- User-friendly search interface built with Next.js, hosted on AWS.

## 🛠️ Tech Stack
- Python (Selenium) for web scraping
- ResNet CNN (pre-trained) for image tagging
- Node.js and TypeScript for indexing and server logic
- Next.js for front-end UI
- MongoDB Atlas for cloud-based NoSQL storage
- AWS for hosting the server and frontend

## 📦 Getting Started

### Clone the repo
```bash
git clone https://github.com/reeveboy/picsea.git
cd picsea
npm install
npm run dev
```
