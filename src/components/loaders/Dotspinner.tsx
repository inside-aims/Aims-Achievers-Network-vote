// 6. Dots Spinner - Sequential dots
export const DotsSpinner = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-yellow-600 rounded-full"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            animation: `pulse 1.4s ease-in-out ${i * 0.16}s infinite both`,
          }}
        />
      ))}
    </div>
  )