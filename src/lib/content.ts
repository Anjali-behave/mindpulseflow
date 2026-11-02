import type { MoodLevel, Category } from "./types";

export const MOODS: { level: MoodLevel; label: string; tone: string }[] = [
  { level: 1, label: "Very low", tone: "bg-sky" },
  { level: 2, label: "Low", tone: "bg-lavender" },
  { level: 3, label: "Okay", tone: "bg-butter" },
  { level: 4, label: "Good", tone: "bg-sage" },
  { level: 5, label: "Great", tone: "bg-pink" },
];

export const EMOTION_TAGS = [
  "calm", "grateful", "tired", "anxious", "excited", "lonely", "motivated", "overwhelmed", "content", "restless", "hopeful", "stressed",
];

export const CATEGORIES: Record<Category, { label: string; tone: string }> = {
  study: { label: "Study", tone: "bg-sky" },
  "self-care": { label: "Self-care", tone: "bg-pink" },
  chores: { label: "Chores", tone: "bg-butter" },
  social: { label: "Social", tone: "bg-sage" },
  hobby: { label: "Hobby", tone: "bg-lavender" },
};

export const ENCOURAGEMENTS = [
  "You don't have to do it all today.",
  "Small steps count, too.",
  "A little progress is still progress.",
  "What feels right for you today?",
  "Rest is part of the plan.",
];

export type HobbyCat = "art" | "music" | "reading" | "languages" | "movement" | "practical" | "science" | "mindful";

export const HOBBY_CATS: Record<HobbyCat, { label: string; tone: string }> = {
  art: { label: "Art & creativity", tone: "bg-pink" },
  music: { label: "Music", tone: "bg-lavender" },
  reading: { label: "Reading & writing", tone: "bg-butter" },
  languages: { label: "Languages", tone: "bg-sky" },
  movement: { label: "Movement & outdoors", tone: "bg-sage" },
  practical: { label: "Practical skills", tone: "bg-butter" },
  science: { label: "Science & tech", tone: "bg-sky" },
  mindful: { label: "Mindful moments", tone: "bg-lavender" },
};

export interface Hobby {
  id: string;
  cat: HobbyCat;
  title: string;
  desc: string;
  minutes: number;
  level: "Easy" | "Medium" | "Stretch";
  steps: string[];
}

export const HOBBIES: Hobby[] = [
  { id: "doodle-day", cat: "art", title: "Doodle your day", desc: "Draw three tiny things you saw today — no skill needed.", minutes: 10, level: "Easy", steps: ["Grab any pen", "Pick 3 objects from today", "Draw each in under 2 minutes"] },
  { id: "blind-contour", cat: "art", title: "Blind contour sketch", desc: "Sketch your hand without looking at the paper. Gloriously wobbly.", minutes: 5, level: "Easy", steps: ["Look only at your hand", "Draw slowly in one line", "Laugh at the result"] },
  { id: "hum-melody", cat: "music", title: "Hum a new melody", desc: "Record a 20-second tune on your phone and name it.", minutes: 5, level: "Easy", steps: ["Open voice memos", "Hum whatever comes", "Give it a silly title"] },
  { id: "new-album", cat: "music", title: "One album, no skipping", desc: "Listen to an album start to finish from a genre you rarely play.", minutes: 40, level: "Medium", steps: ["Pick an unfamiliar genre", "Put the phone face down", "Note one song you liked"] },
  { id: "micro-poem", cat: "reading", title: "Write a micro-poem", desc: "Three lines about the weather outside your window.", minutes: 5, level: "Easy", steps: ["Look outside", "Write 3 short lines", "Keep it or toss it"] },
  { id: "short-story", cat: "reading", title: "Read one short story", desc: "A whole world in fifteen minutes.", minutes: 15, level: "Easy", steps: ["Find a free short story online", "Read without multitasking", "Sum it up in one sentence"] },
  { id: "ten-words", cat: "languages", title: "Ten words in a new language", desc: "Learn ten words for things on your desk.", minutes: 10, level: "Easy", steps: ["Choose a language", "Label 10 desk items", "Quiz yourself tomorrow"] },
  { id: "song-lyrics", cat: "languages", title: "Translate a chorus", desc: "Pick a song in another language and translate its chorus.", minutes: 20, level: "Medium", steps: ["Find lyrics", "Translate line by line", "Sing along badly"] },
  { id: "sunset-walk", cat: "movement", title: "A no-destination walk", desc: "Walk for 15 minutes and turn wherever looks nice.", minutes: 15, level: "Easy", steps: ["Leave the phone in pocket", "Take random turns", "Notice 3 colours"] },
  { id: "stretch-flow", cat: "movement", title: "Desk stretch flow", desc: "Five gentle stretches to unknot study shoulders.", minutes: 7, level: "Easy", steps: ["Neck rolls", "Shoulder shrugs", "Seated twist", "Wrist circles", "Forward fold"] },
  { id: "one-recipe", cat: "practical", title: "Cook one new snack", desc: "Make something with three ingredients or fewer.", minutes: 25, level: "Medium", steps: ["Look in the cupboard", "Search a 3-ingredient recipe", "Plate it nicely"] },
  { id: "sew-button", cat: "practical", title: "Learn to sew a button", desc: "A tiny life skill that feels weirdly powerful.", minutes: 15, level: "Easy", steps: ["Find a needle & thread", "Watch a 2-min tutorial", "Rescue a shirt"] },
  { id: "stargaze", cat: "science", title: "Find one constellation", desc: "Use a free sky app and spot something tonight.", minutes: 15, level: "Easy", steps: ["Open a star map", "Go outside after dark", "Find one shape"] },
  { id: "tiny-code", cat: "science", title: "Build a tiny web page", desc: "Make a page about your favourite food in plain HTML.", minutes: 30, level: "Stretch", steps: ["Open a text editor", "Write a heading and a list", "Open it in your browser"] },
  { id: "box-breath", cat: "mindful", title: "Box breathing", desc: "Breathe in, hold, out, hold — four counts each.", minutes: 3, level: "Easy", steps: ["Sit comfortably", "4 counts in, 4 hold", "4 counts out, 4 hold", "Repeat 5 times"] },
  { id: "gratitude-3", cat: "mindful", title: "Three good things", desc: "Write down three small things that went okay today.", minutes: 5, level: "Easy", steps: ["Grab a note", "List 3 small good things", "Read them back slowly"] },
];
