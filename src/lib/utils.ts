export function removeHtmlTags(html?: string): string {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  const plainString = div.textContent || div.innerText;
  return plainString;
}

export function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
