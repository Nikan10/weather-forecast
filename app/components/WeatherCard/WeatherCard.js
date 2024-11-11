// components/WeatherCard.js
import Image from "next/image";

export default function WeatherCard({ data, onRemove }) {
  if (!data) return null;

  const {
    name,
    main: { temp, humidity },
    weather: [{ main: condition, icon }],
    wind: { speed },
  } = data;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl font-bold text-gray-900">
          {Math.round(temp)}°C
        </div>
        <Image
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={condition}
          width={50}
          height={50}
        />
      </div>

      <div className="space-y-2">
        <div className="text-lg text-gray-600">{condition}</div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-medium">Wind</span>
            <div>{speed} m/s</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="font-medium">Humidity</span>
            <div>{humidity}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
