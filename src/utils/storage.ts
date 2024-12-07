import type { IdentificationHistory } from '../types';

export const saveToHistory = (data: IdentificationHistory) => {
  const history = getHistory();
  history.unshift(data);
  localStorage.setItem('plantHistory', JSON.stringify(history.slice(0, 10)));
};

export const getHistory = (): IdentificationHistory[] => {
  const history = localStorage.getItem('plantHistory');
  return history ? JSON.parse(history) : [];
};