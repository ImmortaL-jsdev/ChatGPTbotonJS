require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
  webhookCallback,
} = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
  {
    command: "start",
    description: "Running a bot",
  },
  {
    command: "menu",
    description: "Get menu",
  },
  // {
  //   command: "mood",
  //   description: "Share your mood",
  // },
  // {
  //   command: "share",
  //   description: "Share data",
  // },
  // {
  //   command: "inline_keyboard",
  //   description: "Inline keyboard",
  // },
]);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Hello \\! I am bot \\. Telegram chanel: [this is link](https://t.me/chatGPTbyImmortaL)",
    {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }
  );
  await ctx.react("😘");
});

const menuKeyboard = new InlineKeyboard()
  .text("Find out the order status", "order-status")
  .text("Contact support", "support");

const backKeyboard = new InlineKeyboard().text("< Back to menu", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("Select menu item", {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("Order status: on the way", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});
bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("Write your request", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});
bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("Select menu item", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

// bot.command("mood", async (ctx) => {
//   // const moodKeyBoard = new Keyboard()
//   //   .text("Fine")
//   //   .row()
//   //   .text("Awesome")
//   //   .row()
//   //   .text("Bad")
//   //   .resized();

//   const moodLabels = ["Fine", "Awesome", "Bad"];

//   const rows = moodLabels.map((label) => {
//     return [Keyboard.text(label)];
//   });

//   const moodKeyBoard2 = Keyboard.from(rows).resized();

//   await ctx.reply("How are you?", {
//     reply_markup: moodKeyBoard2,
//   });
// });

// bot.command("share", async (ctx) => {
//   const shareKeyboard = new Keyboard()
//     .requestLocation("Geolocation")
//     .requestContact("Contact")
//     .requestPoll("Poll")
//     .placeholder("Provide detailed information...")
//     .resized();
//   await ctx.reply("What do you want to share?", {
//     reply_markup: shareKeyboard,
//   });
// });

// bot.command("inline_keyboard", async (ctx) => {
//   // const inlineKeyboard = new InlineKeyboard()
//   //   .text("Telegram chanel", "https://t.me/chatGPTbyImmortaL")
//   //   .text(
//   //     "Github profile",
//   //     "https://github.com/ImmortaL-jsdev?tab=repositories"
//   //   )
//   //   .text("3", "button-3");

//   const inlineKeyboard2 = new InlineKeyboard().url(
//     "Join to telegram channel",
//     "https://t.me/chatGPTbyImmortaL"
//   );
//   await ctx.reply("Choose", {
//     reply_markup: inlineKeyboard2,
//   });
// });

// bot.callbackQuery(/button-1-3/, async (ctx) => {
//   await ctx.answerCallbackQuery();
//   await ctx.reply(`You choose a number ${ctx.callbackQuery.data}`);
// });
// //  ---- хуже чем нижний ----

// bot.on("callback_query:data", async (ctx) => {
//   await ctx.answerCallbackQuery();
//   await ctx.reply(`Link : ${ctx.callbackQuery.data}`);
// });

// bot.on(":contact", async (ctx) => {
//   await ctx.reply("Thanks for the contact!");
// });

// bot.hears("Fine", async (ctx) => {
//   await ctx.reply("That's good!", {
//     reply_markup: { remove_keyboard: true },
//   });
// });
// bot.hears("Awesome", async (ctx) => {
//   await ctx.reply("I'm infinitely glad!", {
//     reply_markup: { remove_keyboard: true },
//   });
// });
// bot.hears("Bad", async (ctx) => {
//   await ctx.reply("It's sad :(", {
//     reply_markup: { remove_keyboard: true },
//   });
// });
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegramm:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
