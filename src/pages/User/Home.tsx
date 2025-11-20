import React from "react";
import { FaStar } from "react-icons/fa";
import { colors } from "../../constant/color";
import { useApiQuery } from "../../hook/useQuery";
import { useNavigate } from "react-router";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { data: categories, isLoading } = useApiQuery<ApiResponse<Categories[]>>({
    endpoint: `${import.meta.env.VITE_API_URL}/get-category-list`,
   
  });


  const category = categories?.data || [];

  const renderSkeleton = () => (
    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="rounded-2xl shadow-lg bg-white overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-gray-300"></div>
          <div className="p-6 text-center space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, starIdx) => (
                <div key={starIdx} className="h-4 w-4 bg-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="min-h-screen font-sans bg-white"
      style={{ color: colors.text }}
    >

      <section
        className="relative h-[73vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Fresh, Fast &{" "}
            <span style={{ color: colors.accent }}>Street Delicious</span>
          </h1>
          <p className="mt-4 text-lg max-w-xl mx-auto">
            The best bites from the street, served hot & tasty. Grab your
            favorites and satisfy your cravings!
          </p>
          <button
            className="mt-6 px-8 py-3 rounded-full shadow-lg font-semibold transition"
            style={{
              backgroundColor: colors.accent,
              color: colors.white,
            }}
          >
            Order Now
          </button>
        </div>
      </section>


      <section className="mt-10 mb-12 px-6 max-w-7xl mx-auto">
        <h2
          className="text-3xl font-bold text-center"
          style={{ color: colors.text }}
        >
          Categories
        </h2>

        {isLoading ? renderSkeleton() : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 " >
            {category.map((c, index) => (
              <div
                key={index}
                onClick={() => navigate(`/user/menu`, { state: { category: c.name, categoryId: c._id } })}
                className="rounded-2xl shadow-lg bg-white overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${c.photo}`}
                  alt={c.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                    {c.name}
                  </h3>

                  <div
                    className="mt-3 flex items-center justify-center gap-1"
                    style={{ color: colors.accent }}
                  >
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
