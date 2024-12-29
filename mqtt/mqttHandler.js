
const mqtt = require('mqtt');
const Gpio = require('onoff').Gpio; // For controlling GPIO pins
const Inventory = require('../models/Inventory'); // Import your Mongoose Inventory model

// Initialize the buzzer on GPIO pin 17
const buzzer = new Gpio(17, 'out');

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://localhost'); // Replace 'localhost' with your MQTT broker address if remote

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('hardware-store/button', (err) => {
        if (!err) console.log('Subscribed to hardware-store/button topic');
    });
});

// Handle incoming messages
client.on('message', async (topic, message) => {
    if (topic === 'hardware-store/button') {
        const { inventoryId } = JSON.parse(message.toString());
        buzzer.writeSync(1); // Turn on the buzzer
        setTimeout(() => buzzer.writeSync(0), 1000); // Turn it off after 1 second

        try {
            // Update the inventory item in the database
            const inventory = await Inventory.findById(inventoryId);
            if (inventory) {
                inventory.quantity += 1; // Increment the quantity
                await inventory.save();
                console.log(`Inventory updated: ${inventory.name} now has ${inventory.quantity}`);
            } else {
                console.log(`Inventory item with ID ${inventoryId} not found`);
            }
        } catch (error) {
            console.error('Error updating inventory:', error.message);
        }
    }
});
