export interface NotificationPayload {
  discord?: boolean;
  email?: boolean;
  message: string;
  metadata?: Record<string, any>; // Custom fields per provider
}

export interface NotificationProvider {
  send(payload: NotificationPayload): Promise<void>;
}
