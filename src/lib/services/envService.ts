const devMode = () => {
  return process.env.NODE_ENV === "development";
};

export { devMode };
