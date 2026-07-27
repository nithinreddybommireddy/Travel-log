import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    tokenIdentifier: v.string(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  savedTours: defineTable({
    userId: v.id("users"),
    tourId: v.string(),
    savedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_user_tour", ["userId", "tourId"]),

  moodBoards: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    coverColor: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    isPublic: v.boolean(),
  })
    .index("by_userId", ["userId"]),

  moodBoardTours: defineTable({
    boardId: v.id("moodBoards"),
    tourId: v.string(),
    note: v.optional(v.string()),
    addedAt: v.number(),
    order: v.number(),
  })
    .index("by_boardId", ["boardId"])
    .index("by_board_tour", ["boardId", "tourId"]),

  tripPlans: defineTable({
    userId: v.id("users"),
    tourId: v.string(),
    startDate: v.optional(v.string()),
    travelers: v.number(),
    budget: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: v.union(v.literal("planning"), v.literal("booked"), v.literal("completed")),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_user_tour", ["userId", "tourId"]),

  travelReviews: defineTable({
    userId: v.id("users"),
    tourId: v.string(),
    rating: v.number(),
    comment: v.string(),
    images: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index("by_tourId", ["tourId"])
    .index("by_userId", ["userId"]),
});
