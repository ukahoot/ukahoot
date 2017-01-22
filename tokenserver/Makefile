CC=mcs
SRC_DIR=src
OUT_FILE=tokenserver
ARGS=-target:exe -sdk:4.5 /reference:lib/System.Net.Http.dll
main:
	rm -f $(OUT_FILE)
	$(CC) -out:$(OUT_FILE) $(ARGS) $(SRC_DIR)/*.cs
run:
	rm -f $(OUT_FILE)
	$(CC) -out:$(OUT_FILE) $(ARGS) $(SRC_DIR)/*.cs
	mono --runtime=4 $(OUT_FILE)