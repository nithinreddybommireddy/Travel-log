export interface TripPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  location: string;
  visitedDate: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  likes: number;
  likedBy: string[];
  createdAt: number;
}

const STORAGE_KEY = "travellog_trip_photos";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getTripPhotos(): TripPhoto[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addTripPhoto(
  photo: Omit<TripPhoto, "id" | "likes" | "likedBy" | "createdAt">
): TripPhoto {
  const photos = getTripPhotos();
  const newPhoto: TripPhoto = {
    ...photo,
    id: generateId(),
    likes: 0,
    likedBy: [],
    createdAt: Date.now(),
  };
  photos.unshift(newPhoto);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  return newPhoto;
}

export function deleteTripPhoto(id: string, userEmail: string): boolean {
  const photos = getTripPhotos().filter(
    (p) => p.id !== id || p.userEmail === userEmail
  );
  const deleted = photos.length < getTripPhotos().length;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  return deleted;
}

export function likeTripPhoto(id: string, userEmail: string): TripPhoto | null {
  const photos = getTripPhotos();
  const photo = photos.find((p) => p.id === id);
  if (!photo) return null;

  const alreadyLiked = photo.likedBy.includes(userEmail);
  if (alreadyLiked) {
    photo.likes = Math.max(0, photo.likes - 1);
    photo.likedBy = photo.likedBy.filter((e) => e !== userEmail);
  } else {
    photo.likes += 1;
    photo.likedBy.push(userEmail);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  return photo;
}

export function getPhotosByLocation(location: string): TripPhoto[] {
  return getTripPhotos().filter((p) =>
    p.location.toLowerCase().includes(location.toLowerCase())
  );
}

export function getMyPhotos(userEmail: string): TripPhoto[] {
  return getTripPhotos().filter((p) => p.userEmail === userEmail);
}
