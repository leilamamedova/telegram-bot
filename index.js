// Import the dotenv package to load environment variables from a .env file
import 'dotenv/config';

// Import the Telegraf library and Markup object for creating inline keyboards.
import { Telegraf, Markup } from 'telegraf';
import { format } from 'date-fns';

// Initialize the Telegram bot with your bot token from .env file.
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ----------------------
// Utility functions
// -----------------------

// Function to generate a random integer between min and max (inclusive).
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to format a date object in the format 'yyyy-MM-dd HH:mm:ss'.
const getCurrentDateTime = () => {
  const currentDate = new Date();
  return format(currentDate, 'yyyy-MM-dd HH:mm:ss');
};

// ----------------------
// Flip a coin functionality
// ----------------------

// Function to simulate flipping a coin and returning 'Heads' or 'Tails'.
const getCoinSide = () => (getRandomInt(0, 1) === 0 ? 'Heads' : 'Tails');

// Create an inline keyboard for the coin flip functionality.
const coinInlineKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Flip again', 'flip_a_coin'),
]);

// Action handler for when user clicks "Flip again" on the inline keyboard.
bot.action('flip_a_coin', async (ctx) => {
  const newMessageText = `${getCoinSide()}\nEdited: ${getCurrentDateTime()}`;

  // Check if the new message text is different from the current one.
  if (ctx.callbackQuery.message.text !== newMessageText) {
    await ctx.editMessageText(newMessageText, coinInlineKeyboard);
  } else {
    console.log('Message content is the same, skipping edit.');
  }
});

// Command handler for when user sends "Flip a coin".
bot.hears('Flip a coin', (ctx) => ctx.reply(getCoinSide(), coinInlineKeyboard));

// -------------------------
// Random number functionality
// -------------------------

// Function to generate a random number between 0 and 100.
const getRandomNumber = () => getRandomInt(0, 100);

// Create an inline keyboard for generating a random number.
const numberInlineKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Generate new', 'random_number'),
]);

// Action handler for when user clicks "Generate new" on the inline keyboard.
bot.action('random_number', async (ctx) => {
  await ctx.editMessageText(
    `${getRandomNumber()}\nEdited: ${getCurrentDateTime()}`,
    numberInlineKeyboard,
  );
});

// Command handler for when user sends "Random number".
bot.hears('Random number', (ctx) =>
  ctx.reply(getRandomNumber().toString(), numberInlineKeyboard),
);

// -------------------------
// Setting up the functionality
// -------------------------

// Create a reply keyboard with options 'Flip a coin' and 'Random number'.
const replyKeyboard = Markup.keyboard([['Flip a coin'], ['Random number']]);

// Default handler for any other message, providing options from the reply keyboard.
bot.use(async (ctx) => {
  await ctx.reply('What to do?', replyKeyboard);
});

// Start the bot.
console.log('Bot is ready!');
bot.launch();
