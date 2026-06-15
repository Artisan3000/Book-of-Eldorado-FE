import { Sparkles } from "lucide-react";

export default function StudentExplore() {
  const offerings = [
    {
      id: 1,
      title: "Blueprint Membership",
      description:
        "Exclusive mentorship, live Q&As, and priority workshop invites.",
      price: "$120/year",
    },
    {
      id: 2,
      title: "Mastery Program",
      description:
        "Take your craft to the next level with advanced barbering techniques.",
      price: "$85",
    },
  ];

  return (
    <section className="px-8 md:px-16 py-12 animate-fadeIn">
      {/* --- Header --- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl flex items-center gap-2 mb-2 md:mb-0">
          Explore New Opportunities <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="italic text-gray-600 text-sm">
          Keep your momentum going — new paths open every week.
        </p>
      </div>

      {/* --- Featured Offerings --- */}
      <h3 className="text-xl mb-4 underline">Featured Programs</h3>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {offerings.map((offer) => (
          <div
            key={offer.id}
            className="border border-black p-6 flex flex-col justify-between bg-white hover:bg-gray-50 hover:scale-[1.02] transition-transform"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{offer.title}</h3>
            </div>
            <p className="text-sm text-gray-700 mb-3">{offer.description}</p>
            <p className="text-sm font-semibold mb-4">{offer.price}</p>
            <button
              type="button"
              disabled
              className="border border-gray-400 px-3 py-1 text-sm text-gray-500 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        ))}
      </div>

      {/* --- Personalized Recommendations --- */}
      <h3 className="text-xl mb-4 underline">Recommended for You</h3>
      <EmptyState
        title="No recommendations yet."
        description="Personalized recommendations will appear here once more courses and student activity are available."
      />

      {/* --- Upcoming Events --- */}
      <h3 className="text-xl mb-4 underline">Upcoming Events</h3>
      <EmptyState
        title="No upcoming events."
        description="Workshops and live sessions will appear here once they are scheduled."
      />
    </section>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-dashed border-gray-400 p-8 text-center mb-16">
      <p className="font-semibold text-black">{title}</p>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
