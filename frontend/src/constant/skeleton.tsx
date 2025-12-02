export const DashboardSkeleton = () => {
  return (
    <form className="w-2xl animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-gray-300 rounded-md"></div>
          <div className="h-4 w-56 bg-gray-200 rounded-md"></div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
        </div>

        <div>
          <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
        </div>

        <div>
          <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
        </div>

        <div className="lg:col-span-2">
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-24 bg-gray-100 rounded-lg w-full"></div>
        </div>

        <div>
          <div className="h-4 w-28 bg-gray-300 rounded mb-2"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
        </div>
      </div>
    </form>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="bg-gray-200 animate-pulse rounded-2xl overflow-hidden">
      <div className="w-full h-45 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  );
};

export const MenuSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div
        className="overflow-hidden mt-4 rounded-2xl max-w-5xl mx-auto"
        style={{ height: "670px" }}
      >
        <div className="w-full mb-1">
          <div className="flex bg-gray-300 rounded-t-2xl">
            <div className="flex-1 h-12"></div>
            <div className="flex-1 h-12"></div>
            <div className="flex-1 h-12"></div>
            <div className="flex-1 h-12"></div>
            <div className="flex-1 h-12"></div>
          </div>
        </div>

        <div className="space-y-2">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className="flex items-center bg-white p-4 rounded-lg border border-gray-200"
            >
              <div className="flex-1 flex justify-center">
                <div className="w-15 h-15 bg-gray-200 rounded-lg"></div>
              </div>

              <div className="flex-1 text-center">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>

              <div className="flex-1 text-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>

              <div className="flex-1 text-center">
                <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto"></div>
              </div>

              <div className="flex-1 flex justify-center space-x-4">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export const OrderSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="overflow-hidden mt-4 rounded-2xl w-5xl mx-auto" style={{ height: "670px" }}>
        <div className="w-full">
          <div className="flex bg-gray-300 rounded-t-2xl">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex-1 h-12"></div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="flex items-center bg-white p-4 rounded-lg border border-gray-200"
            >
              <div className="flex-1 text-center">
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>

              <div className="flex-1 text-center">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              </div>

              <div className="flex-1 text-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>

              <div className="flex-1 text-center">
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};