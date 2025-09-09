import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createRide = mutation({
  args: {
    from: v.string(),
    to: v.string(),
    paymentMethod: v.union(v.literal('cash'), v.literal('card')),
    distance: v.optional(v.string()),
  },
  returns: v.object({ _id: v.id('rides'), from: v.string(), to: v.string(), paymentMethod: v.union(v.literal('cash'), v.literal('card')), status: v.string(), distance: v.optional(v.string()), driverId: v.optional(v.string()), _creationTime: v.number() }),
  handler: async (ctx, args) => {
    const inserted = await ctx.db.insert('rides', {
      from: args.from,
      to: args.to,
      paymentMethod: args.paymentMethod,
      status: 'requested' as const,
      distance: args.distance,
    });

    // return shape must match validator exactly
    return { _id: inserted._id, from: inserted.from, to: inserted.to, paymentMethod: inserted.paymentMethod, status: inserted.status, distance: inserted.distance, driverId: inserted.driverId, _creationTime: inserted._creationTime };
  },
});

export const listRidesByStatus = query({
  args: { status: v.union(v.literal('requested'), v.literal('accepted'), v.literal('in_progress'), v.literal('completed'), v.literal('cancelled')) },
  returns: v.array(v.object({ _id: v.id('rides'), from: v.string(), to: v.string(), paymentMethod: v.union(v.literal('cash'), v.literal('card')), status: v.string(), distance: v.optional(v.string()), driverId: v.optional(v.string()), _creationTime: v.number() })),
  handler: async (ctx, args) => {
    const results = await ctx.db.query('rides').withIndex('by_status', (q) => q.eq('status', args.status)).order('desc').take(100);
    return results.map(r => ({ _id: r._id, from: r.from, to: r.to, paymentMethod: r.paymentMethod, status: r.status, distance: r.distance, driverId: r.driverId, _creationTime: r._creationTime }));
  }
});

// Accept ride: infer driverId from authenticated user context
export const acceptRide = mutation({
  args: { rideId: v.id('rides') },
  returns: v.object({ _id: v.id('rides'), status: v.string(), driverId: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    // ctx.auth provides the authenticated user id when Convex Auth is configured
    const driverId = (ctx.auth && ctx.auth.userId) ? ctx.auth.userId : null;
    if (!driverId) {
      throw new Error('Not authenticated');
    }

    await ctx.db.patch(args.rideId, { status: 'accepted' as const, driverId });
    const updated = await ctx.db.get(args.rideId);
    if (!updated) throw new Error('Ride not found');
    return { _id: updated._id, status: updated.status, driverId: updated.driverId };
  }
});

export const updateRideStatus = mutation({
  args: { rideId: v.id('rides'), status: v.union(v.literal('requested'), v.literal('accepted'), v.literal('in_progress'), v.literal('completed'), v.literal('cancelled')) },
  returns: v.object({ _id: v.id('rides'), status: v.string() }),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.rideId, { status: args.status });
    const updated = await ctx.db.get(args.rideId);
    if (!updated) throw new Error('Ride not found');
    return { _id: updated._id, status: updated.status };
  }
});

// New: get a single ride by id (returns null if not found)
export const getRide = query({
  args: { rideId: v.id('rides') },
  returns: v.union(v.null(), v.object({ _id: v.id('rides'), from: v.string(), to: v.string(), paymentMethod: v.union(v.literal('cash'), v.literal('card')), status: v.string(), distance: v.optional(v.string()), driverId: v.optional(v.string()), _creationTime: v.number() })),
  handler: async (ctx, args) => {
    const ride = await ctx.db.get(args.rideId);
    if (!ride) return null;
    return { _id: ride._id, from: ride.from, to: ride.to, paymentMethod: ride.paymentMethod, status: ride.status, distance: ride.distance, driverId: ride.driverId, _creationTime: ride._creationTime };
  }
});
