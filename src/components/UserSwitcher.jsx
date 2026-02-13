import { useState } from 'react';
import { useStore } from '../store/store';

export default function UserSwitcher() {
  const { state, dispatch } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('');

  const emojis = ['😎', '🤠', '🧢', '🎮', '🏀', '🎸', '🍕', '🦊', '🐱', '🤓', '💀', '🔥'];

  function handleAdd() {
    if (!newName.trim()) return;
    dispatch({
      type: 'ADD_FRIEND',
      payload: { name: newName.trim(), emoji: newEmoji || '👤' },
    });
    setNewName('');
    setNewEmoji('');
    setShowAddForm(false);
  }

  return (
    <div className="bg-surface rounded-2xl border border-border p-4">
      <h3 className="text-text-bright font-bold text-sm mb-3">Playing as</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {state.friends.map((f) => (
          <button
            key={f.id}
            onClick={() => dispatch({ type: 'SET_USER', payload: f.id })}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
              state.currentUser === f.id
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-surface-light border-border text-text-dim hover:text-text'
            }`}
          >
            <span>{f.emoji}</span>
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="text-xs text-text-dim hover:text-primary cursor-pointer bg-transparent border-none"
        >
          + Add friend
        </button>
      ) : (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="flex gap-1 flex-wrap max-w-[120px]">
            {emojis.slice(0, 6).map((e) => (
              <button
                key={e}
                onClick={() => setNewEmoji(e)}
                className={`w-7 h-7 rounded text-sm cursor-pointer border ${
                  newEmoji === e ? 'border-primary bg-primary/20' : 'border-transparent bg-surface-light'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium border-none cursor-pointer hover:bg-primary-dark"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
