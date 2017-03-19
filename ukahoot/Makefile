# Manually order files or else the built file will not work correctly
SRC =src/Style.js
SRC +=src/Bypass.js
SRC +=src/protocol/Token.js
SRC +=src/protocol/KahootSocket.js
SRC +=src/protocol/Packet.js
SRC +=src/protocol/PacketHandler.js
SRC +=$(wildcard src/interface/*.js)
SRC +=$(wildcard src/interface/*/*.js)
SRC +=src/ukahoot.js

LIB =$(wildcard lib/*.js)
OUT =ukahoot.build.js
OPTS =--minified

client:
	clear
	babel -o $(OUT) $(OPTS) $(LIB) $(SRC)
electron:
	npm run build
clean:
	rm -rf dist/
	rm -f $(OUT)
clean-electron:
	rm -rf dist/