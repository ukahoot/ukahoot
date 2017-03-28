#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "httpserv.h"
#include "request.h"
#include "kahoot.h"

#define PORT 5556
#define BACKLOG 5
#define HEADERS "HTTP/1.1 200 OK\
Server: openresty/1.11.2.2\
Date: Tue, 28 Mar 2017 14:55:03 GMT\
Content-Type: application/json\
Transfer-Encoding: chunked\
Connection: keep-alive\
Vary: Accept-Encoding\
x-kahoot-session-token: UhMIEhNAWF8LCgRTUSdNKwx+LWBRW39dfjoTTmwAcXBwCDdZDV1qfXcJJwJmLQdFLE0Obh9XW2d1GRB5QVJ6eF5fOU8GUgNvcgV7BW8DDlA5eGBcYG5XYjRmPS1CGGFP\r\n\
\
1a4\
{\"twoFactorAuth\":false,\"challenge\":\"decode('rX7Rw1SRHxgrZVYKWkGHmVATO4zEGrV8Sl89RKwf3o82PZkT6e5eFjYNlPyu1HOpp724MtdhTGqgXHPLcYxNkBPjuEdarpy0BJJ1'); function decode(message) {var offset = ((67 + 21 * (98 * 54)) + (8 + 98) + 15); console.log(\"Offset derived as:\", offset); return _.replace(message, /./g, function(char, position) {return String.fromCharCode((((char.charCodeAt(0) * position) + offset) % 77) + 48);});}\"}\
0" // Sample headers

int main(int argc, char* argv[]) {
	setup_openssl();
	char* htoken = get_header_token(HEADERS);
	if (htoken) printf("found token %s\n", htoken);
	else printf("not found\n");
	return 0;
};