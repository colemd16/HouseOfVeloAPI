import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { playersApi } from '../api/players';
import { Handedness } from '../types/enums';
import type { PlayerResponse, CreatePlayerRequest, UpdatePlayerRequest } from '../types';

const positions = [
  'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Shortstop',
  'Third Base', 'Left Field', 'Center Field', 'Right Field', 'Utility'
];

interface PlayerFormData {
  name: string;
  age: number | '';
  position: string;
  sport: string;
  bats: Handedness | '';
  throwingHand: Handedness | '';
}

const emptyForm: PlayerFormData = {
  name: '',
  age: '',
  position: '',
  sport: 'BASEBALL',
  bats: '',
  throwingHand: '',
};

export function Players() {
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingPlayer, setEditingPlayer] = useState<PlayerResponse | null>(null);
  const [formData, setFormData] = useState<PlayerFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<PlayerResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const data = await playersApi.getMyPlayers();
      setPlayers(data);
      setError('');
    } catch (err) {
      setError('Failed to load players');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingPlayer(null);
    setModalMode('add');
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (player: PlayerResponse) => {
    setFormData({
      name: player.name,
      age: player.age || '',
      position: player.position || '',
      sport: player.sport || 'BASEBALL',
      bats: player.bats || '',
      throwingHand: player.throwingHand || '',
    });
    setEditingPlayer(player);
    setModalMode('edit');
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlayer(null);
    setFormData(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Player name is required');
      return;
    }

    setIsSaving(true);

    try {
      if (modalMode === 'add') {
        const request: CreatePlayerRequest = {
          name: formData.name.trim(),
          age: formData.age ? Number(formData.age) : undefined,
          position: formData.position || undefined,
          sport: formData.sport || undefined,
          bats: formData.bats || undefined,
          throwingHand: formData.throwingHand || undefined,
        };
        const newPlayer = await playersApi.create(request);
        setPlayers([...players, newPlayer]);
      } else if (editingPlayer) {
        const request: UpdatePlayerRequest = {
          name: formData.name.trim(),
          age: formData.age ? Number(formData.age) : undefined,
          position: formData.position || undefined,
          sport: formData.sport || undefined,
          bats: formData.bats || undefined,
          throwingHand: formData.throwingHand || undefined,
        };
        const updated = await playersApi.update(editingPlayer.id, request);
        setPlayers(players.map((p) => (p.id === updated.id ? updated : p)));
      }
      closeModal();
    } catch (err) {
      setFormError('Failed to save player. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (player: PlayerResponse) => {
    setPlayerToDelete(player);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!playerToDelete) return;

    setIsDeleting(true);
    try {
      await playersApi.delete(playerToDelete.id);
      setPlayers(players.filter((p) => p.id !== playerToDelete.id));
      setShowDeleteConfirm(false);
      setPlayerToDelete(null);
    } catch (err) {
      console.error('Failed to delete player:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-velo-black">Players</h1>
          <p className="text-gray-500">Manage your players</p>
        </div>
        <Button variant="secondary" onClick={openAddModal}>
          + Add Player
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-velo-red px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Players List */}
      {players.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-velo-black mb-2">No players yet</h3>
              <p className="text-gray-500 mb-4">Add your first player to get started</p>
              <Button variant="secondary" onClick={openAddModal}>
                Add Your First Player
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <Card key={player.id}>
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                      <span className="text-gold font-bold text-lg">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-velo-black">{player.name}</h3>
                      <p className="text-sm text-gray-500">
                        {player.position || 'No position'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(player)}
                      className="p-2 text-gray-400 hover:text-gold transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => confirmDelete(player)}
                      className="p-2 text-gray-400 hover:text-velo-red transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {player.age && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age</span>
                      <span className="text-velo-black">{player.age}</span>
                    </div>
                  )}
                  {player.bats && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bats</span>
                      <span className="text-velo-black">
                        {player.bats === 'L' ? 'Left' : player.bats === 'R' ? 'Right' : 'Switch'}
                      </span>
                    </div>
                  )}
                  {player.throwingHand && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Throws</span>
                      <span className="text-velo-black">
                        {player.throwingHand === 'L' ? 'Left' : 'Right'}
                      </span>
                    </div>
                  )}
                  {player.sport && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sport</span>
                      <span className="text-velo-black capitalize">{player.sport.toLowerCase()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-velo-black">
                  {modalMode === 'add' ? 'Add Player' : 'Edit Player'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-velo-red px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <Input
                label="Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Player's full name"
                required
              />

              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : '' })}
                placeholder="Age"
                min={5}
                max={99}
              />

              <div>
                <label className="block mb-2 font-semibold text-velo-gray">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select position</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-velo-gray">Sport</label>
                <select
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="BASEBALL">Baseball</option>
                  <option value="SOFTBALL">Softball</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-velo-gray">Bats</label>
                  <select
                    value={formData.bats}
                    onChange={(e) => setFormData({ ...formData, bats: e.target.value as Handedness | '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select</option>
                    <option value="L">Left</option>
                    <option value="R">Right</option>
                    <option value="S">Switch</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-velo-gray">Throws</label>
                  <select
                    value={formData.throwingHand}
                    onChange={(e) => setFormData({ ...formData, throwingHand: e.target.value as Handedness | '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select</option>
                    <option value="L">Left</option>
                    <option value="R">Right</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  className="flex-1"
                  isLoading={isSaving}
                >
                  {modalMode === 'add' ? 'Add Player' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && playerToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-velo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-velo-black mb-2">Delete Player</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete <strong>{playerToDelete.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setPlayerToDelete(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
