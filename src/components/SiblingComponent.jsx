import { useState } from "react";

export const SiblingComponent = () => {
  const [text, setText] = useState("Привет");

  const handleChangeText = () => {
    setText("REDEV");
  };

  return (
    <div>
      <h2>SiblingComponent</h2>
      <p>Текущий текст: {text}</p>
      <button onClick={handleChangeText}>Изменить текст</button>
    </div>
  );
};
