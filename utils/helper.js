import {
  parseISO,
  format,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInMinutes,
} from "date-fns";

// Utility function to format the timestamp
export const formatTimestamp = (timestamp) => {
  const date = parseISO(timestamp);
  const now = new Date();

  const minutesDifference = differenceInMinutes(now, date);
  const hoursDifference = differenceInHours(now, date);
  const daysDifference = differenceInDays(now, date);
  const weeksDifference = differenceInWeeks(now, date);
  const monthsDifference = differenceInMonths(now, date);

  if (minutesDifference < 60) {
    // Format as `7h` if within 24 hours
    return `${minutesDifference}m`;
  } else if (hoursDifference < 24) {
    // Format as `7h` if within 24 hours
    return `${hoursDifference}h`;
  } else if (daysDifference < 7) {
    // Format as `2d` if within a week
    return `${daysDifference}d`;
  } else if (weeksDifference < 4) {
    // Format as `2w` if within a month
    return `${weeksDifference}w`;
  } else if (monthsDifference < 12) {
    // Format as `Jun 15` if within the current year
    return format(date, "MMM d");
  } else {
    // Format as `Jun 15, 2023` if older than the current year
    return format(date, "MMM d, yyyy");
  }
};

export const isMoreThan7DaysAgo = (timestamp) => {
  const date = parseISO(timestamp); // Parse the ISO string to Date object
  const now = new Date(); // Get current date/time

  // Calculate the difference in days
  const daysDifference = differenceInDays(now, date);

  // Return true if the difference is greater than 7 days
  return daysDifference > 7;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
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

export const formatEmail = (email) => {
  const localPart = email.split("@")[0];
  const formatted = localPart.replace(/[\W\d]/g, "");

  return formatted;
};

export const convertToIndonesianMonthYear = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("id-ID", options);
  return formattedDate;
};

export const handleImageChange = async (
  event,
  func,
  fileInputRef,
  onImageChange
) => {
  const file = event.target.files[0];

  if (file && !file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    fileInputRef.current.value = null;
    return;
  }

  if (file) {
    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const croppedImage = await func(compressedFile, 1500, 500);

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(croppedImage);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  }
};
