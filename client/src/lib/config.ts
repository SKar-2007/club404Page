export const LINKS = {
  whatsapp: import.meta.env.VITE_WHATSAPP_LINK || "https://chat.whatsapp.com/EOR7RBOol6AGHNf0IdhpZI",
  discord: import.meta.env.VITE_DISCORD_LINK || "https://discord.gg/jSAkqbdeu7",
} as const;

export const IMAGES = {
  hero: "https://res.cloudinary.com/dxkje9whm/image/upload/v1758892770/hero-coding_l796ty.jpg",
} as const;
