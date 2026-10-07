export const ChildComponent = ({ name, count }) => {
  return (
    <div>
      <h2>ChildComponent</h2>
      <p>
        Привет, {name}! Текущий счетчик: {count}
      </p>
    </div>
  );
};
