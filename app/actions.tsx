export async function getProjects() {
  try {
    // Fetch directly from GitHub API for real projects
    const response = await fetch("https://api.github.com/users/m4rcusbc/repos?sort=updated&per_page=10", {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) throw new Error("Failed to fetch from GitHub");
    
    const repos = await response.json();
    
    // Format into the expected project structure
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return repos
      .filter((repo: any) => !repo.fork && repo.name !== "marcusbc.com")
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .map((repo: any) => ({
        id: repo.id,
        title: repo.name,
        description: repo.description || "A project by Marcus Clements.",
        github_url: repo.html_url,
        live_url: repo.homepage || "",
        tags: [repo.language].filter(Boolean)
      }));
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

import { getAllPosts } from '../lib/blog';

export async function getBlogPosts() {
  return getAllPosts();
}

export async function getDemos() {
  return [
    {
      id: 1,
      title: "UWL Projects - LRU Cache",
      description: "A JavaScript implementation of an LRU (Least Recently Used) Cache using a Map, featured in my academic portfolio.",
      language: "javascript",
      code: `// UWL-Projects - LRU Cache
// Efficient O(1) get and put operations using a Map

class LRUCache {
    constructor(capacity) {
        this.cache = new Map();
        this.capacity = capacity;
    }

    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        // Move accessed item to the end (most recently used)
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.cache.set(key, value);
        if (this.cache.size > this.capacity) {
            // Map keys are ordered, so the first key is the least recently used
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
}

// --- Demonstration ---
console.log("Initializing LRU Cache with capacity 2");
const lru = new LRUCache(2);
lru.put(1, 10);
lru.put(2, 20);
console.log("Get 1:", lru.get(1)); // Returns 10, makes 1 most recently used
lru.put(3, 30);                    // Evicts key 2
console.log("Get 2:", lru.get(2)); // Returns -1 (not found)
lru.put(4, 40);                    // Evicts key 1
console.log("Get 1:", lru.get(1)); // Returns -1 (not found)
console.log("Get 3:", lru.get(3)); // Returns 30
console.log("Get 4:", lru.get(4)); // Returns 40`,
    },
    {
      id: 2,
      title: "RateMyLandlords - Rating Algorithm",
      description: "The core algorithm used to calculate a landlord's overall trust score based on weighted reviews and tenant verification.",
      language: "javascript",
      code: `// ratemylandlords - Core Rating Algorithm
// Calculates a landlord's overall trust score based on weighted reviews

const calculateLandlordScore = (reviews) => {
  if (reviews.length === 0) return "No reviews yet";

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const review of reviews) {
    // Verified tenants and highly upvoted reviews carry more weight
    const weight = (review.verified_tenant ? 1.5 : 1.0) + (review.upvotes * 0.1);
    
    // Responsiveness is weighted heavily in the final score
    const reviewScore = (review.cleanliness + (review.responsiveness * 1.5) + review.fair_pricing) / 3.5;
    
    totalWeightedScore += reviewScore * weight;
    totalWeight += weight;
  }

  return (totalWeightedScore / totalWeight).toFixed(2);
};

// --- Test Data ---
const landlordReviews = [
  { cleanliness: 4, responsiveness: 5, fair_pricing: 3, verified_tenant: true, upvotes: 12 },
  { cleanliness: 2, responsiveness: 1, fair_pricing: 2, verified_tenant: false, upvotes: 2 },
  { cleanliness: 5, responsiveness: 4, fair_pricing: 4, verified_tenant: true, upvotes: 45 }
];

console.log("Analyzing Landlord Profile...");
console.log(\`Aggregate Trust Score: \${calculateLandlordScore(landlordReviews)} / 5.00\`);`,
    },
    {
      id: 3,
      title: "Custom Shell - Command Parser",
      description: "A JavaScript snippet demonstrating how my custom UNIX-like shell parses command-line arguments, handling quotes and background execution.",
      language: "javascript",
      code: `// Custom Shell - Command Parser
// Parses raw command strings into executable arguments, handling quotes and background tasks

function parseCommand(cmdString) {
    const args = [];
    let currentArg = [];
    let inQuotes = false;
    let background = false;

    cmdString = cmdString.trim();
    if (cmdString.endsWith("&")) {
        background = true;
        cmdString = cmdString.slice(0, -1).trim();
    }

    for (const char of cmdString) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ' ' && !inQuotes) {
            if (currentArg.length > 0) {
                args.push(currentArg.join(''));
                currentArg = [];
            }
        } else {
            currentArg.push(char);
        }
    }
            
    if (currentArg.length > 0) {
        args.push(currentArg.join(''));
    }
        
    return {
        executable: args.length > 0 ? args[0] : "",
        arguments: args.slice(1),
        background: background
    };
}

// --- Demonstration ---
const commands = [
    'ls -la',
    'echo "Hello World"',
    'sleep 10 &'
];

console.log("--- Shell Command Parser ---\\n");
for (const cmd of commands) {
    const parsed = parseCommand(cmd);
    console.log(\`Input: \${cmd}\`);
    console.log("Parsed:", JSON.stringify(parsed, null, 2), "\\n");
}`,
    },
  ];
}
