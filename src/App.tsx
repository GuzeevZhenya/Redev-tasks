import {NumberCard} from "./components/NumberCard";
import {TextCard} from "./components/TextCard";

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
      if(erger){}
      <TextCard text={"hello"} />
      <NumberCard count={12} />
    </>
  );
}

export default App;
