import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { LearningBlock as LearningBlockType } from '@/stores/learningStore';

interface LearningBlockProps {
  block: LearningBlockType;
  onUpdate: (id: string, updates: Partial<LearningBlockType>) => void;
  onDelete: (id: string) => void;
}

export function LearningBlockCard({ block, onUpdate, onDelete }: LearningBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(block.title);
  const [editDescription, setEditDescription] = useState(block.description);

  const handleSave = () => {
    onUpdate(block.id, {
      title: editTitle || 'Sem título',
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(block.title);
    setEditDescription(block.description);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <GlassCard className="p-5 space-y-3">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título do aprendizado"
              className="w-full bg-background text-lg font-semibold border border-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Descrição ou anotações..."
              className="w-full bg-background border border-border rounded px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="neon" onClick={handleSave} className="flex-1">
                <Check className="w-4 h-4" />
                Salvar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-primary">{block.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </button>
                <button
                  onClick={() => onDelete(block.id)}
                  className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{block.description}</p>
            <p className="text-xs text-muted-foreground/60 pt-2">
              {new Date(block.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </>
        )}
      </GlassCard>
    </motion.div>
  );
}
