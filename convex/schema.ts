import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Include Convex Auth tables (users, authSessions, etc.) alongside our app tables.
export default defineSchema({
  ...authTables,

  rides: defineTable({
    from: v.string(),
    to: v.string(),
    paymentMethod: v.union(v.literal('cash'), v.literal('card')),
    status: v.union(
      v.literal('requested'),
      v.literal('accepted'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('cancelled'),
    ),
    distance: v.optional(v.string()),
    // store the driver's user id (Convex auth user id) when accepted
    driverId: v.optional(v.string()),
  }).index('by_status', ['status']),
});
