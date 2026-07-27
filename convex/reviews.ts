import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addReview = mutation({
  args: {
    userId: v.id("users"),
    tourId: v.string(),
    rating: v.number(),
    comment: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Check if user already reviewed this tour
    const existing = await ctx.db
      .query("travelReviews")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const alreadyReviewed = existing.find((r) => r.tourId === args.tourId);
    if (alreadyReviewed) {
      throw new Error("You have already reviewed this tour");
    }

    return await ctx.db.insert("travelReviews", {
      userId: args.userId,
      tourId: args.tourId,
      rating: args.rating,
      comment: args.comment,
      images: args.images,
      createdAt: Date.now(),
    });
  },
});

export const getTourReviews = query({
  args: { tourId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("travelReviews")
      .withIndex("by_tourId", (q) => q.eq("tourId", args.tourId))
      .order("desc")
      .collect();
  },
});

export const getUserReviews = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("travelReviews")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
