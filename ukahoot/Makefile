# Manually order files or else the built file will not work correctly
SRC =src/Style.js
SRC +=src/Bypass.js
SRC +=src/protocol/Token.js
SRC +=src/protocol/KahootSocket.js
SRC +=src/protocol/Packet.js
SRC +=src/protocol/PacketHandler.js
SRC +=$(wildcard src/interface/*.js)
SRC +=$(wildcard src/interface/*/*.js)

# Add electron interface files
SRC += $(wildcard src/electron/interface/*.js)

SRC +=src/ukahoot.js

MOBILE_SRC := $(filter-out src/ukahoot.js,$(SRC))
MOBILE_SRC +=src/mobile/MobileInterface.js
MOBILE_SRC +=src/ukahoot.js

LIB =$(wildcard lib/*.js)
OUT =ukahoot.build.js
MOBILE_OUT =ukahoot.m.build.js
OPTS =--minified

client:
	clear
	babel -o $(OUT) $(OPTS) $(LIB) $(SRC)
mobile-client:
	clear
	babel -o $(MOBILE_OUT) $(OPTS) $(LIB) $(MOBILE_SRC)
electron:
	babel -o $(OUT) $(OPTS) $(LIB) $(SRC)
	npm run build
mac-electron:
	babel -o $(OUT) $(OPTS) $(LIB) $(SRC)
	npm run build-mac
clean:
	rm -rf dist/
	rm -f $(OUT)
	rm -f $(MOBILE_OUT)
clean-electron:
	rm -rf dist/