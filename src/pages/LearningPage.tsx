import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { LearningBlockCard } from '@/components/learning/LearningBlockCard';
import { useLearningStore } from '@/stores/learningStore';

export default function LearningPage() {
  const { blocks, addBlock, updateBlock, deleteBlock } = useLearningStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddBlock = () => {
    if (newTitle.trim()) {
      addBlock({
        title: newTitle,
        description: newDescription,
      });
      setNewTitle('');
      setNewDescription('');
      setIsAddingNew(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold neon-text-primary">Aprendizado</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Coloque aqui suas anotações e registros de aprendizados para lembrar
            </p>
          </div>
          <Button
            variant="neon"
            onClick={() => setIsAddingNew(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Novo Aprendizado
          </Button>
        </div>

        {/* Add New Block Form */}
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card p-5 rounded-lg border border-border space-y-3"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título do aprendizado"
              autoFocus
              className="w-full bg-background text-lg font-semibold border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Descrição ou anotações..."
              className="w-full bg-background border border-border rounded px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-2 pt-2">
              <Button variant="neon" onClick={handleAddBlock} className="flex-1">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewTitle('');
                  setNewDescription('');
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Learning Blocks Grid */}
        <AnimatePresence mode="popLayout">
          {blocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blocks.map((block) => (
                <LearningBlockCard
                  key={block.id}
                  block={block}
                  onUpdate={updateBlock}
                  onDelete={deleteBlock}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhum aprendizado registrado ainda
              </p>
              <Button
                variant="neon"
                onClick={() => setIsAddingNew(true)}
              >
                <Plus className="w-4 h-4" />
                Adicionar Primeiro Aprendizado
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
