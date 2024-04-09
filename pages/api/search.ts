import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion } from "mongodb";
import similarity from "compute-cosine-similarity";
import TFIDFVectorizer from "@/utils/tfidfVectorizer";

const URI = process.env.MONGODB_URI as string;

// Initialize global variables for vectorizer and image data
const client = new MongoClient(URI, { 
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// TF-IDF vectorizer instance
const vectorizer = new TFIDFVectorizer();

// Create a dictionary to store image data
let imageData: { [index: string]: { image_url: string; summary: string } } = {};

async function connectToDBAndFit() {
  try {
    await client.connect();

    console.log("Connected to MongoDB database!");

    // Retrieve images from MongoDB
    const db = client.db("MoS");
    const collection = db.collection("images");

    const imageDocs = await collection
      .find({})
      .limit(100)
      .toArray();

    // Process image documents, fit vectorizer, and populate dictionary
    for (const imageDoc of imageDocs) {
      const { index, image_url, summary } = imageDoc;

      // Store image data in dictionary
      imageData[index] = { image_url, summary };
    }

    // Fit the TF-IDF vectorizer with image summaries
    vectorizer.fit(
      new Map(
        Object.entries(imageData).map(([index, data]) => [index, data.summary])
      )
    );

    console.log("TF-IDF vectorizer fitted successfully!");
    
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application on connection failure
  }
}

// Ensure database connection and fitting on server-side
if (typeof(window) == 'undefined') connectToDBAndFit();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Access search results from props (set in getServerSideProps)
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter" });
  }

  // Convert the query into a TF-IDF vector
  const queryVector = vectorizer.transform(query);

  // Calculate cosine similarities
  const cosineSimilarities: { [id: string]: number } = {};
  for (const [id, summaryVector] of Object.entries(vectorizer.summaryVectors)) {
    cosineSimilarities[id] = similarity(queryVector, summaryVector) || 0;
  }

  // Sort documents and their cosine similarities in descending order
  const sortedResults = Object.entries(cosineSimilarities)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }))
    .slice(0, 30); // Return top 10 results by default

  res.json({
    images: sortedResults.map((result) => {
      const matchingImage = imageData[result.id];
      if (matchingImage) {
        return {
          index: result.id,
          image_url: matchingImage.image_url,
          summary: matchingImage.summary,
        };
      } else {
        console.warn(`Image with ID "${result.id}" not found in imageData`);
        return null;
      }
    }),
  });

  res.json({ query });
}
