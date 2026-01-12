from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import uvicorn
import os
from datetime import datetime

from database import get_db, init_db
from models import User, GameResult, PromoCode
from schemas import (
    GameResultCreate, 
    GameResultResponse,
    UserStatsResponse,
    PromoCodeCreate,
    PromoCodeResponse,
    PromoCodeValidation
)
from crud import create_game_result, get_user_stats, create_promo_code, validate_promo_code

app = FastAPI(
    title="Rose Tic Tac Toe API",
    description="Backend API for Telegram Tic Tac Toe mini-app",
    version="1.0.0"
)

# Configure CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_db()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Rose Tic Tac Toe API is running!",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/game-result", response_model=GameResultResponse)
async def record_game_result(
    game_data: GameResultCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Record game result from frontend
    """
    try:
        # Get or create user
        result = await create_game_result(db, game_data)
        
        # Generate promo code for wins
        promo_code = None
        if game_data.status == "win":
            promo_obj = await create_promo_code(
                db, 
                user_id=result.user_id, 
                game_result_id=result.id
            )
            promo_code = promo_obj.code
            
        return GameResultResponse(
            id=result.id,
            user_id=result.user_id,
            status=result.status,
            difficulty=result.difficulty,
            promo_code=promo_code,
            created_at=result.created_at
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record game result: {str(e)}"
        )

@app.get("/user/{user_id}/stats", response_model=UserStatsResponse)
async def get_user_statistics(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get user statistics
    """
    try:
        stats = await get_user_stats(db, user_id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user stats: {str(e)}"
        )

@app.post("/promo-code/validate", response_model=PromoCodeResponse)
async def validate_promo_code_endpoint(
    validation_data: PromoCodeValidation,
    db: AsyncSession = Depends(get_db)
):
    """
    Validate a promo code
    """
    try:
        promo_code = await validate_promo_code(
            db, 
            validation_data.code, 
            validation_data.user_id
        )
        
        if not promo_code:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid or expired promo code"
            )
            
        return PromoCodeResponse(
            code=promo_code.code,
            is_valid=True,
            used_at=promo_code.used_at,
            created_at=promo_code.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to validate promo code: {str(e)}"
        )

@app.get("/leaderboard")
async def get_leaderboard(
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """
    Get leaderboard of top players
    """
    try:
        # Get users with their win counts
        stmt = (
            select(
                User.id,
                User.username,
                func.count(GameResult.id).label('wins')
            )
            .join(GameResult, User.id == GameResult.user_id)
            .where(GameResult.status == 'win')
            .group_by(User.id, User.username)
            .order_by(func.count(GameResult.id).desc())
            .limit(limit)
        )
        
        result = await db.execute(stmt)
        leaderboard = result.all()
        
        return [
            {
                "user_id": row.id,
                "username": row.username,
                "wins": row.wins
            }
            for row in leaderboard
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve leaderboard: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )