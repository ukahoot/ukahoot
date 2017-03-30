OUT_FILE = tokenserver # Binary file name
SRC_DIR = src # Source code directory

CC = gcc
OPTS =-lssl -lcrypto -pthread -lpthread
SRC =$(wildcard src/*.c)

all:
	clear
	mkdir -p out
	$(CC) -o out/$(OUT_FILE) $(SRC) $(OPTS) 
run:
	mkdir -p out
	$(CC) -o out/$(OUT_FILE) $(SRC) $(OPTS) 
	clear
	out/$(OUT_FILE)
clean:
	rm -rf out/