import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTripPlan = mutation({
  args: {
    userId: v.id("users"),
    tourId: v.string(),
    startDate: v.optional(v.string()),
    travelers: v.number(),
    budget: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tripPlans", {
      userId: args.userId,
      tourId: args.tourId,
      startDate: args.startDate,
      travelers: args.travelers,
      budget: args.budget,
      notes: args.notes,
      status: "planning",
      createdAt: Date.now(),
    });
  },
});

export const updateTripStatus = mutation({
  args: {
    planId: v.id("tripPlans"),
    status: v.union(v.literal("planning"), v.literal("booked"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, { status: args.status });
  },
});

export const getUserTripPlans = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tripPlans")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const deleteTripPlan = mutation({
  args: { planId: v.id("tripPlans") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.planId);
  },
});

export const getTourTripPlans = query({
  args: {
    userId: v.id("users"),
    tourId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tripPlans")
      .withIndex("by_user_tour", (q) =>
        q.eq("userId", args.userId).eq("tourId", args.tourId)
      )
      .collect();
  },
});
