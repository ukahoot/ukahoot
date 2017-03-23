OUT_FILE = out # Binary file name
SRC_DIR = src # Source code directory

CC = gcc
OPTS =-pthread -lpthread
SRC =$(wildcard src/*.c)

all:
	mkdir -p out
	$(CC) -o out/$(OUT_FILE) $(OPTS) $(SRC)
run:
	mkdir -p out
	$(CC) -o out/$(OUT_FILE) $(OPTS) $(SRC)
	clear
	out/$(OUT_FILE)
clean:
	rm -rf out/