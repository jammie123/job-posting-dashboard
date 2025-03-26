interface SubscriptionCardProps {
  name: string
  validFrom: string
  validTo: string
  progress?: string
}

export function SubscriptionCard({ name, validFrom, validTo, progress }: SubscriptionCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-full flex flex-col">
      <h3 className="font-medium text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-1">
        Aktivní: {validFrom} - {validTo}
      </p>
      {progress && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${(Number.parseInt(progress.split("/")[0]) / Number.parseInt(progress.split("/")[1])) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}</p>
        </div>
      )}
    </div>
  )
}

