export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getMinutes = (seconds: number): number => Math.round(seconds / 60);

export const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);
