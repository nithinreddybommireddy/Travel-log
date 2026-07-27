import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveTour = mutation({
  args: {
    userId: v.id("users"),
    tourId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("savedTours")
      .withIndex("by_user_tour", (q) =>
        q.eq("userId", args.userId).eq("tourId", args.tourId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("savedTours", {
      userId: args.userId,
      tourId: args.tourId,
      savedAt: Date.now(),
    });
  },
});

export const removeSavedTour = mutation({
  args: {
    userId: v.id("users"),
    tourId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("savedTours")
      .withIndex("by_user_tour", (q) =>
        q.eq("userId", args.userId).eq("tourId", args.tourId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getSavedTours = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("savedTours")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const isTourSaved = query({
  args: {
    userId: v.id("users"),
    tourId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("savedTours")
      .withIndex("by_user_tour", (q) =>
        q.eq("userId", args.userId).eq("tourId", args.tourId)
      )
      .first();
    return existing !== null;
  },
});
