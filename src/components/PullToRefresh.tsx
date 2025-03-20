import React, { useState, useEffect } from "react";

const PullToRefresh = ({ children }: { children: React.ReactNode }) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(event.touches[0].clientY);
        setPullDistance(0);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (startY !== null) {
        const distance = event.touches[0].clientY - startY;
        if (distance > 0) {
          setPullDistance(Math.min(distance, 100)); // Límite de 100px
        }

        if (distance > 80 && !isRefreshing) {
          setIsRefreshing(true);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    };

    const handleTouchEnd = () => {
      setStartY(null);
      setPullDistance(0);
      setIsRefreshing(false);
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startY, isRefreshing]);

  return (
    <div
      style={{
        position: "relative",
        transform: `translateY(${pullDistance}px)`, // Mueve todo el contenido
        transition: pullDistance === 0 ? "transform 0.3s ease-out" : "none",
      }}
    >
      {/* Espacio generado por el desplazamiento */}
      <div
        style={{
          height: `${pullDistance}px`, // Altura dinámica basada en el desplazamiento
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "height 0.3s ease-out",
        }}
      >
        {pullDistance > 10 && (
          <svg width="40" height="40" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r={20}
              fill="none"
              stroke="#007BFF"
              strokeWidth="4"
              strokeDasharray={Math.PI * 2 * 20}
              strokeDashoffset={Math.PI * 2 * 20 * (1 - pullDistance / 100)}
              strokeLinecap="round"
              transform="rotate(-90 25 25)"
            />
          </svg>
        )}
      </div>

      {children}
    </div>
  );
};

export default PullToRefresh;
