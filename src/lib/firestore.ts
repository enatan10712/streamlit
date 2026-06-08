import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Profile,
  WatchHistoryItem,
  ContinueWatchingItem,
} from '@/store/useAuthStore';

// Collection references
const PROFILES_COLLECTION = 'profiles';
const USERS_COLLECTION = 'users';

// User operations
export const createUserDocument = async (
  userId: string,
  email: string,
  displayName: string
) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) return;

  await setDoc(userRef, {
    email,
    displayName,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getUserDocument = async (userId: string) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
};

// Profile operations
export const createProfile = async (
  userId: string,
  name: string,
  avatar: string
): Promise<Profile> => {
  const profileRef = collection(db, USERS_COLLECTION, userId, PROFILES_COLLECTION);
  const newProfile = {
    userId,
    name,
    avatar,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    watchHistory: [],
    favorites: [],
    continueWatching: [],
  };

  const docRef = await addDoc(profileRef, newProfile);
  return {
    id: docRef.id,
    ...newProfile,
    createdAt: newProfile.createdAt.toMillis(),
    updatedAt: newProfile.updatedAt.toMillis(),
  };
};

export const getProfiles = async (userId: string): Promise<Profile[]> => {
  const profileRef = collection(db, USERS_COLLECTION, userId, PROFILES_COLLECTION);
  const snapshot = await getDocs(profileRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toMillis?.() || 0,
    updatedAt: doc.data().updatedAt?.toMillis?.() || 0,
  } as Profile));
};

export const getProfile = async (
  userId: string,
  profileId: string
): Promise<Profile | null> => {
  const profileRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    PROFILES_COLLECTION,
    profileId
  );
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toMillis?.() || 0,
    updatedAt: snapshot.data().updatedAt?.toMillis?.() || 0,
  } as Profile;
};

export const updateProfile = async (
  userId: string,
  profileId: string,
  data: Partial<Profile>
) => {
  const profileRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    PROFILES_COLLECTION,
    profileId
  );
  await updateDoc(profileRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProfile = async (userId: string, profileId: string) => {
  const profileRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    PROFILES_COLLECTION,
    profileId
  );
  await deleteDoc(profileRef);
};

// Watch history operations
export const addToWatchHistory = async (
  userId: string,
  profileId: string,
  item: WatchHistoryItem
) => {
  const profileRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    PROFILES_COLLECTION,
    profileId
  );
  const profile = await getProfile(userId, profileId);

  if (profile) {
    const watchHistory = profile.watchHistory || [];
    const filteredHistory = watchHistory.filter(
      (h) => h.contentId !== item.contentId
    );
    await updateDoc(profileRef, {
      watchHistory: [item, ...filteredHistory],
      updatedAt: Timestamp.now(),
    });
  }
};

// Continue watching operations
export const updateContinueWatching = async (
  userId: string,
  profileId: string,
  item: ContinueWatchingItem
) => {
  const profileRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    PROFILES_COLLECTION,
    profileId
  );
  const profile = await getProfile(userId, profileId);

  if (profile) {
    const continueWatching = profile.continueWatching || [];
    const filteredList = continueWatching.filter(
      (c) => c.contentId !== item.contentId
    );
    await updateDoc(profileRef, {
      continueWatching: [item, ...filteredList],
      updatedAt: Timestamp.now(),
    });
  }
};

// Favorites operations
export const addToFavorites = async (
  userId: string,
  profileId: string,
  contentId: string
) => {
  const profileRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    PROFILES_COLLECTION,
    profileId
  );
  const profile = await getProfile(userId, profileId);

  if (profile) {
    const favorites = profile.favorites || [];
    if (!favorites.includes(contentId)) {
      await updateDoc(profileRef, {
        favorites: [...favorites, contentId],
        updatedAt: Timestamp.now(),
      });
    }
  }
};

export const removeFromFavorites = async (
  userId: string,
  profileId: string,
  contentId: string
) => {
  const profileRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    PROFILES_COLLECTION,
    profileId
  );
  const profile = await getProfile(userId, profileId);

  if (profile) {
    const favorites = profile.favorites || [];
    await updateDoc(profileRef, {
      favorites: favorites.filter((id) => id !== contentId),
      updatedAt: Timestamp.now(),
    });
  }
};
