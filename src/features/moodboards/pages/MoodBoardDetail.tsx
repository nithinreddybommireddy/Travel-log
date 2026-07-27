import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Star, Plus, X, Trash2, Lock, Globe, Edit3, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tours } from "@/features/tours/data/tours";
import { useAuth } from "@/features/auth/services/auth-context";
import { useMoodBoards } from "@/services/storageService";

export function MoodBoardDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getBoard, getBoardTours, addTourToBoard, removeTourFromBoard, updateBoard } = useMoodBoards(user?.id);

  const board = id ? getBoard(id) : undefined;
  const boardTours = id ? getBoardTours(id) : [];

  const [addingTour, setAddingTour] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [tourSearch, setTourSearch] = useState("");

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Board not found</h1>
          <Link to="/mood-boards"><Button variant="outline" className="gap-2 mt-4"><ArrowLeft className="w-4 h-4" /> Back to Boards</Button></Link>
        </div>
      </div>
    );
  }

  const boardTourData = boardTours
    .map((bt) => ({ ...bt, tour: tours.find((t) => t.id === bt.tourId) }))
    .filter((bt): bt is typeof bt & { tour: NonNullable<typeof bt.tour> } => bt.tour !== undefined);

  const availableTours = tours.filter((t) => !boardTours.some((bt) => bt.tourId === t.id));

  const handleAddTour = (tourId: string) => {
    addTourToBoard(board.id, tourId);
  };

  const handleRemoveTour = (tourId: string) => {
    removeTourFromBoard(board.id, tourId);
  };

  const handleRename = () => {
    if (newName.trim() && newName !== board.name) {
      updateBoard(board.id, { name: newName.trim() });
    }
    setEditingName(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/mood-boards" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Boards
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              {editingName ? (
                <div className="flex items-center gap-2 mb-2">
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRename} onKeyDown={(e) => e.key === "Enter" && handleRename()}
                    className="text-3xl font-bold h-auto py-1" autoFocus />
                  <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: board.coverColor }} />
                  <h1 className="text-4xl font-bold">{board.name}</h1>
                  <button onClick={() => { setNewName(board.name); setEditingName(true); }}
                    className="text-text-muted hover:text-text-primary transition-colors"><Edit3 className="w-4 h-4" /></button>
                </div>
              )}
              {board.description && <p className="text-text-secondary">{board.description}</p>}
              <Badge variant="outline" className="mt-2 gap-1">
                {board.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {board.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            <Button onClick={() => setAddingTour(!addingTour)} className="gap-2 shrink-0"><Plus className="w-4 h-4" /> Add Tours</Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {addingTour && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6">
              <div className="bg-surface-light/30 rounded-xl border border-border-light p-4">
                <Input placeholder="Search tours to add..." value={tourSearch} onChange={(e) => setTourSearch(e.target.value)} className="mb-3" />
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {availableTours.filter((t) => t.name.toLowerCase().includes(tourSearch.toLowerCase())).map((tour) => (
                    <button key={tour.id} onClick={() => handleAddTour(tour.id)} className="flex-shrink-0 w-40 group">
                      <div className="relative h-24 rounded-lg overflow-hidden border border-border-light group-hover:border-accent/30 transition-all">
                        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-1 left-2 text-white text-xs font-semibold">{tour.name}</div>
                        <div className="absolute top-1 right-1 p-1 rounded-full bg-accent/80 text-white"><Plus className="w-3 h-3" /></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {boardTourData.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-surface-light/20 rounded-2xl border border-border-light border-dashed">
            <MessageSquare className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">This board is empty</h2>
            <p className="text-text-secondary mb-6">Start adding your favorite destinations!</p>
            <Button onClick={() => setAddingTour(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Tours</Button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boardTourData.map((item, i) => (
              <motion.div key={item.tourId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="group">
                <div className="relative bg-surface-light/20 rounded-xl border border-border-light overflow-hidden hover:border-accent/30 transition-all duration-300">
                  <Link to={`/tours/${item.tourId}`}>
                    <div className="relative h-40 overflow-hidden">
                      <img src={item.tour.image} alt={item.tour.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3"><span className="text-lg font-bold text-accent">₹{item.tour.price.toLocaleString()}</span></div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/tours/${item.tourId}`}><h3 className="font-bold group-hover:text-accent transition-colors">{item.tour.name}</h3></Link>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                      <MapPin className="w-3 h-3" /> {item.tour.location}
                      <span className="flex items-center gap-1 ml-auto"><Star className="w-3 h-3 text-accent fill-accent" /> {item.tour.rating}</span>
                    </div>
                    {item.note && <p className="text-xs text-text-secondary mt-2 italic bg-surface-lighter/30 rounded-lg px-3 py-2">&ldquo;{item.note}&rdquo;</p>}
                  </div>
                  <button onClick={() => handleRemoveTour(item.tourId)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/70 hover:text-error transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
