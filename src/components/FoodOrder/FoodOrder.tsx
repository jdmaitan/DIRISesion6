import React, { MouseEventHandler, useContext, useState } from 'react';
import { MenuItem } from '../../entities/entities';
import "./FoodOrder.css";
import { foodItemsContext } from '../../App';
import addItem from "../../services/firebase";
import logger from '../../services/logger';
import ErrorBoundary from '../ErrorBoundary';
import OrderSentMessage from '../OrderSentMessage/OrderSentMessage';

interface FoodOrderProps
{
    food: MenuItem;
    onReturnToMenu: MouseEventHandler<HTMLButtonElement> | undefined;
}

function FoodOrder(props: FoodOrderProps)
{
    const [quantityError, setQuantityError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [orderSent, setOrderSent] = useState(false);
    const [triedToOrder, setTriedToOrder] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const menuItems: MenuItem[] = useContext(foodItemsContext);

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        setQuantityError(false);

        const newQuantity = parseInt(event.target.value, 10);

        if (isNaN(newQuantity))
        {
            logger.warn(`Se está intentando hacer un pedido con una cantidad no numerica`);
            setQuantityError(true);
        }

        if (newQuantity < 1)
        {
            logger.warn(`Se está intentando hacer un pedido con una cantidad negativa`);
            setQuantityError(true);
        }

        if (newQuantity > menuItems.find(i => i.id === props.food.id)!.quantity)
        {
            logger.warn(`Se está intentando hacer un pedido de una cantidad mayor al stock`);
            setQuantityError(true);
        }

        setQuantity(newQuantity);
        logger.info(`Se ha cambiado la cantidad a ${newQuantity}`);
    };

    const handleSubmitOrder = async () =>
    {
        setTriedToOrder(true);

        if (!quantityError)
        {
            setIsLoading(true);

            try
            {
                menuItems.map((item: MenuItem) =>
                {
                    if (item.id === props.food.id)
                    {
                        const previousQuantity = item.quantity;

                        item.quantity = item.quantity - quantity;
                        logger.info(`El stock del plato ${item.name} ha pasado de ${previousQuantity} a ${item.quantity}`);

                    }
                });

                await addItem(props.food, quantity);
                setOrderSent(true);
            }
            catch
            {
                logger.error('Error al realizar el pedido');
                setOrderSent(false);
            }
            finally
            {
                setIsLoading(false);
            }

        }

        setOrderSent(false);
    };

    return (
        <div className="food-order-container">

            <div className="food-details">
                <h4>{props.food.name}</h4>
                <div className="food-image-container">
                    <img src={`images/${props.food.image}`}
                        alt={props.food.name}
                        className="food-image" />
                </div>
                <p>{props.food.desc}</p>
                <p className="food-price">{(props.food.price * quantity).toFixed(2)}€</p>
                <div className="quantity-controls">
                    <label htmlFor="quantity">Cantidad:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                    />
                </div>

                <div className="buttons-container">
                    <button className="order-button"
                        onClick={handleSubmitOrder}
                        disabled={orderSent || isLoading}>
                        {isLoading ? "Procesando..." : (orderSent ? "Pedido enviado" : "Enviar pedido")}
                    </button>

                    <button onClick={props.onReturnToMenu}
                        className="return-button">
                        Volver al menú
                    </button>
                </div>

                <ErrorBoundary fallback={<div className='sentFallback'>¡Algo salió mal durante la realización del pedido. Por favor introduzca una cantidad válida la proxima vez!</div>}>
                    {triedToOrder &&
                        <OrderSentMessage orderSent={orderSent} quantityError={quantityError} />}
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default FoodOrder;