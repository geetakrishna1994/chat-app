export const getTimeString = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const today = now.toDateString();
  if (date.toDateString() === now.toDateString())
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  else if (Date.parse(date) > Date.parse(today) - 24 * 60 * 60 * 1000) {
    return "Yesterday";
  } else if (Date.parse(date) > Date.parse(today) - 7 * 24 * 60 * 60 * 1000) {
    return new Intl.DateTimeFormat([], { weekday: "long" }).format(date);
  } else {
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }
};
