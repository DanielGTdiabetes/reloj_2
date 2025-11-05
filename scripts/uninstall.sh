#!/bin/bash

# Script de desinstalación para Pantalla Reloj Dashboard
# Este script elimina las dependencias y servicios instalados

set -e  # Salir si hay algún error

echo "=========================================="
echo "Desinstalando Pantalla Reloj Dashboard"
echo "=========================================="

# Obtener el directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# Desinstalar servicios systemd
echo ""
echo "Desinstalando servicios systemd..."
if [ -d "$PROJECT_ROOT/systemd" ] && [ "$EUID" -eq 0 ]; then
    for service_file in "$PROJECT_ROOT/systemd"/*.service; do
        if [ -f "$service_file" ]; then
            service_name=$(basename "$service_file")
            if [ -f "/etc/systemd/system/$service_name" ]; then
                # Detener y deshabilitar el servicio si está activo
                systemctl stop "$service_name" 2>/dev/null || true
                systemctl disable "$service_name" 2>/dev/null || true
                # Eliminar el archivo del servicio
                rm -f "/etc/systemd/system/$service_name"
                echo "✓ Servicio $service_name eliminado"
            fi
        fi
    done
    systemctl daemon-reload
    echo "✓ Servicios systemd desinstalados (recarga del daemon)"
elif [ -d "$PROJECT_ROOT/systemd" ] && [ "$EUID" -ne 0 ]; then
    echo "⚠ ADVERTENCIA: Se requieren permisos de root para desinstalar servicios systemd"
    echo "   Ejecuta manualmente:"
    echo "   sudo systemctl stop pantalla-*.service"
    echo "   sudo systemctl disable pantalla-*.service"
    echo "   sudo rm /etc/systemd/system/pantalla-*.service"
    echo "   sudo systemctl daemon-reload"
fi

# Limpiar node_modules del frontend
echo ""
echo "Limpiando node_modules del frontend..."
if [ -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    rm -rf "$PROJECT_ROOT/frontend/node_modules"
    echo "✓ node_modules del frontend eliminado"
fi

# Limpiar dist del frontend (build)
if [ -d "$PROJECT_ROOT/frontend/dist" ]; then
    rm -rf "$PROJECT_ROOT/frontend/dist"
    echo "✓ dist del frontend eliminado"
fi

# Limpiar node_modules del root
if [ -d "$PROJECT_ROOT/node_modules" ]; then
    rm -rf "$PROJECT_ROOT/node_modules"
    echo "✓ node_modules del root eliminado"
fi

# Limpiar dist del root (si existe)
if [ -d "$PROJECT_ROOT/dist" ]; then
    rm -rf "$PROJECT_ROOT/dist"
    echo "✓ dist del root eliminado"
fi

# Desinstalar paquetes de Python (opcional, comentado por seguridad)
# echo ""
# echo "¿Deseas desinstalar los paquetes de Python? (s/N)"
# read -r response
# if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
#     if [ -f "$PROJECT_ROOT/backend/requirements.txt" ]; then
#         pip3 uninstall -r "$PROJECT_ROOT/backend/requirements.txt" -y || true
#         echo "✓ Paquetes de Python desinstalados"
#     fi
# fi

echo ""
echo "=========================================="
echo "✓ Desinstalación completada"
echo "=========================================="
echo ""
echo "Nota: Los paquetes de Python instalados globalmente no se han eliminado"
echo "      para evitar afectar otras aplicaciones. Si deseas eliminarlos"
echo "      manualmente, puedes usar: pip3 uninstall <paquete>"
echo ""
