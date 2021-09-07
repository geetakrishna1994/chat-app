const apiMiddleware =
  () =>
  ({ dispatch, getState }) => {
    return (next) => (action) => {
      return next(action);
    };
  };

export default apiMiddleware;
