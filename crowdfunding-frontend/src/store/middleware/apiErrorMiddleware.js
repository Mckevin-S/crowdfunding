const apiErrorMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    console.error('API Error:', action.error);
    store.dispatch({ type: 'ui/setError', payload: action.error.message });
  }
  return next(action);
};

export default apiErrorMiddleware;