export function sortByDateKey(arr, key) {
  return arr.sort((a, b) => new Date(a[key]) - new Date(b[key]));
}

/**
 * addCommas
 * @via Thanks ChatGPT
 */

export function addCommas(num) {
  // Convert the number to a string
  num = num.toString();

  // Split the string into an array of digits
  var digits = num.split("");

  // Initialize a counter variable
  var counter = 0;

  // Iterate through the digits from right to left
  for (var i = digits.length - 1; i >= 0; i--) {
    // Increment the counter
    counter++;

    // If the counter is a multiple of 3 and we're not at the leftmost digit, add a comma
    if (counter % 3 === 0 && i !== 0) {
      digits.splice(i, 0, ",");
    }
  }

  // Join the array back into a string and return it
  return digits.join("");
}

/**
 * sortByKey
 * @description Sort the given array by the object key
 */

export function sortByKey(array = [], key, type = 'asc') {
  function compare(a, b) {
    let keyA = a[key];
    let keyB = b[key];

    if (typeof keyA === 'string') {
      keyA = keyA.toLowerCase();
    }

    if (typeof keyB === 'string') {
      keyB = keyB.toLowerCase();
    }

    if (keyA < keyB) {
      return -1;
    }

    if (keyA > keyB) {
      return 1;
    }

    return 0;
  }

  let newArray = [...array];

  if (typeof key !== 'string') return newArray;

  newArray = newArray.sort(compare);

  if (type === 'desc') {
    return newArray.reverse();
  }

  return newArray;
}