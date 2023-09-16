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
export const isImage = (url: string) => {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url);
};

export const isUrlAllowed = (url: string) => {
  // Define an array of allowed URL patterns
  const allowedPatterns = [
    {
      protocol: "https",
      pathname: "/**",
      hostname: "example.com",
      port: "",
    },
    {
      protocol: "https",
      pathname: "/**",
      hostname: "cdn.jsdelivr.net",
      port: "",
    },
  ];
  // Check if the URL matches any of the allowed patterns
  return allowedPatterns.some((pattern) => {
    const patternUrl = `${pattern.protocol}://${pattern.hostname}${pattern.pathname}`;
    const patternRegExp = new RegExp(`^${patternUrl.replace(/\*/g, ".*")}$`);
    return patternRegExp.test(url);
  });
};
export const checkImageAndAllowed = (url: string) => {
  if (isImage(url) && isUrlAllowed(url)) {
    return true;
  } else {
    return false;
  }
};
