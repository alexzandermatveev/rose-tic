import asyncio
import logging
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
import os
from dotenv import load_dotenv

# Load environment variables
# Explicitly specify the path to .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Debug: Print current working directory and check if .env exists
import os
print(f"Current working directory: {os.getcwd()}")
print(f"Looking for .env at: {env_path}")
print(f".env file exists: {os.path.exists(env_path)}")
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        print(".env contents:")
        print(f.read())

# Debug: Print current working directory and check if .env exists
import os
print(f"Current working directory: {os.getcwd()}")
print(f".env file exists: {os.path.exists('.env')}")
if os.path.exists('.env'):
    with open('.env', 'r') as f:
        print(".env contents:")
        print(f.read())

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot token from @BotFather
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not BOT_TOKEN:
    raise ValueError("Please set TELEGRAM_BOT_TOKEN environment variable")

# Your web app URL (will be configured later)
WEB_APP_URL = os.getenv('WEB_APP_URL', 'https://your-domain.com')  # Change this to your actual domain
logger.info(f"Web App URL configured as: {WEB_APP_URL}")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send welcome message with Web App button"""
    user = update.effective_user
    logger.info(f"User {user.id} ({user.username}) started the bot")
    
    # Create Web App keyboard
    keyboard = [
        [InlineKeyboardButton(
            "🎮 Play Tic Tac Toe", 
            web_app=WebAppInfo(url=WEB_APP_URL)
        )]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_text = f"""👋 Hello {user.first_name}!

Welcome to Rose Tic Tac Toe! 

✨ Features:
• Three difficulty levels
• Beautiful diamond/ring symbols  
• Win promo codes
• Statistics tracking
• Leaderboard

Click the button below to start playing!"""
    
    await update.message.reply_text(
        welcome_text,
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send help message"""
    help_text = """❓ Help & Commands:

/start - Start the game
/help - Show this help message

🎮 How to play:
1. Choose your symbol (diamond or ring)
2. Select difficulty level
3. Play against AI
4. Win to get promo codes!

The game saves your progress and statistics automatically."""
    
    await update.message.reply_text(help_text)

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle button clicks"""
    query = update.callback_query
    await query.answer()
    
    # Handle different callback data if needed
    if query.data == "play_again":
        # Create Web App button again
        keyboard = [
            [InlineKeyboardButton(
                "🎮 Play Again", 
                web_app=WebAppInfo(url=WEB_APP_URL)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "Want to play again?",
            reply_markup=reply_markup
        )

def main() -> None:
    """Run the bot"""
    # Create the Application
    application = Application.builder().token(BOT_TOKEN).build()

    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CallbackQueryHandler(button_handler))

    # Run the bot
    logger.info("Starting Telegram bot...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()