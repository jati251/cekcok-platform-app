const { formatTimestamp } = require("@utils/helper");

const TimeAgo = ({ timestamp }) => {
  return (
    <span className="font-satoshi text-sm">{formatTimestamp(timestamp)}</span>
  );
};

export default TimeAgo;
