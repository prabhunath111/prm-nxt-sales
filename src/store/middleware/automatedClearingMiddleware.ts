import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { ACTION_TYPE } from 'const';
import { clearStorage } from 'utils/sessionHelper';

const automatedClearingMiddleware: Middleware = () => (next) => (action: AnyAction) => {
  if (!action || typeof action.type === 'undefined') {
    // Invalid action — don't forward it
    return undefined;
  }

  if (action.type === ACTION_TYPE.USER_LOGOUT) {
    clearStorage();
  }

  return next(action);
};

export default automatedClearingMiddleware;
