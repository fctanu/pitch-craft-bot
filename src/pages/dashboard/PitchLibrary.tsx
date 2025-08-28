import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, FolderOpen, X, Save } from "lucide-react";
import { usePitches } from "@/context/PitchContext";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const PitchLibrary = () => {
  const { pitches, deletePitch, updatePitch } = usePitches();
  const [openId, setOpenId] = useState<string | null>(null);
  const current = pitches.find((p) => p.id === openId) || null;
  const [editOne, setEditOne] = useState("");
  const [editStructure, setEditStructure] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const openPitch = (id: string) => {
    const p = pitches.find((pp) => pp.id === id);
    if (!p) return;
    setEditOne(p.oneLiner);
    setEditStructure(p.structure.join("\n"));
    setIsEditing(false);
    setOpenId(id);
  };

  const saveEdits = () => {
    if (!openId) return;
    updatePitch(openId, {
      oneLiner: editOne.trim(),
      structure: editStructure
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-5xl py-14 px-6">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Your Pitch Library
          </h1>
          <p className="text-muted-foreground text-sm">
            All previously generated one-liners & deck structures will appear
            here.
          </p>
        </div>
        <Button asChild variant="hero" size="sm">
          <Link to="/dashboard/create">Create New</Link>
        </Button>
      </div>
      {pitches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <FolderOpen className="w-12 h-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No pitches yet. Generate your first one!
          </p>
          <Button asChild variant="hero" size="sm">
            <Link to="/dashboard/create">Create Pitch</Link>
          </Button>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {pitches.map((p) => (
          <Card
            key={p.id}
            className="relative overflow-hidden bg-card/60 backdrop-blur-sm cursor-pointer transition hover:border-primary/40"
            onClick={() => openPitch(p.id)}
          >
            <CardHeader>
              <CardTitle className="text-base font-semibold leading-snug line-clamp-4">
                {p.oneLiner}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{new Date(p.createdAt).toLocaleString()}</span>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  aria-label="Edit pitch"
                  onClick={() => openPitch(p.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      aria-label="Delete pitch"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-destructive/40">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this pitch?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The pitch and its
                        transcript will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => deletePitch(p.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pitch Details</DialogTitle>
          </DialogHeader>
          {current && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                  One-liner
                </label>
                {isEditing ? (
                  <Textarea
                    value={editOne}
                    onChange={(e) => setEditOne(e.target.value)}
                    className="resize-vertical min-h-[80px]"
                  />
                ) : (
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {current.oneLiner}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Pitch Structure
                </label>
                {isEditing ? (
                  <Textarea
                    value={editStructure}
                    onChange={(e) => setEditStructure(e.target.value)}
                    className="resize-vertical min-h-[200px] font-mono text-xs"
                  />
                ) : (
                  <ol className="list-decimal pl-5 space-y-1 text-xs marker:text-primary">
                    {current.structure.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Transcript
                </label>
                <Textarea
                  disabled
                  value={current.transcript}
                  className="resize-vertical min-h-[140px] text-xs"
                />
              </div>
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="text-[11px] text-muted-foreground">
                  Created {new Date(current.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        variant="hero"
                        className="gap-1"
                        onClick={saveEdits}
                      >
                        <Save className="w-4 h-4" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          openPitch(current.id);
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-destructive/40">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove this saved pitch.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => {
                                deletePitch(current.id);
                                setOpenId(null);
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setOpenId(null)}
                        className="gap-1"
                      >
                        <X className="w-4 h-4" /> Close
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PitchLibrary;
