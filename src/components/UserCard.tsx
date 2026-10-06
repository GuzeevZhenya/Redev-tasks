const UserCard = ({ user }) => {
  const { name, age, city } = user;
  return (
    <div className="card">
      <p>Имя: {name}</p>
      <p>Возраст: {age}</p>
      <p>Город: {city}</p>
    </div>
  );
};

export default UserCard;
