
import DiagnoseForm from '../components/DiagnoseForm';

export default function DiagnosePage() {
  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-4">🌿 Green Guardian</h1>
      <p className="text-gray-700 mb-6">
        Upload a plant leaf photo to diagnose potential diseases using AI.
      </p>
      <DiagnoseForm />
    </main>
  );
}
