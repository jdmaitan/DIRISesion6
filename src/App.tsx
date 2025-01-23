import { Suspense, useState } from 'react'
import './App.css'
import { MenuItem } from './entities/entities';
import React from 'react';

const Foods = React.lazy(() => import('./components/Foods/Foods'));

export const foodItemsContext = React.createContext<MenuItem[]>([]);

function App()
{
  const [isChooseFoodPage, setIsChooseFoodPage] = useState(false);
  const [menuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Hamburguesa de Pollo",
      quantity: 40,
      desc: "Hamburguesa de pollo frito... y mayonesa",
      price: 24,
      image: "hamburguesa.jpeg"
    },
    {
      id: 2,
      name: "Pizza Margarita",
      quantity: 30,
      desc: "Clásica pizza con tomate, mozzarella y albahaca",
      price: 35,
      image: "margarita.jpg"
    },
    {
      id: 3,
      name: "Tacos al Pastor",
      quantity: 50,
      desc: "Tacos con carne de cerdo adobada, piña y cilantro",
      price: 18,
      image: "tacos.jpg"
    },
    {
      id: 4,
      name: "Ensalada César",
      quantity: 25,
      desc: "Ensalada con lechuga romana, pollo, crutones y aderezo César",
      price: 22,
      image: "ensalada.jpg"
    },
  ]);

  return (
    <foodItemsContext.Provider value={menuItems}>
      <div className="App">
        <button className="toggleButton" onClick={() => setIsChooseFoodPage(!isChooseFoodPage)}>
          {isChooseFoodPage ? "Disponibilidad" : "Pedir Comida"}
        </button>

        <h1 className="title">Comida Rápida Online</h1>

        {!isChooseFoodPage && (
          <>
            <h4 className="subTitle">Menús</h4>
            <ul className="ulApp">
              {menuItems.map((item) => (
                <li key={item.id} className="liApp">
                  <p>{item.name}</p>
                  <p>Stock:{item.quantity}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        {isChooseFoodPage &&
          <Suspense fallback={<div>Cargando productos...</div>}>
            <Foods foodItems={menuItems}/>
          </Suspense>
        }

      </div>
    </foodItemsContext.Provider>
  );
}

export default App
