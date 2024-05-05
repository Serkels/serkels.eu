//

export function no_urls(text: string) {
  return text.replace(/\S+/gimu, replacer);
}

//

function replacer(match: string) {
  if (isURL(match)) {
    return "[unsafe-url]";
  } else {
    return match;
  }
}

function isURL(text: string): boolean {
  return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(text);
}
