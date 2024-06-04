export const objectValuesToString = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce((newObj, key) => {
    const value = obj[key];
    if (value === undefined) {
      return newObj;
    }
    newObj[key] = String(value);
    return newObj;
  }, {} as Record<string, string>);
};
