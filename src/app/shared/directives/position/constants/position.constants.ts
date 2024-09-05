const POSITION_DIRECTION = {
  RIGHT_TOP: 'right-top',
  LEFT_TOP: 'left-top',
  RIGHT_BOTTOM: 'right-bottom',
  LEFT_BOTTOM: 'left-bottom',
  CENTER: 'center',
  CENTER_TOP: 'center-top',
  CENTER_BOTTOM: 'center-bottom',
  CENTER_RIGHT: 'center-right',
  CENTER_LEFT: 'center-left',
} as const;

export const POSITION_OFFSETS = {
  'right-top': 'top: 1rem; right: 1rem;',
  'left-top': 'top: 1rem; left: 1rem;',
  'right-bottom': 'bottom: 1rem; right: 1rem;',
  'left-bottom': 'bottom: 1rem; left: 1rem;',
  'center-top': 'top: 1rem; left: 50%; transform: translate(-50%, 0);',
  'center-bottom': 'bottom: 1rem; left: 50%; transform: translate(-50%, 0);',
  'center-right': 'top: 50%; right: 1rem; transform: translate(0, -50%);',
  'center-left': 'top: 50%; left: 1rem; transform: translate(0, -50%);',
  center: 'top: 50%; left: 50%; transform: translate(-50%, -50%);',
};
export default POSITION_DIRECTION;
