export const calculateDuration = (start: Date | string | undefined, end: Date | string | undefined): string => {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  if (!startDate || !endDate) {
    return '';
  }

  const durationMs = endDate.getTime() - startDate.getTime();
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  let durationString = '';
  if (days > 0) {
    durationString += `${days}d\u00A0`;
  }
  if (hours > 0) {
    durationString += `${hours}h\u00A0`;
  }
  if (minutes > 0) {
    durationString += `${minutes}min`;
  }

  return durationString.trim();
};
