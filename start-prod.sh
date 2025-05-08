#!/bin/bash
(cd apps/frontend && bun run start) &
(cd apps/api && bun run start) &
wait