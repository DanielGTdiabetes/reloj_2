#!/bin/bash

# Script de instalación para Pantalla Reloj Dashboard
# Este script instala todas las dependencias y configura la aplicación

set -e  # Salir si hay algún error

echo "=========================================="
echo "Instalando Pantalla Reloj Dashboard"
echo "=========================================="

# Obtener el directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# Verificar dependencias del sistema
echo ""
echo "Verificando dependencias del sistema..."

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 no está instalado. Por favor instálalo primero."
    exit 1
fi
echo "✓ Python3 encontrado: $(python3 --version)"

# Verificar pip
if ! command -v pip3 &> /dev/null; then
    echo "ERROR: pip3 no está instalado. Por favor instálalo primero."
    exit 1
fi
echo "✓ pip3 encontrado"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi
echo "✓ Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm no está instalado. Por favor instálalo primero."
    exit 1
fi
echo "✓ npm encontrado: $(npm --version)"

# Instalar dependencias del backend
echo ""
echo "Instalando dependencias del backend..."
cd "$PROJECT_ROOT/backend"
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
    echo "✓ Dependencias del backend instaladas"
else
    echo "⚠ ADVERTENCIA: requirements.txt no encontrado en backend/"
fi

# Instalar dependencias del frontend
echo ""
echo "Instalando dependencias del frontend..."
cd "$PROJECT_ROOT/frontend"
if [ -f "package.json" ]; then
    npm install
    echo "✓ Dependencias del frontend instaladas"
else
    echo "⚠ ADVERTENCIA: package.json no encontrado en frontend/"
fi

# Construir el frontend
echo ""
echo "Construyendo el frontend..."
if [ -f "package.json" ]; then
    npm run build
    echo "✓ Frontend construido exitosamente"
fi

# Instalar dependencias del root (si existe)
if [ -f "$PROJECT_ROOT/package.json" ]; then
    echo ""
    echo "Instalando dependencias del root..."
    cd "$PROJECT_ROOT"
    npm install
    echo "✓ Dependencias del root instaladas"
fi

# Instalar servicios systemd (si existen y el usuario tiene permisos)
echo ""
echo "Verificando servicios systemd..."
if [ -d "$PROJECT_ROOT/systemd" ] && [ "$EUID" -eq 0 ]; then
    echo "Instalando servicios systemd..."
    for service_file in "$PROJECT_ROOT/systemd"/*.service; do
        if [ -f "$service_file" ]; then
            service_name=$(basename "$service_file")
            cp "$service_file" "/etc/systemd/system/"
            echo "✓ Servicio $service_name copiado a /etc/systemd/system/"
        fi
    done
    systemctl daemon-reload
    echo "✓ Servicios systemd instalados (recarga del daemon)"
elif [ -d "$PROJECT_ROOT/systemd" ] && [ "$EUID" -ne 0 ]; then
    echo "⚠ ADVERTENCIA: Se requieren permisos de root para instalar servicios systemd"
    echo "   Ejecuta manualmente: sudo cp systemd/*.service /etc/systemd/system/ && sudo systemctl daemon-reload"
fi

echo ""
echo "=========================================="
echo "✓ Instalación completada exitosamente"
echo "=========================================="
echo ""
echo "Próximos pasos:"
echo "1. Configura las variables de entorno si es necesario"
echo "2. Para iniciar el backend: cd backend && python3 -m uvicorn main:app --reload"
echo "3. Para iniciar el frontend: cd frontend && npm run dev"
echo ""
