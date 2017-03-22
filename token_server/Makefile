OUT_DIR = out # Binary directory
OUT_NAME = out # Binary file name
SRC_DIR = src # Source code directory

CC = gcc
OPTS = -pthread -lpthread
SRC = $(wildcard src/*.c)
OUT = $(OUT_DIR)/$(OUT_NAME)

all:
	mkdir -p out
	$(CC) -o $(OUT) $(OPTS) $(SRC)