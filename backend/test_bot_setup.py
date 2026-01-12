# Тестовый скрипт для проверки функционала бота
# Используйте этот файл для тестирования до получения настоящего токена

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=== Telegram Bot Test Setup ===")
print()

# Check if token exists
token = os.getenv('TELEGRAM_BOT_TOKEN')
if token:
    print(f"✅ Bot token found: {token[:10]}...")
else:
    print("❌ No bot token found!")
    print("Please create a bot with @BotFather and add the token to .env file")
    print()
    print("Steps:")
    print("1. Message @BotFather in Telegram")
    print("2. Send /newbot command") 
    print("3. Follow instructions to create bot")
    print("4. Copy the token")
    print("5. Create .env file with:")
    print("   TELEGRAM_BOT_TOKEN=your_token_here")
    print("   WEB_APP_URL=https://your-domain.com")

print()
web_app_url = os.getenv('WEB_APP_URL', 'Not set')
print(f"🌐 Web App URL: {web_app_url}")

print()
print("=== Next Steps ===")
print("1. Get your bot token from @BotFather")
print("2. Set up Web App URL (use ngrok for local testing)")
print("3. Update .env file with your values")
print("4. Run: python telegram_bot.py")
print()
print("For local testing with ngrok:")
print("1. Install ngrok: https://ngrok.com/download")
print("2. Run: ngrok http 5173")
print("3. Use the HTTPS URL in WEB_APP_URL")