import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';

const TEMPLATES = [
  {
    title: "What will {name} order at {place}?",
    outcomes: [
      { label: 'Burger', emoji: '🍔' },
      { label: 'Chicken', emoji: '🍗' },
      { label: 'Salad', emoji: '🥗' },
      { label: 'Pizza', emoji: '🍕' },
    ],
  },
  {
    title: "Will {name} be late to {event}?",
    outcomes: [
      { label: 'On time', emoji: '⏰' },
      { label: '5-15 min late', emoji: '😅' },
      { label: '15-30 min late', emoji: '😬' },
      { label: '30+ min late', emoji: '💀' },
      { label: 'No show', emoji: '👻' },
    ],
  },
  {
    title: "What will {name} do this weekend?",
    outcomes: [
      { label: 'Stay in', emoji: '🏠' },
      { label: 'Go out', emoji: '🎉' },
      { label: 'Work', emoji: '💻' },
      { label: 'Adventure', emoji: '🏔️' },
    ],
  },
];

export default function CreateMarket() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [outcomes, setOutcomes] = useState([
    { label: '', emoji: '🔵' },
    { label: '', emoji: '🔴' },
  ]);

  function addOutcome() {
    const emojis = ['🟡', '🟢', '🟣', '🟤', '⚪', '🔶'];
    setOutcomes([
      ...outcomes,
      { label: '', emoji: emojis[outcomes.length % emojis.length] },
    ]);
  }

  function removeOutcome(idx) {
    if (outcomes.length <= 2) return;
    setOutcomes(outcomes.filter((_, i) => i !== idx));
  }

  function updateOutcome(idx, field, value) {
    setOutcomes(outcomes.map((o, i) => (i === idx ? { ...o, [field]: value } : o)));
  }

  function applyTemplate(template) {
    setTitle(template.title);
    setOutcomes(template.outcomes.map((o) => ({ ...o })));
  }

  function handleCreate() {
    const validOutcomes = outcomes.filter((o) => o.label.trim());
    if (!title.trim() || validOutcomes.length < 2) return;

    const prob = 1 / validOutcomes.length;
    dispatch({
      type: 'CREATE_MARKET',
      payload: {
        title: title.trim(),
        description: description.trim(),
        createdBy: state.currentUser,
        outcomes: validOutcomes.map((o, i) => ({
          id: `outcome-${Date.now()}-${i}`,
          label: o.label.trim(),
          emoji: o.emoji,
          probability: prob,
        })),
      },
    });

    navigate('/');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-text-bright mb-2">Create a Market</h1>
      <p className="text-text-dim mb-6">
        Set up a prediction market for your friend group. What do you want to bet on?
      </p>

      <div className="mb-6">
        <p className="text-sm text-text-dim mb-2">Quick templates</p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => applyTemplate(t)}
              className="text-sm bg-surface-light border border-border px-3 py-2 rounded-xl text-text hover:border-primary hover:text-primary cursor-pointer transition-colors"
            >
              {t.title.replace('{name}', '...').replace('{place}', '...').replace('{event}', '...')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-text-dim block mb-1">Question</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What will Jonny order at McDonald's?"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-bright font-medium focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text-dim block mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some context..."
            rows={2}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text resize-none focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text-dim block mb-2">Outcomes</label>
          <div className="space-y-2">
            {outcomes.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={o.emoji}
                  onChange={(e) => updateOutcome(i, 'emoji', e.target.value)}
                  className="w-12 bg-surface border border-border rounded-lg px-2 py-2.5 text-center text-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={o.label}
                  onChange={(e) => updateOutcome(i, 'label', e.target.value)}
                  placeholder={`Outcome ${i + 1}`}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2.5 text-text-bright focus:outline-none focus:border-primary"
                />
                {outcomes.length > 2 && (
                  <button
                    onClick={() => removeOutcome(i)}
                    className="text-text-dim hover:text-no-red bg-transparent border-none cursor-pointer px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addOutcome}
            className="text-sm text-primary hover:text-primary-dark mt-2 bg-transparent border-none cursor-pointer"
          >
            + Add outcome
          </button>
        </div>

        <button
          onClick={handleCreate}
          disabled={!title.trim() || outcomes.filter((o) => o.label.trim()).length < 2}
          className="w-full py-3.5 rounded-xl font-bold text-lg text-white bg-primary hover:bg-primary-dark border-none cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4"
        >
          Create Market
        </button>
      </div>
    </div>
  );
}
