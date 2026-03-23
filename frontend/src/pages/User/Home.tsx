import React from "react";
import { FaStar } from "react-icons/fa";
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
        <div key={idx} className="rounded-2xl shadow-lg bg-surface overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-[color:var(--border)]"></div>
          <div className="p-6 text-center space-y-3">
            <div className="h-6 bg-[color:var(--border)] rounded w-3/4 mx-auto"></div>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, starIdx) => (
                <div key={starIdx} className="h-4 w-4 bg-[color:var(--border)] rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <section
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center rounded-b-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-8 lg:mx-12"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 mix-blend-screen opacity-50 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),transparent_55%)]"></div>
        <div className="relative z-10 text-center text-white px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold tracking-wide backdrop-blur">
            Fresh drops every day
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold">
            Fresh, Fast &{" "}
            <span className="text-accent">Street Delicious</span>
          </h1>
          <p className="mt-4 text-lg max-w-xl mx-auto text-white/90">
            The best bites from the street, served hot & tasty. Grab your
            favorites and satisfy your cravings!
          </p>
          <button className="mt-6 btn-primary">
            Order Now
          </button>
        </div>
      </section>


      <section className="mt-12 mb-12 px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="section-title">Categories</h2>
          <div className="text-sm text-[color:var(--muted)]">Pick a vibe, pick a bite</div>
        </div>

        {isLoading ? renderSkeleton() : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 " >
            {category.map((c, index) => (
              <div
                key={index}
                onClick={() => navigate(`/user/menu`, { state: { category: c.name, categoryId: c._id } })}
                className="card overflow-hidden hover:-translate-y-1 transition"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${c.photo}`}
                  alt={c.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-bold text-md">
                    {c.name}
                  </h3>

                  <div className="mt-2 mb-2 text-md flex items-center justify-center gap-1 text-accent-3">
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
