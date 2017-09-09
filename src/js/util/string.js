export function objectEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function difference (array1, array2) {
  return array1.filter((elem) => {
    return (array2.indexOf(elem) === -1);
  });
}
