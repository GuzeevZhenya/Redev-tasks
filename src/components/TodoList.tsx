const TodoList = ({ todos }) => {
  return (
    <ul className="card">
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
};

export default TodoList;