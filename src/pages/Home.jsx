import { useStore } from '../store/store';
import MarketCard from '../components/MarketCard';
import UserSwitcher from '../components/UserSwitcher';

export default function Home() {
  const { state } = useStore();

  const openMarkets = state.markets.filter((m) => m.status === 'open');
  const resolvedMarkets = state.markets.filter((m) => m.status === 'resolved');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-bright mb-2">
          Friend Prediction Markets
        </h1>
        <p className="text-text-dim">
          Bet on what your friends will actually do. Bragging rights included.
        </p>
      </div>

      <div className="mb-6">
        <UserSwitcher />
      </div>

      {openMarkets.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-text-bright mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Live Markets
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {openMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </section>
      )}

      {resolvedMarkets.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-text-bright mb-4">
            Resolved
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {resolvedMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </section>
      )}

      {state.markets.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🎲</p>
          <p className="text-text-dim">No markets yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
