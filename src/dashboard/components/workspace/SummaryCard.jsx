import PropTypes from "prop-types";

const SummaryCard = ({
  label,
  value,
  color = "default",
  isActive,
  onClick,
}) => {
  const colorClasses = {
    default: "bg-white border-gray-200 hover:border-purple-300",
    blue: "bg-blue-50 border-blue-200 hover:border-blue-400",
    yellow: "bg-yellow-50 border-yellow-200 hover:border-yellow-400",
    green: "bg-green-50 border-green-200 hover:border-green-400",
    red: "bg-red-50 border-red-200 hover:border-red-400",
    purple: "bg-purple-50 border-purple-200 hover:border-purple-400",
    orange: "bg-orange-50 border-orange-200 hover:border-orange-400",
  };

  const activeClass = isActive
    ? "ring-2 ring-purple-600 border-purple-600"
    : "";

  return (
    <button
      onClick={onClick}
      className={`${
        colorClasses[color] || colorClasses.default
      } ${activeClass} border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-md text-left cursor-pointer`}
    >
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </button>
  );
};

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SummaryCard;
