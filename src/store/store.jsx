import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const StoreContext = createContext();

const STORAGE_KEY = 'friendcast_state';

const DEFAULT_FRIENDS = [
  { id: 'jonny', name: 'Jonny', emoji: '🍔', balance: 1000 },
  { id: 'you', name: 'You', emoji: '😎', balance: 1000 },
];

const INITIAL_MARKET = {
  id: 'jonny-mcdonalds-1',
  title: "What will Jonny order at McDonald's?",
  description: "Jonny says he's going to McDonald's tonight. Place your bets on what he'll actually order. Will he go healthy? (lol) Or full send on a Big Mac combo?",
  createdBy: 'you',
  status: 'open', // open | resolved
  resolvedOutcome: null,
  createdAt: new Date().toISOString(),
  outcomes: [
    { id: 'big-mac', label: 'Big Mac', emoji: '🍔', probability: 0.35 },
    { id: 'nuggets', label: '10pc McNuggets', emoji: '🐔', probability: 0.25 },
    { id: 'quarter-pounder', label: 'Quarter Pounder', emoji: '🥩', probability: 0.15 },
    { id: 'filet-o-fish', label: 'Filet-O-Fish', emoji: '🐟', probability: 0.05 },
    { id: 'mcchicken', label: 'McChicken', emoji: '🐓', probability: 0.10 },
    { id: 'salad', label: 'A Salad (yeah right)', emoji: '🥗', probability: 0.02 },
    { id: 'breakfast', label: 'Breakfast Item', emoji: '🥞', probability: 0.08 },
  ],
};

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }

  return {
    currentUser: 'you',
    friends: DEFAULT_FRIENDS,
    markets: [INITIAL_MARKET],
    bets: [],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FRIEND': {
      const newFriend = {
        id: uuidv4(),
        name: action.payload.name,
        emoji: action.payload.emoji || '👤',
        balance: 1000,
      };
      return { ...state, friends: [...state.friends, newFriend] };
    }

    case 'SET_USER': {
      return { ...state, currentUser: action.payload };
    }

    case 'CREATE_MARKET': {
      const market = {
        id: uuidv4(),
        ...action.payload,
        status: 'open',
        resolvedOutcome: null,
        createdAt: new Date().toISOString(),
      };
      return { ...state, markets: [...state.markets, market] };
    }

    case 'PLACE_BET': {
      const { marketId, outcomeId, amount, userId, side } = action.payload;
      const market = state.markets.find((m) => m.id === marketId);
      if (!market || market.status !== 'open') return state;

      const friend = state.friends.find((f) => f.id === userId);
      if (!friend || friend.balance < amount) return state;

      const bet = {
        id: uuidv4(),
        marketId,
        outcomeId,
        amount,
        userId,
        side, // 'yes' or 'no'
        price: side === 'yes'
          ? market.outcomes.find((o) => o.id === outcomeId).probability
          : 1 - market.outcomes.find((o) => o.id === outcomeId).probability,
        timestamp: new Date().toISOString(),
      };

      // Update balance
      const updatedFriends = state.friends.map((f) =>
        f.id === userId ? { ...f, balance: f.balance - amount } : f
      );

      // Shift probability based on bet
      const shift = (amount / 500) * 0.03 * (side === 'yes' ? 1 : -1);
      const updatedMarkets = state.markets.map((m) => {
        if (m.id !== marketId) return m;
        const outcomes = m.outcomes.map((o) => {
          if (o.id === outcomeId) {
            return { ...o, probability: Math.min(0.98, Math.max(0.01, o.probability + shift)) };
          }
          return o;
        });
        // Normalize
        const total = outcomes.reduce((s, o) => s + o.probability, 0);
        return {
          ...m,
          outcomes: outcomes.map((o) => ({
            ...o,
            probability: o.probability / total,
          })),
        };
      });

      return {
        ...state,
        friends: updatedFriends,
        markets: updatedMarkets,
        bets: [...state.bets, bet],
      };
    }

    case 'RESOLVE_MARKET': {
      const { marketId, outcomeId } = action.payload;

      const updatedMarkets = state.markets.map((m) =>
        m.id === marketId ? { ...m, status: 'resolved', resolvedOutcome: outcomeId } : m
      );

      // Pay out winners
      const marketBets = state.bets.filter((b) => b.marketId === marketId);
      const payouts = {};

      marketBets.forEach((bet) => {
        const won =
          (bet.side === 'yes' && bet.outcomeId === outcomeId) ||
          (bet.side === 'no' && bet.outcomeId !== outcomeId);

        if (won) {
          const payout = Math.round(bet.amount / bet.price);
          payouts[bet.userId] = (payouts[bet.userId] || 0) + payout;
        }
      });

      const updatedFriends = state.friends.map((f) => ({
        ...f,
        balance: f.balance + (payouts[f.id] || 0),
      }));

      return { ...state, markets: updatedMarkets, friends: updatedFriends };
    }

    case 'RESET': {
      localStorage.removeItem(STORAGE_KEY);
      return {
        currentUser: 'you',
        friends: DEFAULT_FRIENDS,
        markets: [INITIAL_MARKET],
        bets: [],
      };
    }

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
