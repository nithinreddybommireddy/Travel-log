import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBoard = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    coverColor: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("moodBoards", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      coverColor: args.coverColor,
      createdAt: now,
      updatedAt: now,
      isPublic: args.isPublic,
    });
  },
});

export const updateBoard = mutation({
  args: {
    boardId: v.id("moodBoards"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    coverColor: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { boardId, ...updates } = args;
    await ctx.db.patch(boardId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteBoard = mutation({
  args: { boardId: v.id("moodBoards") },
  handler: async (ctx, args) => {
    // Delete all tours in this board
    const boardTours = await ctx.db
      .query("moodBoardTours")
      .withIndex("by_boardId", (q) => q.eq("boardId", args.boardId))
      .collect();

    for (const bt of boardTours) {
      await ctx.db.delete(bt._id);
    }

    await ctx.db.delete(args.boardId);
  },
});

export const getUserBoards = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("moodBoards")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getBoard = query({
  args: { boardId: v.id("moodBoards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.boardId);
  },
});

export const addTourToBoard = mutation({
  args: {
    boardId: v.id("moodBoards"),
    tourId: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("moodBoardTours")
      .withIndex("by_board_tour", (q) =>
        q.eq("boardId", args.boardId).eq("tourId", args.tourId)
      )
      .first();

    if (existing) return existing._id;

    // Get current max order
    const existingTours = await ctx.db
      .query("moodBoardTours")
      .withIndex("by_boardId", (q) => q.eq("boardId", args.boardId))
      .collect();

    const maxOrder = existingTours.reduce((max, t) => Math.max(max, t.order), -1);

    return await ctx.db.insert("moodBoardTours", {
      boardId: args.boardId,
      tourId: args.tourId,
      note: args.note,
      addedAt: Date.now(),
      order: maxOrder + 1,
    });
  },
});

export const removeTourFromBoard = mutation({
  args: {
    boardId: v.id("moodBoards"),
    tourId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("moodBoardTours")
      .withIndex("by_board_tour", (q) =>
        q.eq("boardId", args.boardId).eq("tourId", args.tourId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getBoardTours = query({
  args: { boardId: v.id("moodBoards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("moodBoardTours")
      .withIndex("by_boardId", (q) => q.eq("boardId", args.boardId))
      .order("asc")
      .collect();
  },
});
