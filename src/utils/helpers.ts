export const compareStrings = (searchText: string, itemText: string): boolean => {
    if (searchText.length > itemText.length) return false;

    let i = 0;
    let j = 0;

    while (i < searchText.length && j < itemText.length) {
      if (searchText[i] === itemText[j]) {
        i++;
      }
      j++;
    }

    return i === searchText.length;
  };