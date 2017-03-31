OUT_FILE = tokenserver # Binary file name
SRC_DIR = src # Source code directory
RUN_PORT = 5556 # The port the server will use when using the makefile to launch the application

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
	out/$(OUT_FILE) -p $(RUN_PORT)
clean:
	rm -rf out/