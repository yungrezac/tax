import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type RideStatus = 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

type Ride = {
  id: string;
  from: string;
  to: string;
  paymentMethod: 'cash' | 'card';
  status: RideStatus;
  distance?: string;
  createdAt: number;
};

let inMemoryRides: Ride[] = [];

function seedMockRides() {
  if (inMemoryRides.length > 0) return;
  inMemoryRides = [
    {
      id: uuidv4(),
      from: 'Площадь Ленина',
      to: 'Парк Победы',
      paymentMethod: 'cash',
      status: 'requested',
      distance: '3.2 км',
      createdAt: Date.now() - 1000 * 60 * 5,
    },
    {
      id: uuidv4(),
      from: 'Автовокзал',
      to: 'Ул. Советская, 12',
      paymentMethod: 'cash',
      status: 'requested',
      distance: '1.1 км',
      createdAt: Date.now() - 1000 * 60 * 12,
    }
  ];
}

export default function useRides() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    seedMockRides();
    setRides([...inMemoryRides]);
  }, []);

  const createRide = async ({ from, to, paymentMethod = 'cash' }: { from: string; to: string; paymentMethod?: 'cash' | 'card' }) => {
    const newRide: Ride = {
      id: uuidv4(),
      from,
      to,
      paymentMethod,
      status: 'requested',
      distance: 'по городу',
      createdAt: Date.now(),
    };
    inMemoryRides = [newRide, ...inMemoryRides];
    setRides([...inMemoryRides]);
    return newRide;
  };

  const acceptRide = async (rideId: string) => {
    inMemoryRides = inMemoryRides.map(r => r.id === rideId ? { ...r, status: 'accepted' } : r);
    setRides([...inMemoryRides]);
    return inMemoryRides.find(r => r.id === rideId) || null;
  };

  const updateRideStatus = async (rideId: string, status: RideStatus) => {
    inMemoryRides = inMemoryRides.map(r => r.id === rideId ? { ...r, status } : r);
    setRides([...inMemoryRides]);
    return inMemoryRides.find(r => r.id === rideId) || null;
  };

  return { rides, createRide, acceptRide, updateRideStatus };
}
