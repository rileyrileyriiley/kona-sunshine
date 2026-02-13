import { useStore } from '../store/store';

export default function Leaderboard() {
  const { state } = useStore();

  const leaderboard = state.friends
    .map((f) => {
      const userBets = state.bets.filter((b) => b.userId === f.id);
      const totalWagered = userBets.reduce((sum, b) => sum + b.amount, 0);

      let winnings = 0;
      userBets.forEach((bet) => {
        const market = state.markets.find((m) => m.id === bet.marketId);
        if (market?.status === 'resolved') {
          const won =
            (bet.side === 'yes' && bet.outcomeId === market.resolvedOutcome) ||
            (bet.side === 'no' && bet.outcomeId !== market.resolvedOutcome);
          if (won) {
            winnings += Math.round(bet.amount / bet.price) - bet.amount;
          } else {
            winnings -= bet.amount;
          }
        }
      });

      return {
        ...f,
        totalBets: userBets.length,
        totalWagered,
        winnings,
        roi: totalWagered > 0 ? (winnings / totalWagered) * 100 : 0,
      };
    })
    .sort((a, b) => b.balance - a.balance);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-text-bright mb-2">Leaderboard</h1>
      <p className="text-text-dim mb-8">Who's the best predictor in your friend group?</p>

      <div className="space-y-3">
        {leaderboard.map((friend, i) => (
          <div
            key={friend.id}
            className={`bg-surface rounded-2xl border p-5 flex items-center gap-4 transition-all ${
              i === 0 ? 'border-accent shadow-lg shadow-accent/10' : 'border-border'
            }`}
          >
            <div className="text-3xl w-10 text-center">
              {i < 3 ? medals[i] : <span className="text-text-dim text-lg font-bold">#{i + 1}</span>}
            </div>

            <div className="text-3xl">{friend.emoji}</div>

            <div className="flex-1">
              <p className="text-text-bright font-bold text-lg">{friend.name}</p>
              <p className="text-text-dim text-sm">
                {friend.totalBets} bet{friend.totalBets !== 1 ? 's' : ''} · ${friend.totalWagered.toLocaleString()} wagered
              </p>
            </div>

            <div className="text-right">
              <p className="text-accent font-extrabold text-xl">
                ${friend.balance.toLocaleString()}
              </p>
              {friend.winnings !== 0 && (
                <p
                  className={`text-sm font-medium ${
                    friend.winnings > 0 ? 'text-yes-green' : 'text-no-red'
                  }`}
                >
                  {friend.winnings > 0 ? '+' : ''}${friend.winnings.toLocaleString()} P&L
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🏆</p>
          <p className="text-text-dim">Add some friends and start betting!</p>
        </div>
      )}
    </div>
  );
}
