import React from 'react';
//import { useGlobalState } from '../GlobalState';
import { useNavigate } from 'react-router-dom';

const Examples: React.FC = () => {
  //const { quests } = useGlobalState();
  const navigate = useNavigate();

  const handleRedirect = () => {
    // Redirigir a la pestaña /upload
    navigate('/upload');

    // También puedes agregar lógica adicional antes de la redirección si es necesario
  };

  return (
    <div>
      <p>Contenido de tu componente</p>
      <button onClick={handleRedirect}>Ir a Upload</button>
    </div>
  );
};

export default Examples;
