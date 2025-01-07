import { motion } from "framer-motion";

function HexagonClouds({
  hexSize,
  delay = 0.5,
  speed = 20,
  scale = 1,
}: {
  hexSize: number;
  delay: number;
  speed: number;
  scale: number;
}) {
  return (
    <div
      className={`flex justify-center relative items-center h-[${hexSize}px] w-[${hexSize}px] z-0 opacity-100 `}
      style={{
        height: `100px`,
        width: `86px`,
      }}
    >
      <motion.img
        src="./cloud.png"
        alt="Floating Cloud"
        initial={{ opacity: 0, x: -200 }}
        animate={{
          opacity: [0, 1, 1, 1, 1, 0],
          x: 300,
          y: [0, -10, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: speed,
            ease: "linear",
          },
          y: {
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          },
          opacity: {
            repeat: Infinity,
            duration: speed,
            ease: "easeInOut",
          },
          delay: delay,
        }}
        style={{
          width: "200px",
          height: "auto",
          position: "absolute",
          scale: scale,
        }}
      />
    </div>
  );
  return (
    <div
      className={`relative h-[${hexSize}px] w-[${hexSize}px] z-0 opacity-100`}
      style={{
        height: `100px`,
        width: `86px`,
      }}
    >
      <div className="absolute w-full h-full z-0">
        <img
          src="./cloud.png"
          className="absolute top-[-40px] left-[0px] scale-75"
        />
      </div>
      <div className="absolute w-full h-full z-0">
        <img
          src="./cloud.png"
          className="absolute top-[-40px] left-[40px] scale-75"
        />
      </div>
      {/* 2 */}
      <div className="absolute w-full h-full ">
        <img
          src="./cloud.png"
          className="absolute top-[-20px] left-[-20px] scale-75"
        />
      </div>
      <div className="absolute w-full h-full z-0">
        <img
          src="./cloud.png"
          className="absolute top-[-20px] left-[20px] scale-75"
        />
      </div>
      {/* 3 */}
      <div className="absolute w-full h-full ">
        <img
          src="./cloud.png"
          className="absolute top-[0px] left-[-40px] scale-75"
        />
      </div>
      <div className="absolute w-full h-full z-0">
        <img
          src="./cloud.png"
          className="absolute top-[0px] left-[0px] scale-75"
        />
      </div>
      <div className="absolute w-full h-full z-0">
        <img
          src="./cloud.png"
          className="absolute top-[0px] left-[50px] scale-75"
        />
      </div>
      {/* 4 */}
      <div className="absolute w-full h-full ">
        <img
          src="./cloud.png"
          className="absolute top-[20px] left-[-20px] scale-75"
        />
      </div>
      <div className="absolute w-full h-full z-0">
        <img
          src="./cloud.png"
          className="absolute top-[20px] left-[20px] scale-75"
        />
      </div>
      {/* 5 */}
      <div className="absolute w-full h-full ">
        <img
          src="./cloud.png"
          className="absolute top-[40px] left-[-40px] scale-75"
        />
      </div>
      <div className="absolute w-full h-full ">
        <img
          src="./cloud.png"
          className="absolute top-[40px] left-[0px] scale-75"
        />
      </div>
    </div>
  );
}

export default HexagonClouds;
