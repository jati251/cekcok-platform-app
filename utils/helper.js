import {
  parseISO,
  format,
  differenceInHours,
  differenceInDays,
} from "date-fns";

// Utility function to format the timestamp
export const formatTimestamp = (timestamp) => {
  const date = parseISO(timestamp);
  const now = new Date();

  const hoursDifference = differenceInHours(now, date);
  const daysDifference = differenceInDays(now, date);

  if (hoursDifference < 24) {
    // Format as `7h` if within 24 hours
    return `${hoursDifference}h`;
  } else if (daysDifference < 365) {
    // Format as `Jun 15` if within the current year
    return format(date, "MMM d");
  } else {
    // Format as `Jun 15, 2023` if older than the current year
    return format(date, "MMM d, yyyy");
  }
};

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const convertToIndonesianMonthYear = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("id-ID", options);
  return formattedDate;
};
