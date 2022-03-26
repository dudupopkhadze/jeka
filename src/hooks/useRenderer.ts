import { useReducer } from "react";

export const useRenderer = () => {
  const [, rerender] = useReducer((x) => x + 1, 0);
  return rerender;
};
