CC=mcs
SRC_DIR=src
OUT_FILE=tokenserver
OUT_DIR=out
ARGS=-target:exe -sdk:4.6
main:
	rm -f $(OUT_DIR)/$(OUT_FILE)
	$(CC) -out:$(OUT_DIR)/$(OUT_FILE) $(ARGS) $(SRC_DIR)/*.cs
run:
	rm -f $(OUT_FILE)
	$(CC) -out:$(OUT_DIR)/$(OUT_FILE) $(ARGS) $(SRC_DIR)/*.cs
	mono --runtime=4 $(OUT_DIR)/$(OUT_FILE)