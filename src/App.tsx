import { ActionButton } from "@/components/ActionButton";
import { NumberCard } from "@/components/NumberCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TextCard } from "@/components/TextCard";
import TodoList from "@/components/TodoList";
import UserCard from "@/components/UserCard";

function App() {
  const handleClick = () => {
    alert("Кнопка нажата!");
  };

  const user = {
    name: "Pavel",
    age: 27,
    city: "Minsk",
  };

  const todos = ["Learn React", "Build a project", "Get a job"];

  return (
    <>
      <TextCard text={"hello"} />
      <ActionButton onClick={handleClick} />
      <UserCard user={user} />
      <TodoList todos={todos} />
      <StatusBadge isActive={true} />
      <NumberCard count={12} />
    </>
  );
}

export default App;
