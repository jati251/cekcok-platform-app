const { FieldNameSkeleton } = require("./Skeletons/FieldNameSkeleton");

export const CustomFieldName = ({ value, loading }) => {
  return (
    <>
      {loading ? (
        <div className="w-40">
          <FieldNameSkeleton />
        </div>
      ) : (
        <p className="text-left font-satoshi">{value}</p>
      )}
    </>
  );
};
