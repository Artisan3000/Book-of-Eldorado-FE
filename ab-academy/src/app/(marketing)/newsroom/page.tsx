export default function NewsroomPage() {
  return (
    <main className="px-8 py-16">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-5xl font-bold">Newsroom</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          Company updates, announcements, and press resources will live here.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-3xl border border-dashed border-gray-400 p-10 text-center">
        <p className="font-semibold text-black">No newsroom updates yet.</p>
        <p className="mt-2 text-sm text-gray-600">
          Published announcements will appear here once they are ready.
        </p>
      </section>
    </main>
  );
}
