export default function AdminLogsPage() {
  return (
    <section className="animate-fadeIn px-8 py-2 md:px-16">
      <div className="mb-6">
        <h2 className="text-2xl italic">Logs</h2>
        <p className="mt-2 text-sm text-gray-600">
          Administrative activity and system events will be reviewed here.
        </p>
      </div>

      <div className="border border-dashed border-gray-400 p-10 text-center">
        <p className="font-semibold text-black">No logs are available yet.</p>
        <p className="mt-2 text-sm text-gray-600">
          Audit logging will appear here once event tracking is connected.
        </p>
      </div>
    </section>
  );
}
