export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  textFields: MemeTextField[];
  category: "classic" | "reaction" | "programming" | "custom";
}

export interface MemeTextField {
  id: string;
  label: string;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    color: string;
    strokeColor: string;
    strokeWidth: number;
  };
}

export const MEME_STORAGE_KEY = "club404-au-memes";

export const DEFAULT_TEMPLATES: MemeTemplate[] = [
  {
    id: "this-is-fine",
    name: "This is Fine",
    imageUrl: "https://i.imgflip.com/263o6g.jpg",
    textFields: [
      { id: "text1", label: "Caption", position: { x: 50, y: 90 }, style: { fontSize: 28, color: "#ffffff", strokeColor: "#000000", strokeWidth: 3 } },
    ],
    category: "reaction",
  },
  {
    id: "two-buttons",
    name: "Two Buttons",
    imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    textFields: [
      { id: "text1", label: "Button 1", position: { x: 30, y: 30 }, style: { fontSize: 22, color: "#ffffff", strokeColor: "#000000", strokeWidth: 3 } },
      { id: "text2", label: "Button 2", position: { x: 70, y: 30 }, style: { fontSize: 22, color: "#ffffff", strokeColor: "#000000", strokeWidth: 3 } },
    ],
    category: "classic",
  },
  {
    id: "drake-hotline",
    name: "Drake Hotline",
    imageUrl: "https://i.imgflip.com/30b1gx.jpg",
    textFields: [
      { id: "text1", label: "Reject", position: { x: 65, y: 25 }, style: { fontSize: 22, color: "#000000", strokeColor: "transparent", strokeWidth: 0 } },
      { id: "text2", label: "Approve", position: { x: 65, y: 75 }, style: { fontSize: 22, color: "#000000", strokeColor: "transparent", strokeWidth: 0 } },
    ],
    category: "classic",
  },
  {
    id: "change-my-mind",
    name: "Change My Mind",
    imageUrl: "https://i.imgflip.com/26am.jpg",
    textFields: [
      { id: "text1", label: "Your Opinion", position: { x: 50, y: 20 }, style: { fontSize: 24, color: "#ffffff", strokeColor: "#000000", strokeWidth: 3 } },
    ],
    category: "classic",
  },
  {
    id: "expanding-brain",
    name: "Expanding Brain",
    imageUrl: "https://i.imgflip.com/1jwhww.jpg",
    textFields: [
      { id: "text1", label: "Level 1", position: { x: 35, y: 15 }, style: { fontSize: 16, color: "#000000", strokeColor: "transparent", strokeWidth: 0 } },
      { id: "text2", label: "Level 2", position: { x: 35, y: 38 }, style: { fontSize: 16, color: "#000000", strokeColor: "transparent", strokeWidth: 0 } },
      { id: "text3", label: "Level 3", position: { x: 35, y: 62 }, style: { fontSize: 16, color: "#000000", strokeColor: "transparent", strokeWidth: 0 } },
      { id: "text4", label: "Level 4", position: { x: 35, y: 85 }, style: { fontSize: 16, color: "#000000", strokeColor: "transparent", strokeWidth: 0 } },
    ],
    category: "classic",
  },
];
