import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Layout, Lock, Globe, X, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/services/auth-context";
import { useMoodBoards } from "@/services/storage-service";

const boardColors = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
  "#f97316", "#6366f1",
];

export function MoodBoardsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { boards, createBoard, deleteBoard } = useMoodBoards(user?.id);

  const [showCreate, setShowCreate] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDesc, setBoardDesc] = useState("");
  const [selectedColor, setSelectedColor] = useState(boardColors[0]);
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!boardName.trim()) return;
    setCreating(true);
    try {
      const id = createBoard(boardName.trim(), boardDesc.trim() || undefined, selectedColor, isPublic);
      setShowCreate(false);
      setBoardName("");
      setBoardDesc("");
      setSelectedColor(boardColors[0]);
      setIsPublic(false);
      navigate(`/mood-boards/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (boardId: string) => {
    setDeleting(boardId);
    try {
      deleteBoard(boardId);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link to="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
              <Badge variant="accent">Mood Boards</Badge>
            </div>
            <h1 className="text-4xl font-bold mt-2">Your <span className="text-gradient">Inspiration</span> Boards</h1>
            <p className="text-text-secondary mt-1">Collect, organize, and plan your dream trips visually.</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2"><Plus className="w-4 h-4" /> New Board</Button>
        </motion.div>

        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowCreate(false)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-surface-light border border-border-light rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Create Mood Board</h2>
                  <button onClick={() => setShowCreate(false)} className="text-text-secondary hover:text-text-primary"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-secondary mb-1 block">Board Name</label>
                    <Input placeholder="e.g., Summer 2025 Dream Trip" value={boardName} onChange={(e) => setBoardName(e.target.value)} autoFocus />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary mb-1 block">Description (optional)</label>
                    <Input placeholder="What's this board about?" value={boardDesc} onChange={(e) => setBoardDesc(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Cover Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {boardColors.map((color) => (
                        <button key={color} onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-lg transition-all duration-200 ${selectedColor === color ? "ring-2 ring-white scale-110" : "hover:scale-110"}`}
                          style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPublic(!isPublic)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                        isPublic ? "border-accent/30 bg-accent/10 text-accent" : "border-border-light text-text-secondary hover:border-accent/20"
                      }`}>
                      {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {isPublic ? "Public" : "Private"}
                    </button>
                  </div>
                  <Button onClick={handleCreate} disabled={!boardName.trim() || creating} className="w-full gap-2">
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create Board
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {boards.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {boards.map((board, i) => (
              <motion.div key={board.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group relative">
                <Link to={`/mood-boards/${board.id}`}>
                  <div className="relative h-48 rounded-xl overflow-hidden border border-border-light hover:border-accent/30 transition-all duration-300">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: board.coverColor }}>
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
                      }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-lg">{board.name}</h3>
                      {board.description && <p className="text-white/70 text-sm truncate">{board.description}</p>}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-black/20 text-white border-white/20 text-xs">
                        {board.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                </Link>
                <button onClick={() => handleDelete(board.id)}
                  className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/40 text-white/70 hover:text-error hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100">
                  {deleting === board.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-surface-light/20 rounded-2xl border border-border-light border-dashed">
            <Layout className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No mood boards yet</h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Create a mood board to collect and organize your favorite destinations, add notes, and plan your dream trips visually.
            </p>
            <Button onClick={() => setShowCreate(true)} className="gap-2"><Plus className="w-4 h-4" /> Create Your First Board</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
