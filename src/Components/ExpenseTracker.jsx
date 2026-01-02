import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, CornerDownRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as storage from "../storage"; // added storage import


function ExpenseTracker() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const ghostRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(60);
  const [titleIsFocused, setTitleIsFocused] = useState(false);
  const [amountisFocused, setAmountIsFocused] = useState(false);

  // Load expenses from storage when component mounts
  useEffect(() => {
    const savedExpenses = storage.getExpenses();
    if (savedExpenses.length > 0) {
      setExpenses(savedExpenses);
    }
  }, []);

  // Save expenses to storage whenever expenses change
  useEffect(() => {
    storage.saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    const target = parseFloat(amount) || 0;
    let start = displayAmount;
    const duration = 100;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const value = start + (target - start) * progress;
      setDisplayAmount(Math.round(value));
      if (currentFrame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [amount]);

  useEffect(() => {
    if (ghostRef.current) {
      const ghostWidth = ghostRef.current.offsetWidth;
      setInputWidth(Math.max(ghostWidth + 20, 60));
    }
  }, [amount]);

  const handleAdd = () => {
    if (!title || !amount) return;
    const newExpense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
    };
    setExpenses([newExpense, ...expenses]);
    setTitle("");
    setAmount("");
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="p-8 w-full max-w-md mx-auto flex flex-col items-center mb-8">
      {/* Title input */}
      <input
        type="text"
        placeholder={titleIsFocused ? "" : "Expense Title"}
        value={title}
        onFocus={() => setTitleIsFocused(true)}
        onBlur={() => setTitleIsFocused(false)}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-transparent w-full outline-none text-center text-black placeholder-gray-400 text-sm font-medium"
      />

      {/* Ghost span (for measuring number width) */}
      <div className="absolute top-[-9999px] left-[-9999px] text-6xl font-bold whitespace-pre pointer-events-none">
        <span ref={ghostRef}>{amount || "0"}</span>
      </div>

      {/* Amount input + INR + Add button */}
      <div className="flex items-center justify-center mt-4 mb-4">
        <motion.input
          type="number"
          placeholder={amountisFocused ? "" : "0"}
          onFocus={() => setAmountIsFocused(true)}
          onBlur={() => setAmountIsFocused(false)}
          value={amountisFocused ? amount : displayAmount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-6xl font-bold text-center outline-none bg-transparent px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ minWidth: 60 }}
          animate={{ width: inputWidth }}
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <span className="text-sm font-medium text-gray-400 ml-2">INR</span>

        {/* Add Button */}
        <AnimatePresence mode="popLayout">
          {title.trim() !== "" && amount.trim() !== "" && (
            <motion.button
              key="add-button"
              onClick={handleAdd}
              className="ml-2 text-white bg-black rounded-full w-10 h-10 flex items-center justify-center leading-none"
              initial={{ opacity: 0, scale: 0.5, x: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, x: -20, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Plus size={18} strokeWidth={3} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Expense List */}
      <div className="space-y-2 w-full">
        <motion.div layout>
          {expenses.map((exp) => (
            <motion.div
              key={exp.id}
              layout
              initial={{ opacity: 0, y: -15, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { duration: 0.1, ease: "easeOut" },
              }}
              transition={{ duration: 0.1 }}
              className="flex justify-between items-center px-2 group transition duration-100 rounded-lg p-2"
            >
              <div className="flex items-center gap-2">
                <CornerDownRight
                  size={14}
                  className="absolut left-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                />
                <span className="text-sm font-medium">{exp.title}</span>

              </div>
              <div className="flex items-center gap-2 text-right">
                <span>{exp.amount} INR</span>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="absolute -right-5 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity duration-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Total Block */}
        <AnimatePresence mode="popLayout">
          {expenses.length > 1 && (
            <motion.div
              key="total-block"
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.1 }}
              className="sticky bottom-0 bg-gray-100 pt-4"
            >
              <div className="border-t border-dashed border-gray-400 my-2"></div>
              <div className="flex justify-between items-center px-1 py-2">
                <span className="font-semibold ml-5">Total</span>
                <div className="flex items-center gap-2 text-right">
                  <span className="font-bold -mr-9">
                    {expenses.reduce((sum, exp) => sum + exp.amount, 0)} INR
                  </span>
                  <div className="w-5 h-5 opacity-0"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ExpenseTracker;