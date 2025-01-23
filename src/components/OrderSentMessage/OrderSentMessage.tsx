import './OrderSentMessage.css'

interface OrderSentMessageProps
{
  quantityError: boolean;
  orderSent: boolean
}

const OrderSentMessage = ({quantityError, orderSent}: OrderSentMessageProps) =>
{
  if (quantityError)
  {
    throw new Error("Se ha generado un error al realizar el pedido, asegurese de una utilizar una cantidad numérica, no negativa y que no sobrepase al stock");
  }

  if(orderSent)
  {
    throw new Error("El pedido no ha sido enviado");
  }

  return (
    <p className="order-confirmation">Pedido enviado. Recibirá un SMS una vez esté listo para recoger.</p>
  )
}

export default OrderSentMessage