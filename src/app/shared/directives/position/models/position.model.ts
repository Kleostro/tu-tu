import POSITION_DIRECTION from '../constants/position.constants';

type ModalPositionType = (typeof POSITION_DIRECTION)[keyof typeof POSITION_DIRECTION];

export default ModalPositionType;
