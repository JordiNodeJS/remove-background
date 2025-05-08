#!/bin/bash
cd apps/frontend && bun run start &
cd .. &
cd apps/api && bun run start &
wait