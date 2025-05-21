export const getWeekdayName = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleDateString('pt-BR', { weekday: 'long' });
};

export const getWeekdayNameTitle = (date: Date | string): string => {
  const weekday = getWeekdayName(date);
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
};

export const formatTime = (timeString: string): string => {
  return timeString.split(':').slice(0, 2).join(':');
};