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