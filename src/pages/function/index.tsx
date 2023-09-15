import { type ChangeHandler } from "types";

export const addItem = (arr: string[], index: number) => {
  const newArr = [...arr];
  if (index === -1 || index >= newArr.length) {
    newArr.unshift("");
  } else {
    // Otherwise, insert the new item at the specified index
    newArr.splice(index, 0, "");
  }

  return newArr;
};
export const deleteItem = (arr: string[], index: number) => {
  const newArr = [...arr];
  newArr.splice(index, 1);
  return newArr;
};
