from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class GameStatus(str, Enum):
    WIN = "win"
    LOSS = "loss"
    DRAW = "draw"

class DifficultyLevel(str, Enum):
    RELAXED = "relaxed"
    STRATEGIC = "strategic"
    MASTER = "master"

# Request schemas
class GameResultCreate(BaseModel):
    user_id: int = Field(..., description="Telegram user ID")
    username: Optional[str] = Field(None, description="Username")
    status: GameStatus = Field(..., description="Game result status")
    difficulty: DifficultyLevel = Field(..., description="Game difficulty level")
    promo_code: Optional[str] = Field(None, description="Promo code for wins")

class PromoCodeValidation(BaseModel):
    code: str = Field(..., min_length=5, max_length=10, description="Promo code to validate")
    user_id: int = Field(..., description="User ID validating the code")

# Response schemas
class GameResultResponse(BaseModel):
    id: int
    user_id: int
    status: GameStatus
    difficulty: DifficultyLevel
    promo_code: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserStatsResponse(BaseModel):
    user_id: int
    username: Optional[str] = None
    total_games: int
    wins: int
    losses: int
    draws: int
    win_rate: float
    favorite_difficulty: Optional[DifficultyLevel] = None

class PromoCodeResponse(BaseModel):
    code: str
    is_valid: bool
    used_at: Optional[datetime] = None
    created_at: datetime

class LeaderboardEntry(BaseModel):
    user_id: int
    username: Optional[str] = None
    wins: int