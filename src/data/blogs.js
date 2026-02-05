// Blog posts data - Add your blog posts here
// Each post should have: id, title, excerpt, date, readTime, tags, category, link

const blogs = [
  {
    id: 1,
    title: "How I Built Torrentium: A Peer-to-Peer File Sharing App",
    excerpt:
      "What if you could just send files directly to your friend? Computer to computer. No middleman. A deep dive into building a decentralized P2P file sharing system using Go, libp2p, and WebRTC.",
    date: "2025-12-20",
    readTime: "10 min read",
    tags: ["Go", "P2P", "WebRTC", "libp2p", "Networking", "IPFS"],
    category: "project",
    link: "blog-torrentium.html",
  },
  {
    id: 2,
    title: "Understanding Distributed Hash Tables (DHT)",
    excerpt:
      "An exploration of how DHTs work, their role in decentralized systems, and how they enable peer discovery without central servers. Includes practical examples from libp2p.",
    date: "2026-01-08",
    readTime: "6 min read",
    tags: ["Networking", "Distributed Systems", "P2P"],
    category: "learning",
    link: "#",
  },
  {
    id: 3,
    title: "WebRTC Data Channels: Beyond Video Calls",
    excerpt:
      "WebRTC isn't just for video conferencing. Learn how data channels enable high-performance peer-to-peer data transfer and how I used them in Torrentium.",
    date: "2025-12-20",
    readTime: "5 min read",
    tags: ["WebRTC", "JavaScript", "Networking"],
    category: "tutorial",
    link: "blog-webrtc.html",
  },
  {
    id: 4,
    title: "Creating Interactive 3D Backgrounds with Canvas",
    excerpt:
      "How I built the particle system animation you see on this portfolio. A walkthrough of canvas rendering, particle physics, and performance optimization.",
    date: "2025-12-10",
    readTime: "7 min read",
    tags: ["JavaScript", "Canvas", "Animation", "Performance"],
    category: "tutorial",
    link: "#",
  },
  {
    id: 5,
    title: "My Journey into Systems Programming",
    excerpt:
      "Reflections on transitioning from web development to systems programming. Why I chose Go, what I've learned about low-level concepts, and advice for others.",
    date: "2025-11-28",
    readTime: "4 min read",
    tags: ["Career", "Go", "Learning"],
    category: "thoughts",
    link: "#",
  },
  {
    id: 6,
    title: "Building the Student Senate Portal",
    excerpt:
      "A case study on developing the official IIT Jodhpur Student Senate Portal. Challenges faced, tech stack decisions, and lessons learned from a real-world project.",
    date: "2025-11-15",
    readTime: "6 min read",
    tags: ["React", "Next.js", "Full Stack", "Case Study"],
    category: "project",
    link: "#",
  },
];

// Helper functions
export const getBlogsByCategory = (category) => {
  if (category === "all") return blogs;
  return blogs.filter((blog) => blog.category === category);
};

export const getRecentBlogs = (count = 3) => {
  return [...blogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
};

export const getBlogsByTag = (tag) => {
  return blogs.filter((blog) =>
    blog.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
};

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export default blogs;
