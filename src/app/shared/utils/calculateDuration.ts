export const calculateDuration = (startDate: Date | undefined, endDate: Date | undefined): string => {
  if (!startDate || !endDate) {
    return '';
  }

  const durationMs = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  // return minutes ? `${hours}h\u00A0${minutes}min` : `${hours}h`;

  return `${hours}h\u00A0${minutes}min`;
};
