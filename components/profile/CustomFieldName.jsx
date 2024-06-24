const { FieldNameSkeleton } = require("../Skeletons/FieldNameSkeleton");

export const CustomFieldName = ({ value, loading, width }) => {
  return (
    <>
      {loading ? (
        <div className={width ? width : "w-40"}>
          <FieldNameSkeleton />
        </div>
      ) : (
        <p className="text-left font-satoshi">{value}</p>
      )}
    </>
  );
};
