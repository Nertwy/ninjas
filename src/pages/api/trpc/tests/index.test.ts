import { addItem, deleteItem, isImage } from "../../../../function/index";

describe("addItem", () => {
  it("should add an item to the array at the specified index", () => {
    const array = ["item1", "item2", "item3"];
    const indexToAdd = 1; // Index where the item will be added
    const newArray = addItem(array, indexToAdd);

    // Assert that the newArray contains the  at the specified index
    expect(newArray).toEqual(["item1", "", "item2", "item3"]);
  });

  it("should add an item to the beginning of the array if the index is -1", () => {
    const array = ["item1", "item2", "item3"];
    const indexToAdd = -1; // Add to the beginning of the array

    const newArray = addItem(array, indexToAdd);

    // Assert that the newArray contains the  at the beginning
    expect(newArray).toEqual(["", "item1", "item2", "item3"]);
  });
});

describe("deleteItem", () => {
  it("should delete an item from the array at the specified index", () => {
    const array = ["item1", "item2", "item3"];
    const indexToDelete = 1; // Index of the item to delete

    const newArray = deleteItem(array, indexToDelete);

    // Assert that the newArray doesn't contain the item at the specified index
    expect(newArray).toEqual(["item1", "item3"]);
  });

  it("should return the same array if the index is out of bounds", () => {
    const array = ["item1", "item2", "item3"];
    const indexToDelete = 3; // Index out of bounds

    const newArray = deleteItem(array, indexToDelete);

    // Assert that the newArray is the same as the original array
    expect(newArray).toEqual(array);
  });
});

describe("Test isImage function", () => {
  it("should return true for a valid image URL", () => {
    const url = "https://example.com/image.jpg";
    const result = isImage(url);
    expect(result).toBe(true);
  });

  it("should return false for an invalid URL", () => {
    const url = "https://example.com/document.pdf";
    const result = isImage(url);
    expect(result).toBe(false);
  });
});
