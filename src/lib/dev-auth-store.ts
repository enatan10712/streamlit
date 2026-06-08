import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "dev-store.json");

export interface DevUser {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  role: string;
  createdAt: string;
}

export interface DevProfile {
  id: string;
  userId: string;
  name: string;
  image: string | null;
  createdAt: string;
}

interface DevStore {
  users: DevUser[];
  profiles: DevProfile[];
}

async function readStore(): Promise<DevStore> {
  try {
    const data = await fs.readFile(STORE_FILE, "utf-8");
    return JSON.parse(data) as DevStore;
  } catch {
    return { users: [], profiles: [] };
  }
}

async function writeStore(store: DevStore) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export function isDevAuthFallbackEnabled() {
  return process.env.NODE_ENV === "development";
}

export async function devCreateUser(email: string, name: string, hashedPassword: string) {
  const store = await readStore();
  if (store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already registered");
  }

  const user: DevUser = {
    id: randomUUID(),
    email,
    name,
    hashedPassword,
    role: "USER",
    createdAt: new Date().toISOString(),
  };

  const profile: DevProfile = {
    id: randomUUID(),
    userId: user.id,
    name,
    image: null,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  store.profiles.push(profile);
  await writeStore(store);
  return user;
}

export async function devFindUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function devFindUserById(id: string) {
  const store = await readStore();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function devGetProfiles(userId: string) {
  const store = await readStore();
  return store.profiles.filter((p) => p.userId === userId);
}

export async function devCreateProfile(userId: string, name: string) {
  const store = await readStore();
  const count = store.profiles.filter((p) => p.userId === userId).length;
  if (count >= 5) throw new Error("Maximum of 5 profiles reached");

  const profile: DevProfile = {
    id: randomUUID(),
    userId,
    name,
    image: null,
    createdAt: new Date().toISOString(),
  };

  store.profiles.push(profile);
  await writeStore(store);
  return profile;
}
