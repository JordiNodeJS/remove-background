#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}Verificando servicios de Remove Background...${NC}"
echo ""

# Verificar el puerto 3000 (frontend)
echo -e "${CYAN}Verificando frontend (puerto 3000)...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
  echo -e "${GREEN}✓ Frontend en puerto 3000: ACTIVO${NC}"
else
  echo -e "${RED}✗ Frontend en puerto 3000: NO DISPONIBLE${NC}"
fi

# Verificar el puerto 3001 (backend)
echo -e "\n${CYAN}Verificando backend (puerto 3001)...${NC}"
if curl -s http://localhost:3001/health > /dev/null; then
  echo -e "${GREEN}✓ Backend en puerto 3001: ACTIVO${NC}"
  
  # Verificar si el endpoint de procesamiento de imágenes está disponible
  echo -e "\n${CYAN}Verificando endpoint de procesamiento de imágenes...${NC}"
  response=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:3001/health)
  
  if [ "$response" == "200" ]; then
    echo -e "${GREEN}✓ API de procesamiento de imágenes: DISPONIBLE${NC}"
  else
    echo -e "${YELLOW}⚠ API de procesamiento de imágenes: DISPONIBLE PERO PUEDE TENER PROBLEMAS (código $response)${NC}"
  fi
else
  echo -e "${RED}✗ Backend en puerto 3001: NO DISPONIBLE${NC}"
  echo -e "${YELLOW}⚠ Para iniciar todos los servicios, ejecute: bun dev${NC}"
fi

echo ""
echo -e "${CYAN}Estado de puertos:${NC}"
netstat -ano | grep ":3000 " | grep "LISTENING"
netstat -ano | grep ":3001 " | grep "LISTENING"
echo ""

echo -e "${CYAN}Procesos asociados:${NC}"
for pid in $(netstat -ano | grep ":3000\|:3001" | grep "LISTENING" | awk '{print $5}'); do
  echo -n "PID $pid: "
  tasklist | findstr "$pid"
done
