// 1. Создай компонент с кнопкой, которая увеличивает значение state на 1 при каждом нажатии.

import { useState } from "react";

// 2. Создай компонент, который скрывает или показывает текст при помощи кнопки.

// 3. Создай компонент с полем ввода, которое обновляет значение state при каждом вводе. Выведи значение state под полем ввода.

// 4. Создай компонент с кнопкой, которая меняет цвет текста при каждом нажатии.

function App() {
  const [count, setCount] = useState(0);
  const [isVisible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#3498db");

  const handleIncrement = () => {
    setCount((count) => count + 1);
  };

  const handleClickVisiable = () => {
    setVisible((state) => !state);
  };

  const getRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    return `hsl(${h}, 70%, 50%)`;
  };

  const handleClickChangeColor = () => {
    setColor(getRandomColor());
  };

  return (
    <>
      <button onClick={handleIncrement}>+</button>
      {count}
      <br />
      <button onClick={handleClickVisiable}>Click</button>
      {isVisible && <span>Текст есть</span>}
      <br />

      <input value={text} onChange={(e) => setText(e.target.value)} />
      {text}
      <br />

      <button onClick={handleClickChangeColor}>Сменить цвет</button>
      <p style={{ color }}>Текущий цвет: {color}</p>
    </>
  );
}

export default App;
