const { formatTimestamp } = require("@utils/helper");

const TimeAgo = ({ timestamp }) => {
  return (
    <span className="font-satoshi text-xs text-gray-400 px-1 ">
      {formatTimestamp(timestamp)}
    </span>
  );
};

export default TimeAgo;
