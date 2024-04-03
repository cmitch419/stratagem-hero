export function formatSeconds(seconds) {
    // Calculate the number of minutes and seconds.
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
  
    // Format the minutes and seconds.
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secondsRemaining.toString().padStart(2, '0');
  
    // Return the formatted time string.
    return `${formattedMinutes}:${formattedSeconds}`;
  }

export function sortObjArray(array,attr) {
  if (array && attr && !array.some(obj=>!obj[attr])) {
    return array.sort((a, b) => (a[attr] < b[attr]) ? -1 : (a[attr] > b[attr]) ? 1 : 0)
  } else {
    return array;
  }
}