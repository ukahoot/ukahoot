CC=mcs
SRC_DIR=src
OUT_FILE=tokenserver
ARGS=-target:exe -sdk:4.5
main:
	$(CC) -out:$(OUT_FILE) $(ARGS) $(SRC_DIR)/*.cs
run:
	$(CC) -out:$(OUT_FILE) $(ARGS) $(SRC_DIR)/*.cs
	mono --runtime=4 $(OUT_FILE)