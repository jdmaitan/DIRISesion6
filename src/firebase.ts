import { initializeApp } from "firebase/app";
import { MenuItem } from "./entities/entities";
import { getDatabase, push, ref } from "firebase/database";
import logger from "./services/logger";

const firebaseConfig = {
    apiKey: "AIzaSyC2eim7o52-1qm8JHc8KpeReeMtmvILGdU",
    authDomain: "comidadiri.firebaseapp.com",
    databaseURL: "https://comidadiri-default-rtdb.firebaseio.com",
    projectId: "comidadiri",
    storageBucket: "comidadiri.firebasestorage.app",
    messagingSenderId: "647627909900",
    appId: "1:647627909900:web:fab8cb7fec7c7015153729",
    measurementId: "G-WFB7HSTPQD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const addItem = async (food: MenuItem, quantity: number) =>
{
    const ordersRef = ref(db, "orders");
    const orderToSave = {
        id: food.id,
        name: food.name,
        quantity: quantity,
        unitPrice: food.price,
        totalPrice: quantity * food.price   
    };
    await push(ordersRef, orderToSave)
        .then(result => logger.info(`Se han guardado los datos exitosamente en la base de datos. URL de consulta: ${result}`));
};

export default addItem;