#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "httpserv.h"
#include "request.h"
#include "kahoot.h"

#define PORT 5556
#define BACKLOG 5
#define HEADERS "HTTP/1.1 200 OK\r\n\
Server: openresty/1.11.2.2\r\n\
Date: Tue, 28 Mar 2017 14:55:03 GMT\r\n\
Content-Type: application/json\r\n\
Transfer-Encoding: chunked\r\n\
Connection: keep-alive\r\n\
Vary: Accept-Encoding\r\n\
x-kahoot-session-token: UhMIEhNAWF8LCgRTUSdNKwx+LWBRW39dfjoTTmwAcXBwCDdZDV1qfXcJJwJmLQdFLE0Obh9XW2d1GRB5QVJ6eF5fOU8GUgNvcgV7BW8DDlA5eGBcYG5XYjRmPS1CGGFP\r\n\
\r\n\
1a4\r\n\
{\"twoFactorAuth\":false,\"challenge\":\"decode('rX7Rw1SRHxgrZVYKWkGHmVATO4zEGrV8Sl89RKwf3o82PZkT6e5eFjYNlPyu1HOpp724MtdhTGqgXHPLcYxNkBPjuEdarpy0BJJ1'); function decode(message) {var offset = ((67 + 21 * (98 * 54)) + (8 + 98) + 15); console.log(\"Offset derived as:\", offset); return _.replace(message, /./g, function(char, position) {return String.fromCharCode((((char.charCodeAt(0) * position) + offset) % 77) + 48);});}\"}\
\r\n0\r\n\r\n" // Sample headers

int main(int argc, char* argv[]) {
	setup_openssl();
	char* htoken = get_header_token(HEADERS);
	if (!htoken) return 1;
	char* res_body = get_response_body(HEADERS);
	if (!res_body) return 1;
	else printf("%s\n", res_body);
	return 0;
};