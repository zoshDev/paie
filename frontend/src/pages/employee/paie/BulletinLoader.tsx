// 📄 src/pages/employee/paie/BulletinLoader.tsx

export function BulletinLoader() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 animate-pulse mt-2">
      <svg
        className="h-4 w-4 animate-spin text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      Calcul du bulletin en cours…
    </div>
  );
}
