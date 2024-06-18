const { formatTimestamp } = require("@utils/helper");

const TimeAgo = ({ timestamp }) => {
  return (
    <span className="font-satoshi text-sm text-gray-400">
      {formatTimestamp(timestamp)}
    </span>
  );
};

export default TimeAgo;
