const CustomTab = ({ tab, onClick, tabFor }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex justify-center   ${
        tab === tabFor ? "border-blue-500 border-b-4" : "text-gray-500"
      } items-center py-4  w-full`}
    >
      <span>{tabFor[0].toUpperCase() + tabFor.substring(1)}</span>
    </div>
  );
};

export default CustomTab;
