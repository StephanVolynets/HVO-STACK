export const generateAvatarUrl = () => {
  return `https://robohash.org/${Math.floor(Math.random() * 10000) + 1}`;
};
