import { useMemo } from "react";

const Garland = () => {
  const lights = useMemo(() => {
    const colors = [
      "hsl(348, 76%, 55%)", // red
      "hsl(51, 100%, 50%)", // gold
      "hsl(153, 80%, 40%)", // green
      "hsl(200, 100%, 60%)", // blue
      "hsl(280, 80%, 60%)", // purple
    ];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      delay: `${i * 0.15}s`,
    }));
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-12 z-10 flex items-center justify-center overflow-hidden">
      {/* Wire */}
      <svg className="absolute w-full h-12" viewBox="0 0 100 12" preserveAspectRatio="none">
        <path
          d="M0,6 Q5,2 10,6 T20,6 T30,6 T40,6 T50,6 T60,6 T70,6 T80,6 T90,6 T100,6"
          fill="none"
          stroke="hsl(120, 30%, 25%)"
          strokeWidth="0.5"
        />
      </svg>
      
      {/* Lights */}
      <div className="flex justify-around w-full px-4 relative">
        {lights.map((light) => (
          <div
            key={light.id}
            className="garland-light w-3 h-4 rounded-full relative"
            style={{
              backgroundColor: light.color,
              boxShadow: `0 0 10px ${light.color}, 0 0 20px ${light.color}`,
              animationDelay: light.delay,
            }}
          >
            {/* Bulb cap */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-zinc-600 rounded-t" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Garland;
