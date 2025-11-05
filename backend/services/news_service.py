"""
Servicio de noticias
Parseo de feeds RSS
"""
import feedparser
import aiohttp
from typing import List, Dict
from models.config import NewsConfig

class NewsService:
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 600  # 10 minutos
    
    async def get_news(self, config: NewsConfig) -> List[Dict]:
        """Obtener noticias de los feeds RSS"""
        all_news = []
        
        for source in config.sources:
            try:
                news = await self._fetch_feed(source.url)
                for item in news:
                    all_news.append({
                        "title": item.get("title", ""),
                        "source": source.name
                    })
            except Exception as e:
                print(f"Error obteniendo noticias de {source.name}: {e}")
        
        # Ordenar por fecha (si está disponible) y limitar
        return all_news[:20]  # Máximo 20 noticias
    
    async def _fetch_feed(self, url: str) -> List[Dict]:
        """Obtener feed RSS"""
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    content = await response.text()
                    feed = feedparser.parse(content)
                    
                    news = []
                    for entry in feed.entries[:5]:  # Máximo 5 por feed
                        news.append({
                            "title": entry.get("title", ""),
                            "link": entry.get("link", ""),
                            "published": entry.get("published", "")
                        })
                    return news
                else:
                    raise Exception(f"Error obteniendo feed: {response.status}")

