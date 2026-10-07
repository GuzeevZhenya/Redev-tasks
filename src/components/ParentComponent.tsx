import { ChildComponent } from "@/components/ChildComponent";
import { SiblingComponent } from "@/components/SiblingComponent";
import { useState } from "react";

export const ParentComponent = ({ name }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleRandomNumber = () => {
    const number = Math.floor(Math.random() * 10) + 1;
    setCount(number);
  };

  return (
    <div>
      <h1>ParentComponent</h1>
      <p>Счетчик: {count}</p>

      <div>
        <button onClick={handleIncrement}>Увеличить</button>
        <button onClick={handleDecrement} disabled={count === 0}>
          Уменьшить
        </button>
        <button onClick={handleReset}>Сбросить</button>
        <button onClick={handleRandomNumber}>Случайное значение</button>
      </div>

      <hr />

      <ChildComponent name={name} count={count} />

      <hr />

      <SiblingComponent />
    </div>
  );
};
