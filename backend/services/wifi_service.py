"""
Servicio de gestión de Wi-Fi
Escanear y conectar a redes Wi-Fi
"""
import subprocess
import re
from typing import List, Dict
from models.config import WifiConfig

class WifiService:
    def __init__(self):
        self.cache = {}
    
    async def scan_networks(self, config: WifiConfig) -> List[Dict]:
        """Escanear redes Wi-Fi"""
        try:
            # Usar nmcli (NetworkManager) para escanear redes
            result = subprocess.run(
                ["nmcli", "-t", "-f", "SSID,SIGNAL", "device", "wifi", "list"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                networks = []
                seen_ssids = set()
                
                for line in result.stdout.strip().split("\n"):
                    if ":" in line:
                        parts = line.split(":")
                        ssid = parts[0].strip()
                        signal_str = parts[1].strip() if len(parts) > 1 else "0"
                        
                        if ssid and ssid not in seen_ssids:
                            try:
                                signal = int(signal_str)
                                networks.append({
                                    "ssid": ssid,
                                    "signal": signal
                                })
                                seen_ssids.add(ssid)
                            except ValueError:
                                continue
                
                return sorted(networks, key=lambda x: x["signal"], reverse=True)
            else:
                # Fallback: retornar lista vacía o mock para desarrollo
                return []
        except Exception as e:
            print(f"Error escaneando Wi-Fi: {e}")
            # Fallback para desarrollo
            return [
                {"ssid": "MiFibra-1234", "signal": 92},
                {"ssid": "WIFI_VECINO", "signal": 45}
            ]
    
    async def connect_network(self, config: WifiConfig, ssid: str, password: str) -> Dict:
        """Conectar a una red Wi-Fi"""
        try:
            # Usar nmcli para conectar
            result = subprocess.run(
                ["nmcli", "device", "wifi", "connect", ssid, "password", password],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                return {
                    "ok": True,
                    "message": f"Conexión a {ssid} exitosa."
                }
            else:
                error_msg = result.stderr.strip() or "Error desconocido"
                return {
                    "ok": False,
                    "message": f"Error conectando a {ssid}: {error_msg}"
                }
        except subprocess.TimeoutExpired:
            return {
                "ok": False,
                "message": f"Timeout al conectar a {ssid}"
            }
        except Exception as e:
            return {
                "ok": False,
                "message": f"Error conectando a {ssid}: {str(e)}"
            }

