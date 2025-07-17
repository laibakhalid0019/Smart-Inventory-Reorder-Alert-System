import { motion } from "framer-motion";

const Tile = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`rounded-2xl p-6 shadow-lg text-white ${color} min-w-[200px]`}
  >
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </motion.div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Retailer Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
        <Tile title="Total Products" value="120" color="bg-blue-500" />
        <Tile title="Low Stock Items" value="8" color="bg-red-500" />
        <Tile title="Sold Today" value="34" color="bg-green-500" />
        <Tile title="Incoming Stock" value="21" color="bg-yellow-500" />
      </div>
    </div>
  );
}

export default App;
