export const StatusBadge = ({ isActive }) => {
  return (
    <div className="card">Статус: {isActive ? " Активен" : "Неактивен"}</div>
  );
};
