/**
 * Serviço de notificações do navegador
 */

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Solicita permissão para enviar notificações
 */
export async function requestNotificationPermission(): Promise<boolean> {
  // Verificar se o navegador suporta notificações
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações');
    return false;
  }

  // Se já tem permissão concedida
  if (Notification.permission === 'granted') {
    return true;
  }

  // Se foi negado antes
  if (Notification.permission === 'denied') {
    console.log('Permissão de notificações foi negada');
    return false;
  }

  // Pedir permissão
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
    return false;
  }
}

/**
 * Envia uma notificação
 */
export function sendNotification(options: NotificationOptions): Notification | null {
  // Verificar permissão
  if (!('Notification' in window)) {
    console.log('Notificações não são suportadas neste navegador');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.log('Permissão de notificação não foi concedida');
    return null;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/notification-icon.png',
      tag: options.tag, // Prevents duplicate notifications
      requireInteraction: options.requireInteraction ?? false,
    });

    // Auto-fechar após 5 segundos se não tiver requireInteraction
    if (!options.requireInteraction) {
      setTimeout(() => notification.close(), 5000);
    }

    return notification;
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return null;
  }
}

/**
 * Verifica se as notificações estão habilitadas
 */
export function areNotificationsEnabled(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}
