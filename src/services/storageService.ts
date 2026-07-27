import { useState, useCallback, useEffect } from "react";

// --- Types ---

export interface SavedTour {
  id: string;
  tourId: string;
  savedAt: number;
}

export interface MoodBoard {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverColor: string;
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
}

export interface MoodBoardTour {
  id: string;
  boardId: string;
  tourId: string;
  note?: string;
  addedAt: number;
  order: number;
}

export interface TripPlan {
  id: string;
  userId: string;
  tourId: string;
  startDate?: string;
  travelers: number;
  budget?: number;
  notes?: string;
  status: "planning" | "booked" | "completed";
  createdAt: number;
}

// --- Helpers ---

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Saved Tours Hook ---

export function useSavedTours(userId: string | undefined) {
  const storageKey = `travellog_saved_${userId || "guest"}`;

  const [savedTours, setSavedTours] = useState<SavedTour[]>(() =>
    getStorageItem<SavedTour[]>(storageKey, [])
  );

  useEffect(() => {
    setStorageItem(storageKey, savedTours);
  }, [storageKey, savedTours]);

  const saveTour = useCallback((tourId: string) => {
    setSavedTours((prev) => {
      if (prev.some((st) => st.tourId === tourId)) return prev;
      return [{ id: generateId(), tourId, savedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeSavedTour = useCallback((tourId: string) => {
    setSavedTours((prev) => prev.filter((st) => st.tourId !== tourId));
  }, []);

  const isTourSaved = useCallback(
    (tourId: string) => savedTours.some((st) => st.tourId === tourId),
    [savedTours]
  );

  return { savedTours, saveTour, removeSavedTour, isTourSaved };
}

// --- Mood Boards Hook ---

export function useMoodBoards(userId: string | undefined) {
  const storageKey = `travellog_boards_${userId || "guest"}`;
  const toursKey = `travellog_board_tours_${userId || "guest"}`;

  const [boards, setBoards] = useState<MoodBoard[]>(() =>
    getStorageItem<MoodBoard[]>(storageKey, [])
  );
  const [boardTours, setBoardTours] = useState<MoodBoardTour[]>(() =>
    getStorageItem<MoodBoardTour[]>(toursKey, [])
  );

  useEffect(() => { setStorageItem(storageKey, boards); }, [storageKey, boards]);
  useEffect(() => { setStorageItem(toursKey, boardTours); }, [toursKey, boardTours]);

  const createBoard = useCallback((name: string, description: string | undefined, coverColor: string, isPublic: boolean) => {
    const now = Date.now();
    const board: MoodBoard = {
      id: generateId(),
      userId: userId || "guest",
      name,
      description,
      coverColor,
      createdAt: now,
      updatedAt: now,
      isPublic,
    };
    setBoards((prev) => [board, ...prev]);
    return board.id;
  }, [userId]);

  const updateBoard = useCallback((boardId: string, updates: Partial<MoodBoard>) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, ...updates, updatedAt: Date.now() } : b))
    );
  }, []);

  const deleteBoard = useCallback((boardId: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    setBoardTours((prev) => prev.filter((bt) => bt.boardId !== boardId));
  }, []);

  const addTourToBoard = useCallback((boardId: string, tourId: string, note?: string) => {
    setBoardTours((prev) => {
      if (prev.some((bt) => bt.boardId === boardId && bt.tourId === tourId)) return prev;
      const maxOrder = prev
        .filter((bt) => bt.boardId === boardId)
        .reduce((max, bt) => Math.max(max, bt.order), -1);
      const bt: MoodBoardTour = {
        id: generateId(),
        boardId,
        tourId,
        note,
        addedAt: Date.now(),
        order: maxOrder + 1,
      };
      return [...prev, bt];
    });
    updateBoard(boardId, {});
  }, [updateBoard]);

  const removeTourFromBoard = useCallback((boardId: string, tourId: string) => {
    setBoardTours((prev) => prev.filter((bt) => !(bt.boardId === boardId && bt.tourId === tourId)));
  }, []);

  const getBoard = useCallback((boardId: string) => boards.find((b) => b.id === boardId), [boards]);
  const getBoardTours = useCallback((boardId: string) => boardTours.filter((bt) => bt.boardId === boardId).sort((a, b) => a.order - b.order), [boardTours]);

  return { boards, createBoard, updateBoard, deleteBoard, addTourToBoard, removeTourFromBoard, getBoard, getBoardTours };
}

// --- Trip Plans Hook ---

export function useTripPlans(userId: string | undefined) {
  const storageKey = `travellog_trips_${userId || "guest"}`;

  const [plans, setPlans] = useState<TripPlan[]>(() =>
    getStorageItem<TripPlan[]>(storageKey, [])
  );

  useEffect(() => { setStorageItem(storageKey, plans); }, [storageKey, plans]);

  const createTripPlan = useCallback((tourId: string, travelers: number, startDate?: string, budget?: number, notes?: string) => {
    const plan: TripPlan = {
      id: generateId(),
      userId: userId || "guest",
      tourId,
      startDate,
      travelers,
      budget,
      notes,
      status: "planning",
      createdAt: Date.now(),
    };
    setPlans((prev) => [plan, ...prev]);
    return plan.id;
  }, [userId]);

  const updateStatus = useCallback((planId: string, status: TripPlan["status"]) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, status } : p)));
  }, []);

  const deletePlan = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  }, []);

  return { plans, createTripPlan, updateStatus, deletePlan };
}

// --- Food Reviews Hook ---

export interface FoodReview {
  id: string;
  foodId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export function useFoodReviews() {
  const storageKey = `travellog_food_reviews`;

  const [reviews, setReviews] = useState<FoodReview[]>(() =>
    getStorageItem<FoodReview[]>(storageKey, [])
  );

  useEffect(() => {
    setStorageItem(storageKey, reviews);
  }, [storageKey, reviews]);

  const addReview = useCallback((foodId: string, userId: string, userName: string, rating: number, comment: string) => {
    const review: FoodReview = {
      id: generateId(),
      foodId,
      userId,
      userName: userName || "Anonymous",
      rating,
      comment,
      createdAt: Date.now(),
    };
    setReviews((prev) => [review, ...prev]);
    return review;
  }, []);

  const getReviewsForFood = useCallback((foodId: string): FoodReview[] => {
    return reviews.filter((r) => r.foodId === foodId).sort((a, b) => b.createdAt - a.createdAt);
  }, [reviews]);

  const getAverageRating = useCallback((foodId: string): number => {
    const foodReviews = reviews.filter((r) => r.foodId === foodId);
    if (foodReviews.length === 0) return 0;
    return foodReviews.reduce((sum, r) => sum + r.rating, 0) / foodReviews.length;
  }, [reviews]);

  const getReviewCount = useCallback((foodId: string): number => {
    return reviews.filter((r) => r.foodId === foodId).length;
  }, [reviews]);

  const deleteReview = useCallback((reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }, []);

  return { reviews, addReview, getReviewsForFood, getAverageRating, getReviewCount, deleteReview };
}
