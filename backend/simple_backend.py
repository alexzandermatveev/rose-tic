from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import os
import secrets
from enum import Enum

app = FastAPI(
    title="Rose Tic Tac Toe API",
    description="Simple backend API for Telegram Tic Tac Toe mini-app",
    version="1.0.0"
)

# Configure CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class GameStatus(str, Enum):
    WIN = "win"
    LOSS = "loss"
    DRAW = "draw"

class DifficultyLevel(str, Enum):
    RELAXED = "relaxed"
    STRATEGIC = "strategic"
    MASTER = "master"

class GameResultCreate(BaseModel):
    user_id: int
    username: Optional[str] = None
    status: GameStatus
    difficulty: DifficultyLevel
    promo_code: Optional[str] = None

class GameResultResponse(BaseModel):
    id: int
    user_id: int
    status: GameStatus
    difficulty: DifficultyLevel
    promo_code: Optional[str] = None
    created_at: str

class UserStatsResponse(BaseModel):
    user_id: int
    username: Optional[str] = None
    total_games: int
    wins: int
    losses: int
    draws: int
    win_rate: float
    favorite_difficulty: Optional[DifficultyLevel] = None

class PromoCodeValidation(BaseModel):
    code: str
    user_id: int

class PromoCodeResponse(BaseModel):
    code: str
    is_valid: bool
    used_at: Optional[str] = None
    created_at: str

# File storage
DATA_FILE = "game_data.json"

def load_data():
    """Load data from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "users": {},
        "game_results": [],
        "promo_codes": {}
    }

def save_data(data):
    """Save data to JSON file"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def generate_promo_code():
    """Generate unique 5-digit promo code"""
    return str(secrets.randbelow(90000) + 10000)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Rose Tic Tac Toe API is running!",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/game-result", response_model=GameResultResponse)
async def record_game_result(game_data: GameResultCreate):
    """Record game result from frontend"""
    try:
        data = load_data()
        
        # Create or update user
        user_id_str = str(game_data.user_id)
        if user_id_str not in data["users"]:
            data["users"][user_id_str] = {
                "id": game_data.user_id,
                "username": game_data.username,
                "created_at": datetime.utcnow().isoformat()
            }
        
        # Create game result
        result_id = len(data["game_results"]) + 1
        game_result = {
            "id": result_id,
            "user_id": game_data.user_id,
            "status": game_data.status,
            "difficulty": game_data.difficulty,
            "created_at": datetime.utcnow().isoformat()
        }
        
        data["game_results"].append(game_result)
        
        # Generate promo code for wins
        promo_code = None
        if game_data.status == GameStatus.WIN:
            promo_code = generate_promo_code()
            data["promo_codes"][promo_code] = {
                "code": promo_code,
                "user_id": game_data.user_id,
                "game_result_id": result_id,
                "is_used": False,
                "created_at": datetime.utcnow().isoformat(),
                "used_at": None
            }
            game_result["promo_code"] = promo_code
        
        save_data(data)
        
        return GameResultResponse(
            id=result_id,
            user_id=game_data.user_id,
            status=game_data.status,
            difficulty=game_data.difficulty,
            promo_code=promo_code,
            created_at=game_result["created_at"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record game result: {str(e)}"
        )

@app.get("/user/{user_id}/stats/simple")
async def get_user_stats_simple(user_id: int):
    """Get simplified user statistics (wins, losses, draws only)"""
    try:
        data = load_data()
        user_id_str = str(user_id)
        
        # Check if user exists
        if user_id_str not in data["users"]:
            return {
                "user_id": user_id,
                "stats": {
                    "wins": 0,
                    "losses": 0,
                    "draws": 0
                }
            }
        
        user_games = [g for g in data["game_results"] if g["user_id"] == user_id]
        
        # Calculate simple statistics
        wins = len([g for g in user_games if g["status"] == "win"])
        losses = len([g for g in user_games if g["status"] == "loss"])
        draws = len([g for g in user_games if g["status"] == "draw"])
        
        return {
            "user_id": user_id,
            "stats": {
                "wins": wins,
                "losses": losses,
                "draws": draws
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting user stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user statistics: {str(e)}"
        )


@app.get("/user/{user_id}/stats", response_model=UserStatsResponse)
async def get_user_statistics(user_id: int):
    """Get user statistics"""
    try:
        data = load_data()
        user_id_str = str(user_id)
        
        # Check if user exists
        if user_id_str not in data["users"]:
            return UserStatsResponse(
                user_id=user_id,
                username=None,
                total_games=0,
                wins=0,
                losses=0,
                draws=0,
                win_rate=0.0,
                favorite_difficulty=None
            )
        
        user = data["users"][user_id_str]
        user_games = [g for g in data["game_results"] if g["user_id"] == user_id]
        
        # Calculate statistics
        total_games = len(user_games)
        wins = len([g for g in user_games if g["status"] == "win"])
        losses = len([g for g in user_games if g["status"] == "loss"])
        draws = len([g for g in user_games if g["status"] == "draw"])
        
        win_rate = round(wins / total_games * 100, 2) if total_games > 0 else 0.0
        
        # Find favorite difficulty
        difficulty_count = {}
        for game in user_games:
            diff = game["difficulty"]
            difficulty_count[diff] = difficulty_count.get(diff, 0) + 1
        
        favorite_difficulty = None
        if difficulty_count:
            favorite_difficulty = max(difficulty_count, key=difficulty_count.get)
        
        return UserStatsResponse(
            user_id=user_id,
            username=user.get("username"),
            total_games=total_games,
            wins=wins,
            losses=losses,
            draws=draws,
            win_rate=win_rate,
            favorite_difficulty=favorite_difficulty
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user stats: {str(e)}"
        )

@app.post("/promo-code/validate", response_model=PromoCodeResponse)
async def validate_promo_code(validation_data: PromoCodeValidation):
    """Validate a promo code"""
    try:
        data = load_data()
        
        # Check if promo code exists and is valid
        if validation_data.code not in data["promo_codes"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid promo code"
            )
        
        promo = data["promo_codes"][validation_data.code]
        
        # Check if already used
        if promo["is_used"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Promo code already used"
            )
        
        # Mark as used
        promo["is_used"] = True
        promo["used_at"] = datetime.utcnow().isoformat()
        save_data(data)
        
        return PromoCodeResponse(
            code=promo["code"],
            is_valid=True,
            used_at=promo["used_at"],
            created_at=promo["created_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to validate promo code: {str(e)}"
        )

@app.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get leaderboard of top players"""
    try:
        data = load_data()
        
        # Count wins per user
        user_wins = {}
        user_names = {}
        
        for game in data["game_results"]:
            if game["status"] == "win":
                user_id = game["user_id"]
                user_wins[user_id] = user_wins.get(user_id, 0) + 1
                # Get username
                user_id_str = str(user_id)
                if user_id_str in data["users"]:
                    user_names[user_id] = data["users"][user_id_str].get("username")
        
        # Sort by wins and take top users
        sorted_users = sorted(user_wins.items(), key=lambda x: x[1], reverse=True)[:limit]
        
        leaderboard = []
        for user_id, wins in sorted_users:
            leaderboard.append({
                "user_id": user_id,
                "username": user_names.get(user_id, f"User_{user_id}"),
                "wins": wins
            })
        
        return leaderboard
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve leaderboard: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)