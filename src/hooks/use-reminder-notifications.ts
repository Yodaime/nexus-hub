import { useEffect, useRef } from 'react';
import { useReminderStore } from '@/stores/reminderStore';
import { requestNotificationPermission, sendNotification, areNotificationsEnabled } from '@/services/notificationService';

/**
 * Hook que gerencia notificações para lembretes
 * Verifica a cada minuto se há lembretes para serem notificados
 */
export function useReminderNotifications() {
  const { reminders } = useReminderStore();
  const notifiedRemindersRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Solicitar permissão ao montar o componente
    const initNotifications = async () => {
      if (!areNotificationsEnabled()) {
        await requestNotificationPermission();
      }
    };

    initNotifications();

    // Verificar lembretes a cada minuto
    const checkReminders = () => {
      const now = new Date();

      reminders.forEach((reminder) => {
        // Ignorar lembretes já concluídos ou que já foram notificados
        if (reminder.completed || notifiedRemindersRef.current.has(reminder.id)) {
          return;
        }

        const reminderTime = new Date(reminder.dateTime);

        // Verificar se o lembrete está próximo (dentro de 1 minuto)
        // ou já passou (até 5 minutos no passado, para pegar lembretes que passaram recentemente)
        const diffInSeconds = Math.floor((now.getTime() - reminderTime.getTime()) / 1000);
        const isTimeToNotify = diffInSeconds >= -60 && diffInSeconds <= 300;

        if (isTimeToNotify) {
          // Enviar notificação
          sendNotification({
            title: '🔔 Lembrete!',
            body: reminder.title,
            tag: `reminder-${reminder.id}`,
            requireInteraction: true,
          });

          // Marcar como notificado
          notifiedRemindersRef.current.add(reminder.id);
        }
      });
    };

    // Executar verificação imediatamente
    checkReminders();

    // Depois verificar a cada minuto
    intervalRef.current = setInterval(checkReminders, 60000); // A cada 60 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reminders]);

  // Resetar notificações quando lembretes mudam
  useEffect(() => {
    const notifiedIds = Array.from(notifiedRemindersRef.current);
    const currentIds = reminders.map(r => r.id);
    
    // Remover IDs que não existem mais (lembretes deletados)
    notifiedIds.forEach(id => {
      if (!currentIds.includes(id)) {
        notifiedRemindersRef.current.delete(id);
      }
    });
  }, [reminders]);
}
